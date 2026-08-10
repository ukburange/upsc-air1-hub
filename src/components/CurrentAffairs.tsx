import { useState } from 'react'
import { Plus, Search, ExternalLink, Calendar, BookOpen, AlertTriangle, X } from 'lucide-react'
import { currentAffairsData, CurrentAffair } from '@/data/currentAffairs'
import { cn } from '@/lib/cn'

export default function CurrentAffairs() {
  const [entries, setEntries] = useState<CurrentAffair[]>(currentAffairsData)
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    title: '',
    source: 'The Hindu',
    gsLink: '',
    timeline: '',
    eliminationTrap: '',
    category: 'Economy',
  })

  const filtered = entries.filter(
    (e) =>
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.gsLink.toLowerCase().includes(search.toLowerCase()) ||
      e.category.toLowerCase().includes(search.toLowerCase())
  )

  const addEntry = () => {
    if (!form.title.trim()) return
    const newEntry: CurrentAffair = {
      id: `ca-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      ...form,
    }
    setEntries([newEntry, ...entries])
    setForm({ title: '', source: 'The Hindu', gsLink: '', timeline: '', eliminationTrap: '', category: 'Economy' })
    setShowForm(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">Daily Current Affairs Bulletin</h2>
          <p className="text-sm text-slate-400 mt-0.5">Map news to static GS topics with elimination traps</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-500/15 text-amber-400 hover:bg-amber-500/25 transition-colors text-sm font-medium"
        >
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? 'Cancel' : 'Add Entry'}
        </button>
      </div>

      {showForm && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              placeholder="Topic title..."
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-700/50 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
            />
            <select
              value={form.source}
              onChange={(e) => setForm({ ...form, source: e.target.value })}
              className="px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-700/50 text-sm text-white focus:outline-none focus:border-amber-500/50"
            >
              <option>The Hindu</option>
              <option>PIB</option>
              <option>2nd ARC</option>
              <option>SC Judgment</option>
              <option>Gazette of India</option>
              <option>RBI Bulletin</option>
              <option>OECD</option>
            </select>
            <input
              placeholder="Static GS Link (e.g., Art 279A | Economy: GST)"
              value={form.gsLink}
              onChange={(e) => setForm({ ...form, gsLink: e.target.value })}
              className="px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-700/50 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
            />
            <input
              placeholder="Timeline (e.g., 15 Sep 2016 Est, 01 Jul 2017 Impl)"
              value={form.timeline}
              onChange={(e) => setForm({ ...form, timeline: e.target.value })}
              className="px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-700/50 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
            />
            <input
              placeholder="Elimination Trap / Core Insight"
              value={form.eliminationTrap}
              onChange={(e) => setForm({ ...form, eliminationTrap: e.target.value })}
              className="px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-700/50 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 md:col-span-2"
            />
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-700/50 text-sm text-white focus:outline-none focus:border-amber-500/50"
            >
              <option>Economy</option>
              <option>Polity</option>
              <option>Environment</option>
              <option>Geography</option>
              <option>Science & Tech</option>
              <option>International Relations</option>
            </select>
          </div>
          <button
            onClick={addEntry}
            className="px-4 py-2 rounded-lg bg-amber-500 text-black text-sm font-semibold hover:bg-amber-400 transition-colors"
          >
            Add to Bulletin
          </button>
        </div>
      )}

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          placeholder="Search current affairs by topic, GS link, or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
        />
      </div>

      <div className="space-y-2">
        {filtered.map((entry) => (
          <div
            key={entry.id}
            className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-4 hover:border-slate-600/50 transition-colors"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-sm font-semibold text-white">{entry.title}</h4>
                  <span
                    className={cn(
                      'px-1.5 py-0.5 text-[10px] font-bold rounded uppercase',
                      entry.category === 'Economy'
                        ? 'bg-amber-500/15 text-amber-400'
                        : entry.category === 'Polity'
                          ? 'bg-indigo-500/15 text-indigo-400'
                          : 'bg-emerald-500/15 text-emerald-400'
                    )}
                  >
                    {entry.category}
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-2 flex-wrap">
                  <span className="flex items-center gap-1 text-[11px] text-slate-400">
                    <Calendar className="w-3 h-3" />
                    {entry.date}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-slate-400">
                    <BookOpen className="w-3 h-3" />
                    {entry.source}
                  </span>
                  <span className="text-[11px] text-blue-400">{entry.gsLink}</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">Timeline: {entry.timeline}</p>
              </div>
            </div>
            {entry.eliminationTrap && (
              <div className="mt-3 flex items-start gap-2 px-3 py-2 rounded-lg bg-red-500/5 border border-red-500/20">
                <AlertTriangle className="w-3.5 h-3.5 text-red-400 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-red-300 leading-relaxed">{entry.eliminationTrap}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
