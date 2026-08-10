import { useState, useEffect, useCallback } from 'react'
import Sidebar, { TabId } from '@/components/Sidebar'
import KPIMetrics from '@/components/KPIMetrics'
import SyllabusTracker from '@/components/SyllabusTracker'
import WorkspaceHub from '@/components/WorkspaceHub'
import { LanguageProvider, useLanguage, Language } from '@/lib/i18n'
import CurrentAffairs from '@/components/CurrentAffairs'
import DailyRoutine from '@/components/DailyRoutine'
import ErrorMatrix from '@/components/ErrorMatrix'
import AITutor from '@/components/AITutor'
import LiveCurrentAffairs from '@/components/LiveCurrentAffairs'
import AIQuizEngine from '@/components/AIQuizEngine'
import SmartRevisionNotes from '@/components/SmartRevisionNotes'
import SmartDailyPlan from '@/components/SmartDailyPlan'
import PerformanceAnalyzer from '@/components/PerformanceAnalyzer'
import { syllabusData, SyllabusPaper } from '@/data/syllabus'
import { Download, Upload, Globe, Link2, Brain } from 'lucide-react'
import GoogleWorkspace from '@/components/GoogleWorkspace'
import AIConversationImport from '@/components/AIConversationImport'
import { cn } from '@/lib/cn'

const STORAGE_KEY = 'upsc_command_hub_data'

function loadState(): { syllabus: SyllabusPaper[]; accuracy: number; pyqAlignment: number } | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return null
}

function saveState(data: { syllabus: SyllabusPaper[]; accuracy: number; pyqAlignment: number }) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export default function App() {
  const saved = loadState()
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  )
}

