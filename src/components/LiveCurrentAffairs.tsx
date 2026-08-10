import { useState } from 'react'
import { Newspaper, RefreshCw, Loader2, Calendar, BookOpen, AlertTriangle, ChevronDown, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/cn'

interface Affair {
  title?: string
  source?: string
  gsLink?: string
  timeline?: string
  eliminationTrap?: string
  category?: string
  upscRelevance?: string
  raw_response?: string
}

export default function LiveCurrentAffairs() {
  const [affairs, setAffairs] = useState<Affair[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [expandedIdx, setExpandedIdx] = useState<Set<number>>(new Set())
  const [lastFetched, setLastFetched] = useState('')

  const fetchAffairs = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/gemini/current-affairs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date }),
      })
      const data = await res.json()
      if (res.ok && data.affairs) {
        setAffairs(data.affairs)
        setLastFetched(new Date().toLocaleTimeString())
      } else {
        setError(data.error || 'Failed to generate current affairs')
      }
    } catch {
      setError('Connection error — please try again')
    }
    setLoading(false)
  }

  const toggleExpand = (idx: number) => {
    setExpandedIdx((prev) => {
      const next = new Set(prev)
      if (next.has(idx)) next.delete(idx)
      else next.add(idx)
      return next
    })
  }

  const categoryColor: Record<string, string> = {
    Polity: 'bg-indigo-500/15 text-indigo-400',
    Economy: 'bg-amber-500/15 text-amber-400',
    Environment: 'bg-emerald-500/15 text-emerald-400',
    Geography: 'bg-green-500/15 text-green-400',
    'Science & Tech': 'bg-purple-500/15 text-purple-400',
    'International Relations': 'bg-cyan-500/15 text-cyan-400',
    IR: 'bg-cyan-500/15 text-cyan-400',
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
            <Newspaper className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              Live Current Affairs Engine
              <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-emerald-500/20 text-emerald-400">
                GEMINI AI
              </span>
            </h2>
            <p className="text-xs text-slate-400">AI-generated, exam-ready current affairs mapped to UPSC syllabus</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50">
          <Calendar className="w-4 h-4 text-slate-400" />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="bg-transparent text-sm text-white focus:outline-none"
          />
        </div>
        <button
          onClick={fetchAffairs}
          disabled={loading}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
            loading
              ? 'bg-slate-800/50 text-slate-500 cursor-not-allowed'
              : 'bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25'
          )}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4" />
              {affairs.length > 0 ? 'Refresh' : 'Generate Today\'s CA'}
            </>
          )}
        </button>
        {lastFetched && (
          <span className="text-[11px] text-slate-500">Last fetched: {lastFetched}</span>
        )}
      </div>

      {error && (
        <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Results */}
      {affairs.length > 0 ? (
        <div className="space-y-2">
          {affairs.map((affair, i) => {
            if (affair.raw_response) {
              return (
                <div key={i} className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-4">
                  <p className="text-sm text-slate-300 whitespace-pre-wrap">{affair.raw_response}</p>
                </div>
              )
            }
            const isExpanded = expandedIdx.has(i)
            const relevanceColor =
              affair.upscRelevance === 'HIGH'
                ? 'text-red-400'
                : affair.upscRelevance === 'MEDIUM'
                  ? 'text-amber-400'
                  : 'text-slate-400'

            return (
              <div
                key={i}
                className="rounded-xl border border-slate-700/50 bg-slate-800/30 overflow-hidden hover:border-slate-600/50 transition-colors"
              >
                <button
                  onClick={() => toggleExpand(i)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left"
                >
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-white">{affair.title}</span>
                      {affair.category && (
                        <span className={cn('px-1.5 py-0.5 text-[10px] font-bold rounded uppercase', categoryColor[affair.category] || 'bg-slate-500/15 text-slate-400')}>
                          {affair.category}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      {affair.source && (
                        <span className="flex items-center gap-1 text-[11px] text-slate-400">
                          <BookOpen className="w-3 h-3" /> {affair.source}
                        </span>
                      )}
                      {affair.upscRelevance && (
                        <span className={cn('text-[11px] font-bold', relevanceColor)}>
                          {affair.upscRelevance}
                        </span>
                      )}
                    </div>
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-4 pb-4 space-y-2 border-t border-slate-700/30 pt-3">
                    {affair.gsLink && (
                      <div className="flex items-start gap-2">
                        <BookOpen className="w-3.5 h-3.5 text-blue-400 mt-0.5" />
                        <span className="text-xs text-blue-300">{affair.gsLink}</span>
                      </div>
                    )}
                    {affair.timeline && (
                      <div className="flex items-start gap-2">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 mt-0.5" />
                        <span className="text-xs text-slate-400">{affair.timeline}</span>
                      </div>
                    )}
                    {affair.eliminationTrap && (
                      <div className="flex items-start gap-2 px-3 py-2 rounded-lg bg-red-500/5 border border-red-500/20">
                        <AlertTriangle className="w-3.5 h-3.5 text-red-400 mt-0.5 flex-shrink-0" />
                        <span className="text-xs text-red-300 leading-relaxed">{affair.eliminationTrap}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      ) : (
        !loading && (
          <div className="text-center py-16 rounded-xl border border-dashed border-slate-700/50 bg-slate-800/20">
            <Newspaper className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <p className="text-sm text-slate-400">No current affairs generated yet</p>
            <p className="text-xs text-slate-500 mt-1">Click "Generate Today's CA" to get AI-powered exam-ready current affairs</p>
          </div>
        )
      )}
    </div>
  )
}
