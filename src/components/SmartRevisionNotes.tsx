import { useState } from 'react'
import { BookMarked, Loader2, ChevronDown, ChevronRight, Copy, Check, FileText } from 'lucide-react'
import { cn } from '@/lib/cn'

interface RevisionNotes {
  topic?: string
  oneLiners?: string[]
  bulletPoints?: string[]
  comparisonTable?: { headers: string[]; rows: string[][] }
  eliminationTraps?: string[]
  pyqPattern?: string
  currentAffairs?: string
  mainsPoints?: string[]
  memoryTricks?: string[]
  mindMapKeywords?: string[]
  raw?: string
}

export default function SmartRevisionNotes() {
  const [topic, setTopic] = useState('')
  const [notes, setNotes] = useState<RevisionNotes | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['oneLiners', 'bullets']))
  const [copied, setCopied] = useState(false)

  const QUICK_TOPICS = [
    'Article 370 and its Abrogation',
    'Fundamental Rights vs DPSP',
    'RBI Monetary Policy Tools (Repo, CRR, SLR)',
    'GST Council Composition and Voting',
    'Indian National Congress Sessions Timeline',
    'Ecological Succession Types',
    'India\'s Biodiversity Hotspots',
    'Money Market Instruments',
    'Parliamentary Committees',
    'Constitutional Amendment Procedure',
  ]

  const generateNotes = async (selectedTopic?: string) => {
    const t = selectedTopic || topic
    if (!t.trim()) return
    setLoading(true)
    setError('')
    setTopic(t)
    try {
      const res = await fetch('/api/gemini/revision-notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: t }),
      })
      const data = await res.json()
      if (res.ok) setNotes(data)
      else setError(data.error || 'Failed to generate notes')
    } catch {
      setError('Connection error')
    }
    setLoading(false)
  }

  const toggleSection = (key: string) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  const copyToClipboard = () => {
    if (!notes) return
    const text = [
      `# ${notes.topic} — UPSC Revision Notes\n`,
      '## One-Liner Facts',
      ...(notes.oneLiners || []).map((f, i) => `${i + 1}. ${f}`),
      '\n## Bullet Points',
      ...(notes.bulletPoints || []).map((b) => `• ${b}`),
      '\n## Elimination Traps',
      ...(notes.eliminationTraps || []).map((t, i) => `${i + 1}. ${t}`),
      '\n## Mains Points',
      ...(notes.mainsPoints || []).map((p, i) => `${i + 1}. ${p}`),
      '\n## Memory Tricks',
      ...(notes.memoryTricks || []).map((m) => `💡 ${m}`),
      '\n## Mind Map Keywords',
      (notes.mindMapKeywords || []).join(' | '),
    ].join('\n')
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const Section = ({ id, title, children }: { id: string; title: string; children: React.ReactNode }) => {
    const isOpen = expanded.has(id)
    return (
      <div className="rounded-xl border border-slate-700/50 bg-slate-800/30 overflow-hidden">
        <button onClick={() => toggleSection(id)} className="w-full flex items-center gap-2 px-4 py-3 hover:bg-slate-800/50 transition-colors">
          {isOpen ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
          <span className="text-sm font-semibold text-white">{title}</span>
        </button>
        {isOpen && <div className="px-4 pb-4 border-t border-slate-700/30 pt-3">{children}</div>}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
          <BookMarked className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">Smart Revision Notes</h2>
          <p className="text-xs text-slate-400">AI-generated exam-ready notes for any UPSC topic</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && generateNotes()}
          placeholder="Enter any UPSC topic for comprehensive revision notes..."
          className="flex-1 px-4 py-2.5 rounded-lg bg-slate-800/60 border border-slate-700/50 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
          disabled={loading}
        />
        <button
          onClick={() => generateNotes()}
          disabled={loading || !topic.trim()}
          className={cn(
            'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all',
            loading ? 'bg-slate-800/50 text-slate-500' : 'bg-cyan-500/15 text-cyan-400 hover:bg-cyan-500/25'
          )}
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
          {loading ? 'Generating...' : 'Generate Notes'}
        </button>
        {notes && (
          <button onClick={copyToClipboard} className="px-3 py-2.5 rounded-lg bg-slate-800/50 text-slate-400 hover:text-white border border-slate-700/50 transition-colors">
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* Quick Topics */}
      {!notes && !loading && (
        <div className="flex flex-wrap gap-2">
          {QUICK_TOPICS.map((t) => (
            <button key={t} onClick={() => generateNotes(t)} className="px-3 py-1.5 rounded-full text-xs text-slate-400 bg-slate-800/40 border border-slate-700/30 hover:border-cyan-500/30 hover:text-cyan-400 transition-all">
              {t}
            </button>
          ))}
        </div>
      )}

      {error && <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400">{error}</div>}

      {notes && !notes.raw && (
        <div className="space-y-3">
          {notes.oneLiners && (
            <Section id="oneLiners" title={`📋 One-Liner Facts (${notes.oneLiners.length})`}>
              <ol className="space-y-1.5">
                {notes.oneLiners.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                    <span className="text-cyan-400 font-bold flex-shrink-0">{i + 1}.</span>
                    {f}
                  </li>
                ))}
              </ol>
            </Section>
          )}

          {notes.bulletPoints && (
            <Section id="bullets" title={`⚡ Bullet Points (${notes.bulletPoints.length})`}>
              <ul className="space-y-1.5">
                {notes.bulletPoints.map((b, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                    <span className="text-amber-400 flex-shrink-0">▸</span>
                    {b}
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {notes.comparisonTable && (
            <Section id="table" title="📊 Comparison Table">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr>
                      {notes.comparisonTable.headers.map((h, i) => (
                        <th key={i} className="px-3 py-2 text-left text-cyan-400 font-semibold border-b border-slate-700/50">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {notes.comparisonTable.rows.map((row, i) => (
                      <tr key={i}>
                        {row.map((cell, j) => (
                          <td key={j} className="px-3 py-2 text-slate-300 border-b border-slate-700/30">{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Section>
          )}

          {notes.eliminationTraps && (
            <Section id="traps" title={`🚨 Elimination Traps (${notes.eliminationTraps.length})`}>
              <ul className="space-y-2">
                {notes.eliminationTraps.map((t, i) => (
                  <li key={i} className="flex items-start gap-2 px-3 py-2 rounded-lg bg-red-500/5 border border-red-500/20 text-sm text-red-300">
                    <span className="text-red-400 font-bold flex-shrink-0">⚠</span>
                    {t}
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {notes.pyqPattern && (
            <Section id="pyq" title="📈 PYQ Pattern">
              <p className="text-sm text-slate-300 leading-relaxed">{notes.pyqPattern}</p>
            </Section>
          )}

          {notes.currentAffairs && (
            <Section id="ca" title="📰 Current Affairs Link">
              <p className="text-sm text-slate-300 leading-relaxed">{notes.currentAffairs}</p>
            </Section>
          )}

          {notes.mainsPoints && (
            <Section id="mains" title={`✍️ Mains Ready Points (${notes.mainsPoints.length})`}>
              <ol className="space-y-1.5">
                {notes.mainsPoints.map((p, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                    <span className="text-emerald-400 font-bold flex-shrink-0">{i + 1}.</span>
                    {p}
                  </li>
                ))}
              </ol>
            </Section>
          )}

          {notes.memoryTricks && (
            <Section id="memory" title="💡 Memory Tricks">
              <ul className="space-y-2">
                {notes.memoryTricks.map((m, i) => (
                  <li key={i} className="px-3 py-2 rounded-lg bg-amber-500/5 border border-amber-500/20 text-sm text-amber-300">
                    💡 {m}
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {notes.mindMapKeywords && (
            <Section id="keywords" title="🧠 Mind Map Keywords">
              <div className="flex flex-wrap gap-2">
                {notes.mindMapKeywords.map((kw, i) => (
                  <span key={i} className="px-3 py-1.5 rounded-full text-xs bg-indigo-500/15 text-indigo-300 border border-indigo-500/20">
                    {kw}
                  </span>
                ))}
              </div>
            </Section>
          )}
        </div>
      )}

      {notes?.raw && (
        <div className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-4">
          <p className="text-sm text-slate-300 whitespace-pre-wrap">{notes.raw}</p>
        </div>
      )}
    </div>
  )
}
