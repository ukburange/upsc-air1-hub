import { useState, useEffect } from 'react'
import { useLanguage } from '@/lib/i18n'
import { cn } from '@/lib/cn'
import {
  Calendar, FileText, Table2, RefreshCw, Check, Loader2,
  LogOut, ChevronDown, ChevronRight, ExternalLink, BookOpen
} from 'lucide-react'

type GoogleTab = 'calendar' | 'docs' | 'sheets'
type SyncStatus = 'idle' | 'syncing' | 'done' | 'error'

interface CalendarEvent {
  id: string
  summary: string
  description?: string
  start: { date?: string; dateTime?: string }
  end: { date?: string; dateTime?: string }
}

interface DocItem {
  id: string
  title: string
  modifiedTime: string
}

interface SheetItem {
  id: string
  name: string
  createdTime?: string
}

interface SyncResult {
  type: string
  count: number
  items: string[]
  timestamp: string
}

export default function GoogleWorkspace() {
  const { t } = useLanguage()
  const [connected, setConnected] = useState(false)
  const [email, setEmail] = useState('')
  const [activeTab, setActiveTab] = useState<GoogleTab>('calendar')
  const [loading, setLoading] = useState(false)
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [docs, setDocs] = useState<DocItem[]>([])
  const [sheets, setSheets] = useState<SheetItem[]>([])
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle')
  const [syncResult, setSyncResult] = useState<SyncResult | null>(null)
  const [error, setError] = useState('')
  const [expandedItem, setExpandedItem] = useState<string | null>(null)

  useEffect(() => {
    checkStatus()
  }, [])

  async function checkStatus() {
    try {
      const res = await fetch('/api/google/auth?action=status')
      const data = await res.json()
      if (data.connected) {
        setConnected(true)
        setEmail(data.email || '')
        loadData('calendar')
      }
    } catch {}
  }

  function connectGoogle() {
    window.location.href = '/api/google/auth?action=auth-url'
  }

  function disconnectGoogle() {
    fetch('/api/google/auth?action=disconnect')
    setConnected(false)
    setEmail('')
    setEvents([])
    setDocs([])
    setSheets([])
  }

  async function loadData(tab: GoogleTab) {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/google/data?type=${tab}`)
      const data = await res.json()
      if (data.error) {
        setError(data.error)
        return
      }
      if (tab === 'calendar') setEvents(data.items || [])
      if (tab === 'docs') setDocs(data.items || [])
      if (tab === 'sheets') setSheets(data.items || [])
    } catch (e) {
      setError('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  async function syncToSystem(type: GoogleTab) {
    setSyncStatus('syncing')
    try {
      const res = await fetch('/api/google/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, action: 'sync' }),
      })
      const data = await res.json()
      if (data.error) {
        setSyncStatus('error')
        setError(data.error)
        return
      }
      setSyncResult(data)
      setSyncStatus('done')
      setTimeout(() => setSyncStatus('idle'), 3000)
    } catch {
      setSyncStatus('error')
    }
  }

  function handleTabChange(tab: GoogleTab) {
    setActiveTab(tab)
    if (connected) loadData(tab)
  }

  if (!connected) {
    return (
      <div className="rounded-xl border border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-blue-500/15 flex items-center justify-center">
            <span className="text-xl">🔗</span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">{t('google.title')}</h3>
            <p className="text-[11px] text-slate-400">{t('google.description')}</p>
          </div>
        </div>
        <button
          onClick={connectGoogle}
          className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-bold transition-all flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          {t('google.connectButton')}
        </button>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-slate-700/50 bg-slate-800/30 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700/50">
        <div className="flex items-center gap-2">
          <span className="text-lg">🔗</span>
          <div>
            <h3 className="text-xs font-bold text-white">{t('google.connectedTitle')}</h3>
            <p className="text-[10px] text-emerald-400">✓ {email}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {syncStatus === 'done' && (
            <span className="text-[10px] text-emerald-400 flex items-center gap-1">
              <Check className="w-3 h-3" /> Synced
            </span>
          )}
          <button
            onClick={() => syncToSystem(activeTab)}
            disabled={syncStatus === 'syncing'}
            className={cn(
              'flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold transition-all',
              syncStatus === 'syncing'
                ? 'bg-amber-500/15 text-amber-400'
                : 'bg-blue-500/15 text-blue-400 hover:bg-blue-500/25'
            )}
          >
            {syncStatus === 'syncing' ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : syncStatus === 'done' ? (
              <Check className="w-3 h-3" />
            ) : (
              <RefreshCw className="w-3 h-3" />
            )}
            {syncStatus === 'done' ? t('google.synced') : t('google.syncToSystem')}
          </button>
          <button
            onClick={disconnectGoogle}
            className="p-1 rounded text-slate-500 hover:text-red-400 transition-colors"
          >
            <LogOut className="w-3 h-3" />
          </button>
        </div>
      </div>

      <div className="flex border-b border-slate-700/50">
        {([
          { id: 'calendar' as GoogleTab, icon: Calendar, label: t('google.tabCalendar') },
          { id: 'docs' as GoogleTab, icon: FileText, label: t('google.tabDocs') },
          { id: 'sheets' as GoogleTab, icon: Table2, label: t('google.tabSheets') },
        ]).map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={cn(
              'flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-[11px] font-bold transition-all border-b-2',
              activeTab === tab.id
                ? 'border-blue-500 text-blue-400 bg-blue-500/5'
                : 'border-transparent text-slate-500 hover:text-slate-300'
            )}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-3 max-h-80 overflow-y-auto">
        {error && (
          <div className="mb-3 p-2 rounded bg-red-500/10 border border-red-500/20 text-[11px] text-red-400">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
            <span className="ml-2 text-xs text-slate-400">{t('google.loading')}</span>
          </div>
        ) : (
          <>
            {activeTab === 'calendar' && (
              <div className="space-y-1.5">
                {events.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-4">{t('google.noCalendar')}</p>
                ) : (
                  events.map((ev) => (
                    <div key={ev.id} className="rounded-lg bg-slate-800/50 border border-slate-700/30 p-2.5">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xs font-bold text-white">{ev.summary}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            {ev.start.dateTime
                              ? new Date(ev.start.dateTime).toLocaleString('mr-IN')
                              : ev.start.date}
                          </p>
                        </div>
                        <Calendar className="w-3.5 h-3.5 text-blue-400 flex-shrink-0 mt-0.5" />
                      </div>
                      {ev.description && (
                        <p className="text-[10px] text-slate-500 mt-1 line-clamp-2">{ev.description}</p>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'docs' && (
              <div className="space-y-1.5">
                {docs.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-4">{t('google.noDocs')}</p>
                ) : (
                  docs.map((doc) => (
                    <div
                      key={doc.id}
                      className="rounded-lg bg-slate-800/50 border border-slate-700/30 p-2.5 cursor-pointer hover:border-blue-500/30 transition-colors"
                      onClick={() => setExpandedItem(expandedItem === doc.id ? null : doc.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {expandedItem === doc.id ? (
                            <ChevronDown className="w-3 h-3 text-slate-400" />
                          ) : (
                            <ChevronRight className="w-3 h-3 text-slate-400" />
                          )}
                          <div>
                            <p className="text-xs font-bold text-white">{doc.title}</p>
                            <p className="text-[10px] text-slate-500">
                              {t('google.modified')}: {new Date(doc.modifiedTime).toLocaleDateString('mr-IN')}
                            </p>
                          </div>
                        </div>
                        <ExternalLink className="w-3 h-3 text-blue-400" />
                      </div>
                      {expandedItem === doc.id && (
                        <div className="mt-2 pt-2 border-t border-slate-700/30">
                          <p className="text-[10px] text-slate-400">{t('google.docHint')}</p>
                          <a
                            href={`https://docs.google.com/document/d/${doc.id}/edit`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] text-blue-400 hover:underline mt-1 inline-flex items-center gap-1"
                          >
                            <BookOpen className="w-3 h-3" /> {t('google.openDoc')}
                          </a>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'sheets' && (
              <div className="space-y-1.5">
                {sheets.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-4">{t('google.noSheets')}</p>
                ) : (
                  sheets.map((sheet) => (
                    <div
                      key={sheet.id}
                      className="rounded-lg bg-slate-800/50 border border-slate-700/30 p-2.5 cursor-pointer hover:border-green-500/30 transition-colors"
                      onClick={() => setExpandedItem(expandedItem === sheet.id ? null : sheet.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {expandedItem === sheet.id ? (
                            <ChevronDown className="w-3 h-3 text-slate-400" />
                          ) : (
                            <ChevronRight className="w-3 h-3 text-slate-400" />
                          )}
                          <div>
                            <p className="text-xs font-bold text-white">{sheet.name}</p>
                            {sheet.createdTime && (
                              <p className="text-[10px] text-slate-500">
                                {new Date(sheet.createdTime).toLocaleDateString('mr-IN')}
                              </p>
                            )}
                          </div>
                        </div>
                        <ExternalLink className="w-3 h-3 text-green-400" />
                      </div>
                      {expandedItem === sheet.id && (
                        <div className="mt-2 pt-2 border-t border-slate-700/30">
                          <a
                            href={`https://docs.google.com/spreadsheets/d/${sheet.id}/edit`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] text-green-400 hover:underline inline-flex items-center gap-1"
                          >
                            <Table2 className="w-3 h-3" /> {t('google.openSheet')}
                          </a>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        )}
      </div>

      {syncResult && (
        <div className="mx-3 mb-3 p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
          <p className="text-[11px] font-bold text-emerald-400">{t('google.syncResult')}</p>
          <p className="text-[10px] text-slate-400 mt-1">
            {syncResult.count} {syncResult.type} {t('google.syncedItems')}
          </p>
          {syncResult.items.length > 0 && (
            <ul className="mt-1 space-y-0.5">
              {syncResult.items.slice(0, 5).map((item, i) => (
                <li key={i} className="text-[10px] text-slate-500">• {item}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
