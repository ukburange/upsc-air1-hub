import { useState, useRef, useEffect } from 'react'
import { Send, Crown, User, Sparkles, Loader2 } from 'lucide-react'
import { cn } from '@/lib/cn'

interface Message {
  role: 'user' | 'assistant'
  text: string
  timestamp: string
}

export default function AITutor() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      text: 'नमस्कार! 🙏 I am Acharya Chanakya — your personal UPSC CSE 2027 strategist. I will guide you to AIR 1.\n\n问我 anything about:\n• Indian Polity, Economy, History, Geography\n• Current Affairs & their static links\n• Elimination tricks for MCQs\n• मराठी / हिंदी / English मध्ये उत्तर\n• Study strategy & daily planning\n\nWhat would you like to study today, dear student?',
      timestamp: new Date().toISOString(),
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [language, setLanguage] = useState<'english' | 'hindi' | 'marathi'>('english')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || loading) return
    const userMsg: Message = { role: 'user', text: input, timestamp: new Date().toISOString() }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input + (language !== 'english' ? ` (Reply in ${language === 'marathi' ? 'Marathi' : 'Hindi'})` : ''),
          history: messages.slice(-10).map((m) => ({ role: m.role, text: m.text })),
        }),
      })
      const data = await res.json()
      if (res.ok && data.reply) {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', text: data.reply, timestamp: new Date().toISOString() },
        ])
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            text: `⚠️ Error: ${data.error || 'Failed to reach Gemini. Please try again.'}`,
            timestamp: new Date().toISOString(),
          },
        ])
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: '⚠️ Connection error. Please check your network and try again.',
          timestamp: new Date().toISOString(),
        },
      ])
    }
    setLoading(false)
  }

  const quickPrompts = [
    'Explain Article 370 and its abrogation',
    'What is the difference between CRR and SLR?',
    'मराठीत भारतीय संविधानाच्या मूलभूत तत्त्वांवर उत्तर द्या',
    'GST Council voting mechanism — elimination trap?',
    'Current affairs of the day for UPSC',
    'Generate 5 MCQs on Money Market',
  ]

  return (
    <div className="flex flex-col h-[calc(100vh-180px)]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
            <Crown className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              Acharya Chanakya AI Tutor
              <Sparkles className="w-4 h-4 text-amber-400" />
            </h2>
            <p className="text-xs text-slate-400">Powered by Google Gemini • 24×7 Available</p>
          </div>
        </div>
        <div className="flex items-center gap-1 bg-slate-800/50 rounded-lg p-1 border border-slate-700/50">
          {(['english', 'hindi', 'marathi'] as const).map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={cn(
                'px-3 py-1.5 text-xs font-medium rounded-md transition-all capitalize',
                language === lang ? 'bg-amber-500/20 text-amber-400' : 'text-slate-400 hover:text-white'
              )}
            >
              {lang === 'english' ? 'EN' : lang === 'hindi' ? 'हिंदी' : 'मराठी'}
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-2 mb-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={cn('flex gap-3', msg.role === 'user' ? 'justify-end' : 'justify-start')}
          >
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center flex-shrink-0">
                <Crown className="w-4 h-4 text-white" />
              </div>
            )}
            <div
              className={cn(
                'max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap',
                msg.role === 'user'
                  ? 'bg-amber-500/15 text-amber-100 rounded-br-md'
                  : 'bg-slate-800/60 text-slate-200 rounded-bl-md border border-slate-700/30'
              )}
            >
              {msg.text}
            </div>
            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-indigo-400" />
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center flex-shrink-0">
              <Crown className="w-4 h-4 text-white" />
            </div>
            <div className="px-4 py-3 rounded-2xl rounded-bl-md bg-slate-800/60 border border-slate-700/30">
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Loader2 className="w-4 h-4 animate-spin" />
                Acharya is thinking...
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts */}
      {messages.length <= 1 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {quickPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => setInput(prompt)}
              className="px-3 py-1.5 rounded-full text-xs text-slate-400 bg-slate-800/40 border border-slate-700/30 hover:border-amber-500/30 hover:text-amber-400 transition-all"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="flex items-center gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
          placeholder={language === 'marathi' ? 'तुमचा प्रश्न विचारा...' : language === 'hindi' ? 'अपना सवाल पूछें...' : 'Ask your question...'}
          className="flex-1 px-4 py-3 rounded-xl bg-slate-800/60 border border-slate-700/50 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
          disabled={loading}
        />
        <button
          onClick={sendMessage}
          disabled={!input.trim() || loading}
          className={cn(
            'px-4 py-3 rounded-xl transition-all',
            input.trim() && !loading
              ? 'bg-amber-500 text-black hover:bg-amber-400'
              : 'bg-slate-800/50 text-slate-600 cursor-not-allowed'
          )}
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
