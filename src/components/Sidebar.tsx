import {
  LayoutDashboard,
  BookOpen,
  FileText,
  Newspaper,
  Timer,
  AlertTriangle,
  Sparkles,
  Brain,
  Radio,
  ChevronLeft,
  ChevronRight,
  Crown,
  Zap,
  BookMarked,
  CalendarClock,
  BarChart3,
} from 'lucide-react'
import { cn } from '@/lib/cn'
import { useLanguage } from '@/lib/i18n'

export type TabId = 'dashboard' | 'syllabus' | 'workspace' | 'current-affairs' | 'routine' | 'errors' | 'ai-tutor' | 'live-ca' | 'quiz-engine' | 'revision-notes' | 'daily-plan' | 'analyzer'

interface SidebarProps {
  activeTab: TabId
  onTabChange: (tab: TabId) => void
  collapsed: boolean
  onToggle: () => void
}

const tabs: { id: TabId; label: string; icon: React.ElementType; badge?: string; group?: string }[] = [
  { id: 'dashboard', label: 'Command Center', icon: LayoutDashboard, group: 'JARVIS Core' },
  { id: 'ai-tutor', label: 'AI Guru Chanakya', icon: Sparkles, badge: 'LIVE', group: 'JARVIS Core' },
  { id: 'live-ca', label: 'Live Current Affairs', icon: Radio, badge: 'AI', group: 'JARVIS Core' },
  { id: 'quiz-engine', label: 'AI Quiz Engine', icon: Brain, badge: 'AI', group: 'JARVIS Core' },
  { id: 'daily-plan', label: 'Smart Daily Plan', icon: CalendarClock, badge: 'AI', group: 'JARVIS Core' },
  { id: 'revision-notes', label: 'Revision Notes', icon: BookMarked, badge: 'AI', group: 'Study Tools' },
  { id: 'syllabus', label: 'Syllabus Tracker', icon: BookOpen, group: 'Study Tools' },
  { id: 'analyzer', label: 'Performance Analysis', icon: BarChart3, badge: 'AI', group: 'Study Tools' },
  { id: 'workspace', label: 'Workspace Hub', icon: FileText, group: 'Tracking' },
  { id: 'current-affairs', label: 'CA Bulletin', icon: Newspaper, group: 'Tracking' },
  { id: 'routine', label: 'Daily Routine', icon: Timer, group: 'Tracking' },
  { id: 'errors', label: 'Error Matrix', icon: AlertTriangle, group: 'Tracking' },
]

export default function Sidebar({ activeTab, onTabChange, collapsed, onToggle }: SidebarProps) {
  const { t } = useLanguage()
  const fullyHidden = collapsed
  const tabLabels: Record<string, string> = {
    dashboard: t('tabs.dashboard'),
    'ai-tutor': t('tabs.ai-tutor'),
    'live-ca': t('tabs.live-ca'),
    'quiz-engine': t('tabs.quiz-engine'),
    'daily-plan': t('tabs.daily-plan'),
    'revision-notes': t('tabs.revision-notes'),
    syllabus: t('tabs.syllabus'),
    analyzer: t('tabs.analyzer'),
    workspace: t('tabs.workspace'),
    'current-affairs': t('tabs.current-affairs'),
    routine: t('tabs.routine'),
    errors: t('tabs.errors'),
  }
  return (
    <>
      {/* Floating toggle button when sidebar is hidden */}
      {fullyHidden && (
        <button
          onClick={onToggle}
          className="fixed top-3 left-3 z-[60] w-10 h-10 rounded-xl bg-slate-800/90 border border-slate-700/50 flex items-center justify-center text-slate-400 hover:text-amber-400 hover:border-amber-500/30 transition-all backdrop-blur-xl shadow-lg"
          title="Show sidebar (Ctrl+B)"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}

      {/* Sidebar */}
      {!fullyHidden && (
        <aside
          className={cn(
            'h-screen sticky top-0 flex flex-col border-r border-slate-700/50 bg-slate-900/80 backdrop-blur-xl transition-all duration-300 z-50'
          )}
          style={{ width: '240px' }}
        >
          <div className="flex items-center gap-3 px-4 py-5 border-b border-slate-700/50">
            <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <Crown className="w-5 h-5 text-white" />
            </div>
            <div className="overflow-hidden flex-1 min-w-0">
              <h1 className="text-sm font-bold text-white tracking-tight leading-tight">{t('sidebar.mission')}</h1>
              <p className="text-[10px] text-amber-400 font-semibold tracking-widest uppercase">{t('sidebar.tagline')}</p>
            </div>
            <button
              onClick={onToggle}
              className="flex-shrink-0 w-7 h-7 rounded-md flex items-center justify-center text-slate-500 hover:text-white hover:bg-slate-800/60 transition-colors"
              title="Hide sidebar (Ctrl+B)"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

          <nav className="flex-1 px-2 py-3 space-y-1 overflow-y-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-amber-500/15 text-amber-400 shadow-sm shadow-amber-500/10'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  )}
                >
                  <Icon className={cn('w-[18px] h-[18px] flex-shrink-0', isActive && 'text-amber-400')} />
                  <div className="flex items-center gap-1.5 min-w-0 flex-1">
                    <span className="truncate">{tabLabels[tab.id] || tab.label}</span>
                    {tab.badge && (
                      <span className={cn(
                        'px-1.5 py-0.5 text-[8px] font-bold rounded uppercase tracking-wider flex-shrink-0',
                        tab.badge === 'LIVE' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-purple-500/20 text-purple-400'
                      )}>
                        {tab.badge}
                      </span>
                    )}
                  </div>
                </button>
              )
            })}
          </nav>

          <div className="px-2 py-3 border-t border-slate-700/50">
            <div className="px-3 py-2.5 rounded-lg bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20">
              <p className="text-[10px] text-indigo-300 font-semibold uppercase tracking-wider">{t('sidebar.target')}</p>
              <p className="text-[11px] text-slate-300 mt-0.5">{t('sidebar.name')}</p>
            </div>
          </div>
        </aside>
      )}
    </>
  )
}
