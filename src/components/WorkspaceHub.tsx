import { useState, useEffect } from 'react'
import { ExternalLink, Pin, FileText, Table, AlertTriangle, CheckCircle, Loader2, LinkIcon, Calendar, ListTodo } from 'lucide-react'
import { eliminationTraps, googleDocsLinks } from '@/data/currentAffairs'
import { cn } from '@/lib/cn'

interface GoogleDoc { id: string; name: string; modified: string }
interface GoogleSheet { id: string; name: string; modified: string }
interface GoogleEvent { id: string; summary: string; start: string; end: string }
interface GoogleTask { id: string; title: string; status: string; due: string | null }

export default function WorkspaceHub() {
  const [googleConnected, setGoogleConnected] = useState(false)
  const [googleEmail, setGoogleEmail] = useState('')
  const [docs, setDocs] = useState<GoogleDoc[]>([])
  const [sheets, setSheets] = useState<GoogleSheet[]>([])
  const [events, setEvents] = useState<GoogleEvent[]>([])
  const [tasks, setTasks] = useState<GoogleTask[]>([])
  const [loading, setLoading] = useState(false)
  const [activeSection, setActiveSection] = useState<'docs' | 'sheets' | 'calendar' | 'tasks'>('docs')

  useEffect(() => {
    checkGoogleStatus()
  }, [])

  const checkGoogleStatus = async () => {
    try {
      const res = await fetch('/api/google/status')
      const data = await res.json()
      setGoogleConnected(data.connected)
      setGoogleEmail(data.email || '')
      if (data.connected) fetchAllGoogleData()
    } catch { /* not connected */ }
  }

  const connectGoogle = async () => {
    try {
      const origin = window.location.origin
      const res = await fetch(`/api/google/auth-url?origin=${encodeURIComponent(origin)}`)
      const data = await res.json()
      if (data.url) {
        window.open(data.url, 'google-oauth', 'width=500,height=700')
        window.addEventListener('message', (e) => {
          if (e.data?.google === 'connected') {
            setGoogleConnected(true)
            setGoogleEmail(e.data.email || '')
            fetchAllGoogleData()
          }
        })
      }
    } catch { /* handle error */ }
  }

  const fetchAllGoogleData = async () => {
    setLoading(true)
    try {
      const [docsRes, sheetsRes, calRes, tasksRes] = await Promise.allSettled([
        fetch('/api/google/docs').then(r => r.json()),
        fetch('/api/google/sheets').then(r => r.json()),
        fetch('/api/google/calendar').then(r => r.json()),
        fetch('/api/google/tasks').then(r => r.json()),
      ])
      if (docsRes.status === 'fulfilled') setDocs(docsRes.value.docs || [])
      if (sheetsRes.status === 'fulfilled') setSheets(sheetsRes.value.sheets || [])
      if (calRes.status === 'fulfilled') setEvents(calRes.value.events || [])
      if (tasksRes.status === 'fulfilled') setTasks(tasksRes.value.tasks || [])
    } catch { /* partial failure OK */ }
    setLoading(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">Google Workspace Sync Hub</h2>
          <p className="text-sm text-slate-400 mt-0.5">Connected docs, sheets, calendar, and tasks</p>
        </div>
        <div className="flex items-center gap-3">
          {googleConnected ? (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span className="text-xs text-emerald-300">{googleEmail}</span>
            </div>
          ) : (
            <button
              onClick={connectGoogle}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/15 text-blue-400 hover:bg-blue-500/25 transition-colors text-sm font-medium"
            >
              <LinkIcon className="w-4 h-4" />
              Connect Google Account
            </button>
          )}
        </div>
      </div>

      {googleConnected && (
        <>
          {/* Tabs */}
          <div className="flex items-center gap-1 bg-slate-800/50 rounded-lg p-1 border border-slate-700/50">
            {([
              { id: 'docs' as const, label: 'Google Docs', icon: FileText, count: docs.length },
              { id: 'sheets' as const, label: 'Google Sheets', icon: Table, count: sheets.length },
              { id: 'calendar' as const, label: 'Calendar', icon: Calendar, count: events.length },
              { id: 'tasks' as const, label: 'Tasks', icon: ListTodo, count: tasks.length },
            ]).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all',
                  activeSection === tab.id ? 'bg-blue-500/20 text-blue-400' : 'text-slate-400 hover:text-white'
                )}
              >
                <tab.icon className="w-3 h-3" />
                {tab.label}
                <span className="px-1 py-0.5 text-[9px] rounded bg-slate-700/50">{tab.count}</span>
              </button>
            ))}
            <button onClick={fetchAllGoogleData} className="ml-auto px-3 py-1.5 text-xs text-slate-400 hover:text-white transition-colors">
              {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : '↻ Refresh'}
            </button>
          </div>

          {/* Content */}
          {activeSection === 'docs' && (
            <div className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-4">
              <h3 className="text-sm font-semibold text-white mb-3">📄 Google Docs</h3>
              {docs.length === 0 ? (
                <p className="text-xs text-slate-500 py-4 text-center">No docs found</p>
              ) : (
                <div className="space-y-1.5">
                  {docs.map((doc) => (
                    <a key={doc.id} href={`https://docs.google.com/document/d/${doc.id}`} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-slate-800/50 border border-slate-700/30 hover:border-blue-500/40 hover:bg-blue-500/5 transition-all group">
                      <FileText className="w-4 h-4 text-slate-500 group-hover:text-blue-400 flex-shrink-0" />
                      <span className="text-xs text-slate-300 truncate flex-1">{doc.name}</span>
                      <span className="text-[10px] text-slate-600">{doc.modified ? new Date(doc.modified).toLocaleDateString() : ''}</span>
                      <ExternalLink className="w-3 h-3 text-slate-600 group-hover:text-blue-400 flex-shrink-0" />
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeSection === 'sheets' && (
            <div className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-4">
              <h3 className="text-sm font-semibold text-white mb-3">📊 Google Sheets</h3>
              {sheets.length === 0 ? (
                <p className="text-xs text-slate-500 py-4 text-center">No sheets found</p>
              ) : (
                <div className="space-y-1.5">
                  {sheets.map((sheet) => (
                    <a key={sheet.id} href={`https://docs.google.com/spreadsheets/d/${sheet.id}`} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-slate-800/50 border border-slate-700/30 hover:border-emerald-500/40 hover:bg-emerald-500/5 transition-all group">
                      <Table className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 flex-shrink-0" />
                      <span className="text-xs text-slate-300 truncate flex-1">{sheet.name}</span>
                      <span className="text-[10px] text-slate-600">{sheet.modified ? new Date(sheet.modified).toLocaleDateString() : ''}</span>
                      <ExternalLink className="w-3 h-3 text-slate-600 group-hover:text-emerald-400 flex-shrink-0" />
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeSection === 'calendar' && (
            <div className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-4">
              <h3 className="text-sm font-semibold text-white mb-3">📅 Google Calendar</h3>
              {events.length === 0 ? (
                <p className="text-xs text-slate-500 py-4 text-center">No upcoming events</p>
              ) : (
                <div className="space-y-1.5">
                  {events.map((event) => (
                    <div key={event.id} className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-slate-800/50 border border-slate-700/30">
                      <Calendar className="w-4 h-4 text-violet-400 flex-shrink-0" />
                      <span className="text-xs text-white font-medium">{event.summary}</span>
                      <span className="text-[10px] text-slate-500 ml-auto">
                        {event.start ? new Date(event.start).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }) : ''}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeSection === 'tasks' && (
            <div className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-4">
              <h3 className="text-sm font-semibold text-white mb-3">✅ Google Tasks</h3>
              {tasks.length === 0 ? (
                <p className="text-xs text-slate-500 py-4 text-center">No tasks found</p>
              ) : (
                <div className="space-y-1.5">
                  {tasks.map((task) => (
                    <div key={task.id} className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-slate-800/50 border border-slate-700/30">
                      <div className={cn('w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center', task.status === 'completed' ? 'bg-emerald-500 border-emerald-500' : 'border-slate-600')}>
                        {task.status === 'completed' && <CheckCircle className="w-3 h-3 text-white" />}
                      </div>
                      <span className={cn('text-xs font-medium', task.status === 'completed' ? 'text-slate-500 line-through' : 'text-white')}>{task.title}</span>
                      {task.due && <span className="text-[10px] text-slate-500 ml-auto">Due: {new Date(task.due).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {!googleConnected && (
        <div className="px-4 py-3 rounded-xl bg-blue-500/5 border border-blue-500/20">
          <p className="text-xs text-blue-300">
            🔗 Connect your Google account to sync Docs, Sheets, Calendar, and Tasks directly into your Command Hub.
            This enables live progress tracking without manual entry.
          </p>
        </div>
      )}

      {/* Elimination Traps Pinboard */}
      <div className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-4">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-semibold text-white">Elimination Traps Pinboard</h3>
          <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-amber-500/20 text-amber-400">HIGH YIELD</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {eliminationTraps.map((trap) => (
            <div key={trap.id} className={cn('px-3 py-2.5 rounded-lg border transition-all hover:scale-[1.01]',
              trap.importance === 'critical' ? 'bg-red-500/5 border-red-500/20 hover:border-red-500/40'
                : trap.importance === 'high' ? 'bg-amber-500/5 border-amber-500/20 hover:border-amber-500/40'
                  : 'bg-slate-800/40 border-slate-700/30 hover:border-slate-600/40')}>
              <div className="flex items-start gap-2">
                <Pin className={cn('w-3 h-3 mt-0.5 flex-shrink-0',
                  trap.importance === 'critical' ? 'text-red-400' : trap.importance === 'high' ? 'text-amber-400' : 'text-slate-500')} />
                <div>
                  <p className="text-xs text-white font-medium leading-snug">{trap.trap}</p>
                  <span className={cn('inline-block mt-1 px-1.5 py-0.5 text-[9px] font-bold rounded uppercase',
                    trap.subject === 'Economy' ? 'bg-amber-500/15 text-amber-400'
                      : trap.subject === 'Polity' ? 'bg-indigo-500/15 text-indigo-400'
                        : 'bg-emerald-500/15 text-emerald-400')}>
                    {trap.subject}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
