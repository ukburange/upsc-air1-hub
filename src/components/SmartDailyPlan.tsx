import { useState, useMemo } from 'react'
import { CalendarClock, Loader2, Zap, Clock, Target, BookOpen, Brain, Coffee } from 'lucide-react'
import { cn } from '@/lib/cn'
import { syllabusData } from '@/data/syllabus'

interface DailyPlan {
  date?: string
  blocks?: Array<{
    time: string
    exactTopic: string
    gsLink: string
    method: string
    target: string
  }>
  dailyQuote?: string
  totalHours?: number
  priorityFocus?: string
  raw?: string
}

const BLOCK_ICONS = [Clock, BookOpen, Brain, Coffee, Zap, Target, BookOpen, Brain]

export default function SmartDailyPlan() {
  const [plan, setPlan] = useState<DailyPlan | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const syllabusInfo = useMemo(() => {
    const completed: string[] = []
    const pending: string[] = []
    syllabusData.forEach((paper) => {
      paper.topics.forEach((t) => {
        if (t.completed) completed.push(t.name)
        else pending.push(t.name)
      })
    })
    return { completed, pending }
  }, [])

  const generatePlan = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/gemini/smart-daily-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          completedTopics: syllabusInfo.completed.slice(0, 20),
          pendingTopics: syllabusInfo.pending.slice(0, 20),
          weakTopics: ['Geography', 'Environment'],
          accuracy: 80,
        }),
      })
      const data = await res.json()
      if (res.ok) setPlan(data)
      else setError(data.error || 'Failed to generate plan')
    } catch {
      setError('Connection error')
    }
    setLoading(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
            <CalendarClock className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Smart Daily Plan</h2>
            <p className="text-xs text-slate-400">AI-generated hour-by-hour study schedule</p>
          </div>
        </div>
        <button
          onClick={generatePlan}
          disabled={loading}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
            loading ? 'bg-slate-800/50 text-slate-500' : 'bg-violet-500/15 text-violet-400 hover:bg-violet-500/25'
          )}
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
          {loading ? 'Planning...' : 'Generate Tomorrow\'s Plan'}
        </button>
      </div>

      {error && <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400">{error}</div>}

      {plan && !plan.raw && (
        <div className="space-y-4">
          {plan.priorityFocus && (
            <div className="px-4 py-3 rounded-xl bg-violet-500/10 border border-violet-500/20">
              <p className="text-xs text-violet-300 font-semibold uppercase tracking-wider mb-1">Priority Focus</p>
              <p className="text-sm text-white">{plan.priorityFocus}</p>
            </div>
          )}

          <div className="space-y-2">
            {(plan.blocks || []).map((block, i) => {
              const Icon = BLOCK_ICONS[i % BLOCK_ICONS.length]
              return (
                <div key={i} className="flex items-stretch gap-3 rounded-xl border border-slate-700/50 bg-slate-800/30 overflow-hidden">
                  <div className="flex items-center gap-2 px-4 py-3 bg-slate-800/50 border-r border-slate-700/30 min-w-[120px]">
                    <Icon className="w-4 h-4 text-violet-400" />
                    <span className="text-xs font-mono font-bold text-violet-300">{block.time}</span>
                  </div>
                  <div className="flex-1 px-4 py-3">
                    <p className="text-sm font-semibold text-white">{block.exactTopic}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[10px] text-blue-400">{block.gsLink}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 font-medium">{block.method}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">🎯 {block.target}</p>
                  </div>
                </div>
              )
            })}
          </div>

          {plan.dailyQuote && (
            <div className="px-4 py-3 rounded-xl bg-amber-500/5 border border-amber-500/20">
              <p className="text-xs text-amber-300 italic leading-relaxed">"{plan.dailyQuote}"</p>
            </div>
          )}
        </div>
      )}

      {plan?.raw && (
        <div className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-4">
          <p className="text-sm text-slate-300 whitespace-pre-wrap">{plan.raw}</p>
        </div>
      )}

      {!plan && !loading && (
        <div className="text-center py-16 rounded-xl border border-dashed border-slate-700/50 bg-slate-800/20">
          <CalendarClock className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="text-sm text-slate-400">No daily plan generated yet</p>
          <p className="text-xs text-slate-500 mt-1">Click "Generate Tomorrow's Plan" for an AI-optimized hour-by-hour schedule</p>
          <div className="mt-4 flex items-center justify-center gap-4 text-[11px] text-slate-600">
            <span>📊 Based on your progress</span>
            <span>🎯 Weak area focus</span>
            <span>⏰ 8-hour optimized split</span>
          </div>
        </div>
      )}
    </div>
  )
}
