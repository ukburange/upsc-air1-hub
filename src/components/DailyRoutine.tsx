import { useState, useEffect, useCallback, useRef } from 'react'
import { Play, Pause, RotateCcw, CheckCircle2, Clock, Flame } from 'lucide-react'
import { cn } from '@/lib/cn'

interface Block {
  id: string
  name: string
  description: string
  hours: number
  color: string
  bgColor: string
}

const blocks: Block[] = [
  {
    id: 'block-1',
    name: 'Static GS Core',
    description: 'Deep Active Recall Protocol (3-Read Method)',
    hours: 3,
    color: 'text-indigo-400',
    bgColor: 'bg-indigo-500/10 border-indigo-500/20',
  },
  {
    id: 'block-2',
    name: 'Applied MCQ Drilling',
    description: 'Reverse-engineering 25-30 MCQs per session',
    hours: 1,
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10 border-amber-500/20',
  },
  {
    id: 'block-3',
    name: 'The Dynamic Bridge',
    description: 'Current Affairs static alignment mapping',
    hours: 1,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10 border-emerald-500/20',
  },
  {
    id: 'block-4',
    name: 'CSAT Insurance',
    description: 'Quant & Logical Reasoning drills',
    hours: 1,
    color: 'text-rose-400',
    bgColor: 'bg-rose-500/10 border-rose-500/20',
  },
]

const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export default function DailyRoutine() {
  const [completedBlocks, setCompletedBlocks] = useState<Set<string>>(new Set())
  const [weeklyLog, setWeeklyLog] = useState<Record<string, boolean[]>>(
    () => JSON.parse(localStorage.getItem('upsc_weekly_log') || '{}') as Record<string, boolean[]>
  )
  const [timerRunning, setTimerRunning] = useState(false)
  const [timerSeconds, setTimerSeconds] = useState(25 * 60)
  const [timerLabel, setTimerLabel] = useState('Pomodoro')
  const [activeBlock, setActiveBlock] = useState<string | null>(null)
  const intervalRef = useRef<number | null>(null)

  const today = new Date().toISOString().split('T')[0]

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`
  }

  const startTimer = useCallback((blockId: string, minutes: number) => {
    setActiveBlock(blockId)
    setTimerSeconds(minutes * 60)
    setTimerLabel(blocks.find((b) => b.id === blockId)?.name || 'Pomodoro')
    setTimerRunning(true)
  }, [])

  useEffect(() => {
    if (timerRunning && timerSeconds > 0) {
      intervalRef.current = window.setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            setTimerRunning(false)
            if (activeBlock) {
              setCompletedBlocks((prev) => new Set(prev).add(activeBlock))
            }
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [timerRunning, timerSeconds, activeBlock])

  const toggleBlock = (blockId: string) => {
    setCompletedBlocks((prev) => {
      const next = new Set(prev)
      if (next.has(blockId)) next.delete(blockId)
      else next.add(blockId)
      return next
    })
  }

  const toggleWeeklyDay = (day: string) => {
    setWeeklyLog((prev) => {
      const current = prev[today] || [false, false, false, false, false, false, false]
      const idx = daysOfWeek.indexOf(day)
      const next = [...current]
      next[idx] = !next[idx]
      const updated = { ...prev, [today]: next }
      localStorage.setItem('upsc_weekly_log', JSON.stringify(updated))
      return updated
    })
  }

  const todayLog = weeklyLog[today] || [false, false, false, false, false, false, false]
  const totalBlocksToday = completedBlocks.size
  const totalHours = blocks.reduce((s, b) => s + b.hours, 0)
  const completedHours = blocks.filter((b) => completedBlocks.has(b.id)).reduce((s, b) => s + b.hours, 0)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-white">Daily 6-Hour Study Routine</h2>
        <p className="text-sm text-slate-400 mt-0.5">4-Block Split • Pomodoro Timer • Weekly Heatmap</p>
      </div>

      {/* Pomodoro Timer */}
      <div className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-6">
        <div className="flex items-center justify-center mb-4">
          <div className="text-center">
            <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">{timerLabel}</p>
            <p className="text-5xl font-mono font-bold text-white tabular-nums">{formatTime(timerSeconds)}</p>
            <p className="text-xs text-slate-500 mt-2">
              {Math.round(((25 * 60 - timerSeconds) / (25 * 60)) * 100)}% complete
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => setTimerRunning(!timerRunning)}
            className={cn(
              'flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all',
              timerRunning
                ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30'
                : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
            )}
          >
            {timerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {timerRunning ? 'Pause' : 'Start'}
          </button>
          <button
            onClick={() => {
              setTimerRunning(false)
              setTimerSeconds(25 * 60)
              setActiveBlock(null)
              setTimerLabel('Pomodoro')
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-800/50 text-slate-400 hover:text-white text-sm transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-white">Today's Progress</span>
          <span className="text-sm text-slate-400">
            {completedHours}/{totalHours} hours • {totalBlocksToday}/{blocks.length} blocks
          </span>
        </div>
        <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber-500 to-emerald-500 transition-all duration-500"
            style={{ width: `${(completedHours / totalHours) * 100}%` }}
          />
        </div>
      </div>

      {/* 4-Block Split */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {blocks.map((block) => {
          const isCompleted = completedBlocks.has(block.id)
          const isActive = activeBlock === block.id && timerRunning
          return (
            <div
              key={block.id}
              className={cn(
                'rounded-xl border p-4 transition-all',
                isCompleted
                  ? 'bg-emerald-500/5 border-emerald-500/30'
                  : isActive
                    ? 'bg-amber-500/5 border-amber-500/30 shadow-lg shadow-amber-500/10'
                    : block.bgColor
              )}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className={cn('text-sm font-semibold', isCompleted ? 'text-emerald-400' : block.color)}>
                      {block.name}
                    </span>
                    <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-slate-700/50 text-slate-400">
                      {block.hours}H
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{block.description}</p>
                </div>
                <button
                  onClick={() => toggleBlock(block.id)}
                  className="flex-shrink-0"
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-slate-600 hover:border-slate-400 transition-colors" />
                  )}
                </button>
              </div>
              {!isCompleted && (
                <button
                  onClick={() => startTimer(block.id, block.hours * 60)}
                  className="mt-3 flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-800/50 text-[11px] text-slate-400 hover:text-white transition-colors"
                >
                  <Clock className="w-3 h-3" />
                  Start {block.hours}H Timer
                </button>
              )}
            </div>
          )
        })}
      </div>

      {/* Weekly Heatmap */}
      <div className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Flame className="w-4 h-4 text-orange-400" />
          <h3 className="text-sm font-semibold text-white">Weekly Execution Heatmap</h3>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {daysOfWeek.map((day, i) => (
            <button
              key={day}
              onClick={() => toggleWeeklyDay(day)}
              className={cn(
                'flex flex-col items-center gap-1 py-2 rounded-lg border transition-all text-center',
                todayLog[i]
                  ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                  : 'bg-slate-800/30 border-slate-700/30 text-slate-500 hover:border-slate-600/40'
              )}
            >
              <span className="text-[10px] font-semibold uppercase">{day}</span>
              {todayLog[i] ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <div className="w-4 h-4 rounded-full border border-slate-600" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
