import { useState } from 'react'
import { useLanguage } from '@/lib/i18n'
import { cn } from '@/lib/cn'
import { Brain, Loader2, X, CheckCircle, AlertTriangle, BookOpen, Calendar, Target, Lightbulb } from 'lucide-react'

interface AnalysisResult {
  summary: string
  topics: string[]
  weakAreas: string[]
  strongAreas: string[]
  revisionNotes: string
  dailyPlanUpdate: string
  currentAffairs: string[]
  actionItems: string[]
  mood: string
}

interface Props {
  open: boolean
  onClose: () => void
}

export default function AIConversationImport({ open, onClose }: Props) {
  const { t } = useLanguage()
  const [conversation, setConversation] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState('')

  if (!open) return null

  async function analyzeConversation() {
    if (!conversation.trim()) {
      setError(t('aiImport.noContent'))
      return
    }
    setAnalyzing(true)
    setError('')
    setResult(null)
    try {
      const res = await fetch('/api/gemini/analyze-conversation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversation: conversation.trim() }),
      })
      const data = await res.json()
      if (!res.ok || data.error) {
        setError(data.error || t('aiImport.error'))
        return
      }
      setResult(data)
    } catch {
      setError(t('aiImport.error'))
    } finally {
      setAnalyzing(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl max-h-[90vh] bg-[#0f172a] border border-slate-700/50 rounded-2xl overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700/50">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-violet-400" />
            <div>
              <h2 className="text-sm font-bold text-white">{t('aiImport.title')}</h2>
              <p className="text-[10px] text-slate-400">{t('aiImport.description')}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {!result && (
            <textarea
              value={conversation}
              onChange={(e) => setConversation(e.target.value)}
              placeholder={t('aiImport.placeholder')}
              className="w-full h-48 rounded-xl bg-slate-800/50 border border-slate-700/50 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500/50 resize-none"
            />
          )}

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {result && (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <p className="text-xs font-bold text-emerald-400 mb-1">{t('aiImport.resultTitle')}</p>
                <p className="text-[11px] text-slate-300">{result.summary}</p>
                {result.mood && (
                  <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] bg-violet-500/15 text-violet-400">
                    🧠 {result.mood}
                  </span>
                )}
              </div>

              {result.topics.length > 0 && (
                <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/30">
                  <div className="flex items-center gap-1.5 mb-2">
                    <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                    <p className="text-[11px] font-bold text-blue-400">{t('aiImport.topics')}</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {result.topics.map((topic, i) => (
                      <span key={i} className="px-2 py-0.5 rounded text-[10px] bg-blue-500/10 text-blue-300 border border-blue-500/20">{topic}</span>
                    ))}
                  </div>
                </div>
              )}

              {result.weakAreas.length > 0 && (
                <div className="p-3 rounded-xl bg-red-500/5 border border-red-500/20">
                  <div className="flex items-center gap-1.5 mb-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                    <p className="text-[11px] font-bold text-red-400">{t('aiImport.weakAreas')}</p>
                  </div>
                  <ul className="space-y-1">
                    {result.weakAreas.map((area, i) => (
                      <li key={i} className="text-[10px] text-slate-300">⚠️ {area}</li>
                    ))}
                  </ul>
                </div>
              )}

              {result.strongAreas.length > 0 && (
                <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                  <div className="flex items-center gap-1.5 mb-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <p className="text-[11px] font-bold text-emerald-400">{t('aiImport.strongAreas')}</p>
                  </div>
                  <ul className="space-y-1">
                    {result.strongAreas.map((area, i) => (
                      <li key={i} className="text-[10px] text-slate-300">✅ {area}</li>
                    ))}
                  </ul>
                </div>
              )}

              {result.revisionNotes && (
                <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                    <p className="text-[11px] font-bold text-amber-400">{t('aiImport.revisionNotes')}</p>
                  </div>
                  <p className="text-[10px] text-slate-300 whitespace-pre-wrap">{result.revisionNotes}</p>
                </div>
              )}

              {result.actionItems.length > 0 && (
                <div className="p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/20">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Target className="w-3.5 h-3.5 text-indigo-400" />
                    <p className="text-[11px] font-bold text-indigo-400">{t('aiImport.actionItems')}</p>
                  </div>
                  <ul className="space-y-1">
                    {result.actionItems.map((item, i) => (
                      <li key={i} className="text-[10px] text-slate-300">→ {item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {result.dailyPlanUpdate && (
                <div className="p-3 rounded-xl bg-purple-500/5 border border-purple-500/20">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Calendar className="w-3.5 h-3.5 text-purple-400" />
                    <p className="text-[11px] font-bold text-purple-400">{t('aiImport.dailyPlan')}</p>
                  </div>
                  <p className="text-[10px] text-slate-300 whitespace-pre-wrap">{result.dailyPlanUpdate}</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="px-5 py-3 border-t border-slate-700/50 flex items-center justify-between">
          {result ? (
            <button
              onClick={() => { setResult(null); setConversation('') }}
              className="px-4 py-2 rounded-lg bg-violet-500/15 text-violet-400 text-xs font-bold hover:bg-violet-500/25 transition-colors"
            >
              Import Another
            </button>
          ) : (
            <div />
          )}
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-700/50 text-slate-400 text-xs font-bold hover:bg-slate-600/50 transition-colors"
            >
              {t('aiImport.close') || 'Close'}
            </button>
            {!result && (
              <button
                onClick={analyzeConversation}
                disabled={analyzing || !conversation.trim()}
                className={cn(
                  'px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5',
                  analyzing || !conversation.trim()
                    ? 'bg-slate-700/50 text-slate-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:from-violet-500 hover:to-purple-500'
                )}
              >
                {analyzing ? (
                  <><Loader2 className="w-3.5 h-3.5 animate-spin" /> {t('aiImport.analyzing')}</>
                ) : (
                  <><Brain className="w-3.5 h-3.5" /> {t('aiImport.analyze')}</>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
