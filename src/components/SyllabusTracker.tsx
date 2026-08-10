import { useState, useMemo } from 'react'
import { ChevronDown, ChevronRight, CheckCircle2, Circle, Clock, Filter } from 'lucide-react'
import { cn } from '@/lib/cn'
import { SyllabusPaper } from '@/data/syllabus'

interface SyllabusTrackerProps {
  syllabus: SyllabusPaper[]
  onToggleTopic: (paperId: string, topicId: string) => void
}

type FilterType = 'all' | 'completed' | 'pending'

export default function SyllabusTracker({ syllabus, onToggleTopic }: SyllabusTrackerProps) {
  const [expandedPapers, setExpandedPapers] = useState<Set<string>>(new Set(['polity', 'economy']))
  const [filter, setFilter] = useState<FilterType>('all')

  const togglePaper = (id: string) => {
    setExpandedPapers((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const filteredSyllabus = useMemo(() => {
    if (filter === 'all') return syllabus
    return syllabus
      .map((paper) => ({
        ...paper,
        topics: paper.topics.filter((t) =>
          filter === 'completed' ? t.completed : !t.completed
        ),
      }))
      .filter((paper) => paper.topics.length > 0)
  }, [syllabus, filter])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">Micro-Topic Syllabus Tracker</h2>
          <p className="text-sm text-slate-400 mt-0.5">IAS Score structure — toggle topics to track progress</p>
        </div>
        <div className="flex items-center gap-1.5 bg-slate-800/50 rounded-lg p-1 border border-slate-700/50">
          {(['all', 'completed', 'pending'] as FilterType[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                'px-3 py-1.5 text-xs font-medium rounded-md transition-all capitalize',
                filter === f
                  ? 'bg-amber-500/20 text-amber-400'
                  : 'text-slate-400 hover:text-white'
              )}
            >
              {f === 'all' ? 'All' : f === 'completed' ? '✓ Done' : '○ Pending'}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {filteredSyllabus.map((paper) => {
          const completedCount = paper.topics.filter((t) => t.completed).length
          const totalCount = paper.topics.length
          const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0
          const isExpanded = expandedPapers.has(paper.id)
          const Chevron = isExpanded ? ChevronDown : ChevronRight

          return (
            <div
              key={paper.id}
              className="rounded-xl border border-slate-700/50 bg-slate-800/30 overflow-hidden"
            >
              <button
                onClick={() => togglePaper(paper.id)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-800/50 transition-colors"
              >
                <Chevron className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white">{paper.name}</span>
                    <span
                      className="px-1.5 py-0.5 text-[10px] font-bold rounded uppercase tracking-wider"
                      style={{ backgroundColor: paper.color + '22', color: paper.color }}
                    >
                      {paper.gsCode}
                    </span>
                    {paper.tier === 1 && (
                      <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-red-500/20 text-red-400 uppercase">
                        Tier 1
                      </span>
                    )}
                    {paper.tier === 2 && (
                      <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-yellow-500/20 text-yellow-400 uppercase">
                        Tier 2
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {completedCount}/{totalCount} completed • {percent}%
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="w-24 h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${percent}%`,
                        backgroundColor: percent === 100 ? '#22c55e' : paper.color,
                      }}
                    />
                  </div>
                  {percent === 100 && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  )}
                </div>
              </button>

              {isExpanded && (
                <div className="px-4 pb-3 border-t border-slate-700/30">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-1 mt-2">
                    {paper.topics.map((topic) => (
                      <button
                        key={topic.id}
                        onClick={() => onToggleTopic(paper.id, topic.id)}
                        className={cn(
                          'flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-sm transition-all',
                          topic.completed
                            ? 'bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/15'
                            : 'bg-slate-800/40 text-slate-300 hover:bg-slate-800/70'
                        )}
                      >
                        {topic.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        ) : (
                          <Circle className="w-4 h-4 text-slate-500 flex-shrink-0" />
                        )}
                        <span className="truncate">{topic.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