function AppContent() {
  const { language, setLanguage, t } = useLanguage()
  const saved = loadState()
  const [syllabus, setSyllabus] = useState<SyllabusPaper[]>(saved?.syllabus ?? syllabusData)
  const [activeTab, setActiveTab] = useState<TabId>('dashboard')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [accuracy, setAccuracy] = useState(saved?.accuracy ?? 80)
  const [pyqAlignment, setPyqAlignment] = useState(saved?.pyqAlignment ?? 85)
  const [showGooglePanel, setShowGooglePanel] = useState(false)
  const [showAIImport, setShowAIImport] = useState(false)

  useEffect(() => {
    saveState({ syllabus, accuracy, pyqAlignment })
  }, [syllabus, accuracy, pyqAlignment])

  const toggleTopic = useCallback((paperId: string, topicId: string) => {
    setSyllabus((prev) =>
      prev.map((paper) =>
        paper.id === paperId
          ? {
              ...paper,
              topics: paper.topics.map((t) => (t.id === topicId ? { ...t, completed: !t.completed } : t)),
            }
          : paper
      )
    )
  }, [])

  const exportData = () => {
    const data = { syllabus, accuracy, pyqAlignment, exportedAt: new Date().toISOString() }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `upsc-mission-air1-backup-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const importData = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target?.result as string)
          if (data.syllabus) setSyllabus(data.syllabus)
          if (data.accuracy) setAccuracy(data.accuracy)
          if (data.pyqAlignment) setPyqAlignment(data.pyqAlignment)
        } catch {
          alert('Invalid backup file')
        }
      }
      reader.readAsText(file)
    }
    input.click()
  }

  return (
    <div className="flex h-screen bg-[#0f172a] text-white overflow-hidden">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />

      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-[#0f172a]/90 backdrop-blur-xl border-b border-slate-700/50 px-6 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-base font-bold text-white flex items-center gap-2">
                <span className="text-amber-400">⚡</span> {t('app.title')}
              </h1>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {t('app.subtitle')}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowGooglePanel(!showGooglePanel)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all',
                  showGooglePanel
                    ? 'bg-blue-500/15 text-blue-400 border-blue-500/30'
                    : 'bg-slate-800/50 text-slate-400 hover:text-blue-400 border-slate-700/50 hover:border-blue-500/30'
                )}
              >
                <Link2 className="w-3 h-3" />
                Google
              </button>
              <button
                onClick={() => setShowAIImport(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/50 text-xs text-slate-400 hover:text-violet-400 border border-slate-700/50 hover:border-violet-500/30 transition-all font-bold"
              >
                <Brain className="w-3 h-3" />
                AI Import
              </button>
              <div className="flex items-center gap-1 bg-slate-800/50 rounded-lg p-1 border border-slate-700/50">
                {([
                  { code: 'en' as Language, label: 'EN' },
                  { code: 'hi' as Language, label: 'हि' },
                  { code: 'mr' as Language, label: 'म' },
                ]).map((l) => (
                  <button
                    key={l.code}
                    onClick={() => setLanguage(l.code)}
                    className={cn(
                      'px-2.5 py-1 text-[11px] font-bold rounded-md transition-all',
                      language === l.code
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'text-slate-500 hover:text-white'
                    )}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
              <button
                onClick={exportData}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/50 text-xs text-slate-400 hover:text-white border border-slate-700/50 transition-colors"
              >
                <Download className="w-3 h-3" />
                {t('app.export')}
              </button>
              <button
                onClick={importData}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/50 text-xs text-slate-400 hover:text-white border border-slate-700/50 transition-colors"
              >
                <Upload className="w-3 h-3" />
                {t('app.import')}
              </button>
            </div>
          </div>
        </header>

        {/* Google Workspace Panel */}
        {showGooglePanel && (
          <div className="px-6 pt-4">
            <GoogleWorkspace />
          </div>
        )}

        {/* AI Conversation Import Dialog */}
        <AIConversationImport open={showAIImport} onClose={() => setShowAIImport(false)} />

        <div className="p-6 space-y-6">
          {/* KPI Metrics Bar - always visible */}
          <KPIMetrics syllabus={syllabus} accuracy={accuracy} pyqAlignment={pyqAlignment} />

          {/* Tab Content */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Quick Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Motivation Card */}
                <div className="rounded-xl border border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-orange-500/5 p-5">
                  <h3 className="text-sm font-bold text-amber-400 mb-2">🎯 {t('dashboard.dailyMission')}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {t('dashboard.dailyMissionText')}
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <div className="px-2 py-1 rounded bg-amber-500/15 text-[10px] font-bold text-amber-400">
                      {t('dashboard.hoursDaily')}
                    </div>
                    <div className="px-2 py-1 rounded bg-emerald-500/15 text-[10px] font-bold text-emerald-400">
                      {t('dashboard.nonNegotiable')}
                    </div>
                  </div>
                </div>

                {/* Priority Matrix */}
                <div className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-5">
                  <h3 className="text-sm font-bold text-white mb-3">📊 {t('dashboard.priorityMatrix')}</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-red-400 font-medium">Tier 1 — Core Pillars</span>
                      <span className="text-xs text-slate-400">70%+ marks</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-yellow-400 font-medium">Tier 2 — High Yield</span>
                      <span className="text-xs text-slate-400">Targeted scan</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500 font-medium">Tier 3 — Mains Only</span>
                      <span className="text-xs text-slate-500">Defer till Jun 2027</span>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-5">
                  <h3 className="text-sm font-bold text-white mb-3">⚡ {t('dashboard.quickStats')}</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">{t('dashboard.totalMicroTopics')}</span>
                      <span className="text-xs text-white font-bold">
                        {syllabus.reduce((s, p) => s + p.topics.length, 0)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">{t('dashboard.done')}</span>
                      <span className="text-xs text-emerald-400 font-bold">
                        {syllabus.reduce((s, p) => s + p.topics.filter((t) => t.completed).length, 0)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">Remaining</span>
                      <span className="text-xs text-amber-400 font-bold">
                        {syllabus.reduce((s, p) => s + p.topics.length, 0) -
                          syllabus.reduce((s, p) => s + p.topics.filter((t) => t.completed).length, 0)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">Papers Completed</span>
                      <span className="text-xs text-indigo-400 font-bold">
                        {syllabus.filter((p) => p.topics.every((t) => t.completed)).length}/{syllabus.length}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Current Affairs */}
              <div className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-4">
                <h3 className="text-sm font-bold text-white mb-3">📰 Latest Current Affairs Alerts</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-800/50">
                    <div className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" />
                    <span className="text-xs text-white">GST Council Voting: Center 1/3, States 2/3 — 75% majority</span>
                    <span className="text-[10px] text-slate-500 ml-auto">Polity + Economy</span>
                  </div>
                  <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-800/50">
                    <div className="w-2 h-2 rounded-full bg-red-400 flex-shrink-0" />
                    <span className="text-xs text-white">CEC Act 2023: CJI NOT in Selection Committee</span>
                    <span className="text-[10px] text-slate-500 ml-auto">Polity</span>
                  </div>
                  <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-800/50">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
                    <span className="text-xs text-white">FRA 2006: Nodal Ministry is Tribal Affairs, NOT MoEFCC</span>
                    <span className="text-[10px] text-slate-500 ml-auto">Environment</span>
                  </div>
                </div>
              </div>

              {/* Accuracy & PYQ Input */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-4">
                  <h3 className="text-sm font-bold text-white mb-3">🎯 Test Accuracy Rate</h3>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={accuracy}
                      onChange={(e) => setAccuracy(Number(e.target.value))}
                      className="flex-1 accent-amber-500"
                    />
                    <span className="text-lg font-bold text-amber-400 w-14 text-right">{accuracy}%</span>
                  </div>
                </div>
                <div className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-4">
                  <h3 className="text-sm font-bold text-white mb-3">📈 PYQ Trend Alignment</h3>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={pyqAlignment}
                      onChange={(e) => setPyqAlignment(Number(e.target.value))}
                      className="flex-1 accent-indigo-500"
                    />
                    <span className="text-lg font-bold text-indigo-400 w-14 text-right">{pyqAlignment}%</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'syllabus' && (
            <SyllabusTracker syllabus={syllabus} onToggleTopic={toggleTopic} />
          )}

          {activeTab === 'workspace' && <WorkspaceHub />}

          {activeTab === 'current-affairs' && <CurrentAffairs />}

          {activeTab === 'routine' && <DailyRoutine />}

          {activeTab === 'errors' && <ErrorMatrix />}

          {activeTab === 'ai-tutor' && <AITutor />}

          {activeTab === 'live-ca' && <LiveCurrentAffairs />}

          {activeTab === 'quiz-engine' && <AIQuizEngine />}

          {activeTab === 'revision-notes' && <SmartRevisionNotes />}

          {activeTab === 'daily-plan' && <SmartDailyPlan />}

          {activeTab === 'analyzer' && <PerformanceAnalyzer />}
        </div>
      </main>
    </div>
  )
}
