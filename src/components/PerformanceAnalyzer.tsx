import { useState, useMemo } from 'react'
import { BarChart3, Loader2, Shield, Target, TrendingUp, AlertTriangle, CheckCircle2, Flame } from 'lucide-react'
import { cn } from '@/lib/cn'
import { syllabusData, getTotalTopics, getCompletedTopics } from '@/data/syllabus'

interface Analysis {
  overallScore?: number
  grade?: string
  strengthAnalysis?: string[]
  weaknessAlert?: string[]
  weeklyVelocity?: string
  riskAssessment?: string
  actionItems?: string[]
  motivation?: string
  air1Readiness?: number
  raw?: string
}

export default function PerformanceAnalyzer() {
  const [analysis, setAnalysis] = useState<Analysis | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const stats = useMemo(() => {
    const total = getTotalTopics(syllabusData)
    const completed = getCompletedTopics(syllabusData)
    return { total, completed, percent: Math.round((completed / total) * 100) }
  }, [])

  const analyze = async () => {
    setLoading(true)
    setError('')
    try {
      const completedNames: string[] = []
      const pendingNames: string[] = []
      syllabusData.forEach((p) => p.topics.forEach((t) => {
        if (t.completed) completedNames.push(t.name)
        else pendingNames.push(t.name)
      }))

      const res = await fetch('/api/gemini/analyze-performance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          completedTopics: completedNames,
          totalTopics: stats.total,
          accuracy: 80,
          studyDays: 6,
        }),
      })
      const data = await res.json()
      if (res.ok) setAnalysis(data)
      else setError(data.error || 'Failed to analyze')
    } catch {
      setError('Connection error')
    }
    setLoading(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">JARVIS Performance Analyzer</h2>
            <p className="text-xs text-slate-400">Strategic analysis of your preparation</p>
          </div>
        </div>
        <button
          onClick={analyze}
          disabled={loading}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
            loading ? 'bg-slate-800/50 text-slate-500' : 'bg-red-500/15 text-red-400 hover:bg-red-500/25'
          )}
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <BarChart3 className="w-4 h-4" />}
          {loading ? 'Analyzing...' : 'Run JARVIS Analysis'}
        </button>
      </div>

      {/* Current Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-center">
          <p className="text-2xl font-bold text-white">{stats.completed}</p>
          <p className="text-[11px] text-slate-400">Topics Done</p>
        </div>
        <div className="px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-center">
          <p className="text-2xl font-bold text-amber-400">{stats.total - stats.completed}</p>
          <p className="text-[11px] text-slate-400">Topics Remaining</p>
        </div>
        <div className="px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-center">
          <p className="text-2xl font-bold text-indigo-400">{stats.percent}%</p>
          <p className="text-[11px] text-slate-400">Overall Progress</p>
        </div>
      </div>

      {error && <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400">{error}</div>}

      {analysis && !analysis.raw && (
        <div className="space-y-4">
          {/* Score */}
          {analysis.overallScore && (
            <div className="flex items-center gap-4 px-5 py-4 rounded-xl bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-500/20">
              <div className="text-center">
                <p className="text-4xl font-bold text-white">{analysis.overallScore}</p>
                <p className="text-[10px] text-slate-400 uppercase">Score /100</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-amber-400">{analysis.grade}</p>
                <p className="text-[10px] text-slate-400 uppercase">Grade</p>
              </div>
              {analysis.air1Readiness !== undefined && (
                <div className="flex-1">
                  <p className="text-xs text-slate-400 mb-1">AIR 1 Readiness</p>
                  <div className="w-full h-4 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all" style={{ width: `${analysis.air1Readiness}%` }} />
                  </div>
                  <p className="text-sm font-bold text-emerald-400 mt-1">{analysis.air1Readiness}%</p>
                </div>
              )}
            </div>
          )}

          {/* Strengths */}
          {analysis.strengthAnalysis && (
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-semibold text-emerald-300">Strengths</h3>
              </div>
              <ul className="space-y-1">
                {analysis.strengthAnalysis.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Weaknesses */}
          {analysis.weaknessAlert && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <h3 className="text-sm font-semibold text-red-300">Weakness Alerts</h3>
              </div>
              <ul className="space-y-1">
                {analysis.weaknessAlert.map((w, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-400 mt-0.5 flex-shrink-0" />
                    {w}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Items */}
          {analysis.actionItems && (
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-semibold text-amber-300">Action Items for Next Week</h3>
              </div>
              <ol className="space-y-1.5">
                {analysis.actionItems.map((a, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                    <span className="text-amber-400 font-bold flex-shrink-0">{i + 1}.</span>
                    {a}
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Velocity & Risk */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {analysis.weeklyVelocity && (
              <div className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-sm font-semibold text-white">Weekly Velocity</h3>
                </div>
                <p className="text-sm text-slate-300">{analysis.weeklyVelocity}</p>
              </div>
            )}
            {analysis.riskAssessment && (
              <div className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Flame className="w-4 h-4 text-orange-400" />
                  <h3 className="text-sm font-semibold text-white">Risk Assessment</h3>
                </div>
                <p className="text-sm text-slate-300">{analysis.riskAssessment}</p>
              </div>
            )}
          </div>

          {/* Motivation */}
          {analysis.motivation && (
            <div className="px-4 py-3 rounded-xl bg-gradient-to-r from-amber-500/5 to-orange-500/5 border border-amber-500/20">
              <p className="text-sm text-amber-300 italic leading-relaxed">🔥 {analysis.motivation}</p>
            </div>
          )}
        </div>
      )}

      {analysis?.raw && (
        <div className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-4">
          <p className="text-sm text-slate-300 whitespace-pre-wrap">{analysis.raw}</p>
        </div>
      )}

      {!analysis && !loading && (
        <div className="text-center py-16 rounded-xl border border-dashed border-slate-700/50 bg-slate-800/20">
          <BarChart3 className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="text-sm text-slate-400">No analysis generated yet</p>
          <p className="text-xs text-slate-500 mt-1">Click "Run JARVIS Analysis" for a strategic performance review</p>
        </div>
      )}
    </div>
  )
}
