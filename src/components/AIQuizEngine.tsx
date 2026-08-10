import { useState } from 'react'
import { Brain, Loader2, CheckCircle2, XCircle, RotateCcw, ChevronDown, ChevronRight, Target, Zap } from 'lucide-react'
import { cn } from '@/lib/cn'

interface QuizQuestion {
  question?: string
  options?: string[]
  correct?: string
  explanation?: string
  eliminationTip?: string
  source?: string
  difficulty?: string
  raw_response?: string
}

const TOPICS = [
  'Indian Polity',
  'Indian Economy',
  'Modern History',
  'Geography',
  'Environment & Ecology',
  'Science & Technology',
  'International Relations',
  'Money Market & Banking',
  'Constitutional Bodies',
  'Current Affairs Mixed',
]

const DIFFICULTIES = ['Easy', 'Medium', 'Hard', 'UPSC Prelims Level']

export default function AIQuizEngine() {
  const [quiz, setQuiz] = useState<QuizQuestion[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [topic, setTopic] = useState('Indian Polity')
  const [count, setCount] = useState(10)
  const [difficulty, setDifficulty] = useState('UPSC Prelims Level')
  const [selected, setSelected] = useState<Record<number, string>>({})
  const [showResults, setShowResults] = useState(false)
  const [expandedQ, setExpandedQ] = useState<Set<number>>(new Set())

  const generateQuiz = async () => {
    setLoading(true)
    setError('')
    setSelected({})
    setShowResults(false)
    setExpandedQ(new Set())
    try {
      const res = await fetch('/api/gemini/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, count, difficulty }),
      })
      const data = await res.json()
      if (res.ok && data.quiz) {
        setQuiz(data.quiz)
      } else {
        setError(data.error || 'Failed to generate quiz')
      }
    } catch {
      setError('Connection error — please try again')
    }
    setLoading(false)
  }

  const selectOption = (qIdx: number, option: string) => {
    if (showResults) return
    setSelected((prev) => ({ ...prev, [qIdx]: option }))
  }

  const submitQuiz = () => setShowResults(true)

  const toggleExpand = (idx: number) => {
    setExpandedQ((prev) => {
      const next = new Set(prev)
      if (next.has(idx)) next.delete(idx)
      else next.add(idx)
      return next
    })
  }

  const score = quiz.reduce((s, q, i) => {
    if (q.correct && selected[i] === q.correct) return s + 1
    return s
  }, 0)

  const answered = Object.keys(selected).length
  const totalValid = quiz.filter((q) => q.question).length

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
          <Brain className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            AI Quiz Engine
            <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-purple-500/20 text-purple-400">
              GEMINI AI
            </span>
          </h2>
          <p className="text-xs text-slate-400">UPSC-standard MCQs generated on demand with elimination tips</p>
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <select
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-700/50 text-sm text-white focus:outline-none focus:border-purple-500/50"
        >
          {TOPICS.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <select
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
          className="px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-700/50 text-sm text-white focus:outline-none"
        >
          {[5, 10, 15, 20, 25, 30].map((n) => (
            <option key={n} value={n}>{n} Questions</option>
          ))}
        </select>
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-700/50 text-sm text-white focus:outline-none"
        >
          {DIFFICULTIES.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
        <button
          onClick={generateQuiz}
          disabled={loading}
          className={cn(
            'flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
            loading
              ? 'bg-slate-800/50 text-slate-500 cursor-not-allowed'
              : 'bg-purple-500/15 text-purple-400 hover:bg-purple-500/25'
          )}
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
          {loading ? 'Generating...' : 'Generate Quiz'}
        </button>
      </div>

      {error && (
        <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400">{error}</div>
      )}

      {/* Score Bar */}
      {quiz.length > 0 && (
        <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-slate-800/30 border border-slate-700/50">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-slate-300">
                Answered: <span className="text-white font-bold">{answered}</span>/{totalValid}
              </span>
            </div>
            {showResults && (
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-sm text-slate-300">
                  Score: <span className="text-emerald-400 font-bold">{score}</span>/{totalValid} ({Math.round((score / totalValid) * 100)}%)
                </span>
              </div>
            )}
          </div>
          {!showResults && answered > 0 && (
            <button
              onClick={submitQuiz}
              className="px-4 py-1.5 rounded-lg bg-emerald-500/15 text-emerald-400 text-sm font-medium hover:bg-emerald-500/25 transition-all"
            >
              Submit Quiz
            </button>
          )}
          {showResults && (
            <button
              onClick={generateQuiz}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/50 text-slate-400 text-sm hover:text-white transition-colors"
            >
              <RotateCcw className="w-3 h-3" /> New Quiz
            </button>
          )}
        </div>
      )}

      {/* Questions */}
      {quiz.length > 0 ? (
        <div className="space-y-3">
          {quiz.map((q, i) => {
            if (q.raw_response) {
              return (
                <div key={i} className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-4">
                  <p className="text-sm text-slate-300 whitespace-pre-wrap">{q.raw_response}</p>
                </div>
              )
            }
            if (!q.question) return null
            const isExpanded = expandedQ.has(i)
            const userAns = selected[i]
            const isCorrect = showResults && userAns === q.correct
            const isWrong = showResults && userAns && userAns !== q.correct

            return (
              <div
                key={i}
                className={cn(
                  'rounded-xl border p-4 transition-all',
                  showResults
                    ? isCorrect
                      ? 'border-emerald-500/30 bg-emerald-500/5'
                      : isWrong
                        ? 'border-red-500/30 bg-red-500/5'
                        : 'border-slate-700/50 bg-slate-800/30'
                    : 'border-slate-700/50 bg-slate-800/30'
                )}
              >
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-slate-700/50 flex items-center justify-center text-xs font-bold text-slate-300">
                    {i + 1}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm text-white font-medium leading-relaxed">{q.question}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {q.source && <span className="text-[10px] text-blue-400">{q.source}</span>}
                      {q.difficulty && (
                        <span className={cn(
                          'px-1.5 py-0.5 text-[10px] font-bold rounded',
                          q.difficulty === 'Hard' ? 'bg-red-500/15 text-red-400' : q.difficulty === 'Medium' ? 'bg-amber-500/15 text-amber-400' : 'bg-emerald-500/15 text-emerald-400'
                        )}>
                          {q.difficulty}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3 ml-10">
                  {(q.options || []).map((opt, j) => {
                    const letter = String.fromCharCode(65 + j)
                    const isSelected = userAns === letter || userAns?.startsWith(letter)
                    const isRightAnswer = showResults && q.correct && (letter === q.correct || q.correct.startsWith(letter))

                    return (
                      <button
                        key={j}
                        onClick={() => selectOption(i, letter)}
                        disabled={showResults}
                        className={cn(
                          'flex items-center gap-2 px-3 py-2.5 rounded-lg text-left text-sm transition-all border',
                          showResults
                            ? isRightAnswer
                              ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                              : isSelected && !isCorrect
                                ? 'bg-red-500/15 border-red-500/30 text-red-300'
                                : 'bg-slate-800/30 border-slate-700/30 text-slate-400'
                            : isSelected
                              ? 'bg-purple-500/15 border-purple-500/30 text-purple-300'
                              : 'bg-slate-800/30 border-slate-700/30 text-slate-300 hover:border-slate-600/40'
                        )}
                      >
                        <span className="w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold bg-slate-700/50 flex-shrink-0">
                          {letter}
                        </span>
                        <span className="flex-1">{opt}</span>
                        {showResults && isRightAnswer && <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />}
                        {showResults && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />}
                      </button>
                    )
                  })}
                </div>

                {/* Explanation */}
                {showResults && (
                  <button
                    onClick={() => toggleExpand(i)}
                    className="flex items-center gap-2 mt-3 ml-10 text-xs text-slate-400 hover:text-white transition-colors"
                  >
                    {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                    Show Explanation & Elimination Tip
                  </button>
                )}

                {showResults && isExpanded && (
                  <div className="ml-10 mt-2 space-y-2">
                    {q.explanation && (
                      <div className="px-3 py-2 rounded-lg bg-blue-500/5 border border-blue-500/20">
                        <p className="text-xs text-blue-300 leading-relaxed">{q.explanation}</p>
                      </div>
                    )}
                    {q.eliminationTip && (
                      <div className="px-3 py-2 rounded-lg bg-amber-500/5 border border-amber-500/20">
                        <p className="text-xs text-amber-300 leading-relaxed">
                          <span className="font-bold">Elimination Tip:</span> {q.eliminationTip}
                        </p>
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
            <Brain className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <p className="text-sm text-slate-400">No quiz generated yet</p>
            <p className="text-xs text-slate-500 mt-1">Select topic and difficulty, then click "Generate Quiz"</p>
          </div>
        )
      )}
    </div>
  )
}
