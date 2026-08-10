import { useState } from 'react'
import { Plus, AlertTriangle, Lightbulb, Eye, X, Search } from 'lucide-react'
import { cn } from '@/lib/cn'
import { csatFormulas } from '@/data/currentAffairs'

interface ErrorEntry {
  id: string
  date: string
  question: string
  category: 'A' | 'B' | 'C'
  subject: string
  correctAnswer: string
  userAnswer: string
  notes: string
}

const categoryConfig = {
  A: { label: 'Conceptual Gap', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20', action: 'Review source material immediately' },
  B: { label: 'Info Omission', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20', action: 'Generate instant flashcard' },
  C: { label: 'Reading Reflex Error', color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20', action: 'Underline qualifiers in question' },
}

export default function ErrorMatrix() {
  const [errors, setErrors] = useState<ErrorEntry[]>([])
  const [showForm, setShowForm] = useState(false)
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState<'errors' | 'csat'>('errors')
  const [form, setForm] = useState({
    question: '',
    category: 'A' as 'A' | 'B' | 'C',
    subject: 'Polity',
    correctAnswer: '',
    userAnswer: '',
    notes: '',
  })

  const addError = () => {
    if (!form.question.trim()) return
    const newEntry: ErrorEntry = {
      id: `err-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      ...form,
    }
    setErrors([newEntry, ...errors])
    setForm({ question: '', category: 'A', subject: 'Polity', correctAnswer: '', userAnswer: '', notes: '' })
    setShowForm(false)
  }

  const filteredErrors = errors.filter(
    (e) =>
      e.question.toLowerCase().includes(search.toLowerCase()) ||
      e.subject.toLowerCase().includes(search.toLowerCase())
  )

  const stats = {
    total: errors.length,
    conceptual: errors.filter((e) => e.category === 'A').length,
    omission: errors.filter((e) => e.category === 'B').length,
    reflex: errors.filter((e) => e.category === 'C').length,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">Error Matrix & CSAT Vault</h2>
          <p className="text-sm text-slate-400 mt-0.5">Log errors, categorize, and master CSAT formulas</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab(activeTab === 'errors' ? 'csat' : 'errors')}
            className="px-3 py-2 rounded-lg bg-slate-800/50 text-sm text-slate-400 hover:text-white border border-slate-700/50 transition-colors"
          >
            {activeTab === 'errors' ? '📐 CSAT Vault' : '📋 Error Log'}
          </button>
          {activeTab === 'errors' && (
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-500/15 text-amber-400 hover:bg-amber-500/25 transition-colors text-sm font-medium"
            >
              {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {showForm ? 'Cancel' : 'Log Error'}
            </button>
          )}
        </div>
      </div>

      {activeTab === 'errors' ? (
        <>
          {/* Stats */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: 'Total Errors', value: stats.total, color: 'text-white' },
              { label: 'Conceptual', value: stats.conceptual, color: 'text-red-400' },
              { label: 'Info Omission', value: stats.omission, color: 'text-amber-400' },
              { label: 'Reading Reflex', value: stats.reflex, color: 'text-indigo-400' },
            ].map((s) => (
              <div key={s.label} className="px-3 py-2.5 rounded-lg bg-slate-800/50 border border-slate-700/50">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider">{s.label}</p>
                <p className={cn('text-xl font-bold', s.color)}>{s.value}</p>
              </div>
            ))}
          </div>

          {showForm && (
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <textarea
                  placeholder="Question text..."
                  value={form.question}
                  onChange={(e) => setForm({ ...form, question: e.target.value })}
                  className="px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-700/50 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 resize-none h-20 md:col-span-2"
                />
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value as 'A' | 'B' | 'C' })}
                  className="px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-700/50 text-sm text-white focus:outline-none"
                >
                  <option value="A">Category A: Conceptual Gap</option>
                  <option value="B">Category B: Information Omission</option>
                  <option value="C">Category C: Reading Reflex Error</option>
                </select>
                <select
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-700/50 text-sm text-white focus:outline-none"
                >
                  <option>Polity</option>
                  <option>Economy</option>
                  <option>Geography</option>
                  <option>History</option>
                  <option>Environment</option>
                  <option>Science & Tech</option>
                  <option>CSAT</option>
                </select>
                <input
                  placeholder="Your answer"
                  value={form.userAnswer}
                  onChange={(e) => setForm({ ...form, userAnswer: e.target.value })}
                  className="px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-700/50 text-sm text-white placeholder-slate-500 focus:outline-none"
                />
                <input
                  placeholder="Correct answer"
                  value={form.correctAnswer}
                  onChange={(e) => setForm({ ...form, correctAnswer: e.target.value })}
                  className="px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-700/50 text-sm text-white placeholder-slate-500 focus:outline-none"
                />
                <textarea
                  placeholder="Notes / insight..."
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-700/50 text-sm text-white placeholder-slate-500 focus:outline-none resize-none h-16 md:col-span-2"
                />
              </div>
              <button
                onClick={addError}
                className="px-4 py-2 rounded-lg bg-amber-500 text-black text-sm font-semibold hover:bg-amber-400 transition-colors"
              >
                Log Error
              </button>
            </div>
          )}

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              placeholder="Search errors by question or subject..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
            />
          </div>

          <div className="space-y-2">
            {filteredErrors.length === 0 ? (
              <div className="text-center py-12 rounded-xl border border-dashed border-slate-700/50 bg-slate-800/20">
                <AlertTriangle className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-sm text-slate-500">No errors logged yet</p>
                <p className="text-xs text-slate-600 mt-1">Click "Log Error" to start tracking your mistakes</p>
              </div>
            ) : (
              filteredErrors.map((err) => {
                const cat = categoryConfig[err.category]
                return (
                  <div key={err.id} className={cn('rounded-xl border p-4', cat.bg)}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={cn('text-xs font-bold', cat.color)}>Category {err.category}</span>
                          <span className={cn('text-xs', cat.color)}>: {cat.label}</span>
                          <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-slate-700/50 text-slate-400">
                            {err.subject}
                          </span>
                        </div>
                        <p className="text-sm text-white mt-2 leading-relaxed">{err.question}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-xs text-red-400">Your: {err.userAnswer}</span>
                          <span className="text-xs text-emerald-400">Correct: {err.correctAnswer}</span>
                        </div>
                        {err.notes && <p className="text-xs text-slate-400 mt-1 italic">{err.notes}</p>}
                      </div>
                    </div>
                    <div className="mt-2 text-[11px] text-slate-500">Action: {cat.action}</div>
                  </div>
                )
              })
            )}
          </div>
        </>
      ) : (
        /* CSAT Formula Vault */
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-semibold text-white">CSAT Formula & Concept Vault</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {csatFormulas.map((formula) => (
              <div
                key={formula.id}
                className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-4 hover:border-amber-500/30 transition-colors"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-amber-500/15 text-amber-400 uppercase">
                    {formula.topic}
                  </span>
                </div>
                <div className="px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-700/30 mb-2">
                  <code className="text-sm text-emerald-400 font-mono">{formula.formula}</code>
                </div>
                <p className="text-xs text-slate-400">
                  <span className="text-slate-300 font-medium">Example:</span> {formula.example}
                </p>
                <p className="text-xs text-amber-400/80 mt-1">
                  <span className="font-medium">Tip:</span> {formula.tip}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
