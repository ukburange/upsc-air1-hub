import { useMemo } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { Trophy, TrendingUp, Target, Clock, BookOpen, Zap } from 'lucide-react'
import { SyllabusPaper, getTotalTopics, getCompletedTopics } from '@/data/syllabus'

interface KPIMetricsProps {
  syllabus: SyllabusPaper[]
  accuracy: number
  pyqAlignment: number
}

function getDaysUntilPrelims(): number {
  const prelims = new Date('2027-05-24T09:00:00+05:30')
  const now = new Date()
  return Math.max(0, Math.ceil((prelims.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
}

function MiniDoughnut({ percent, color, size = 64 }: { percent: number; color: string; size?: number }) {
  const data = [
    { value: percent },
    { value: 100 - percent },
  ]
  return (
    <ResponsiveContainer width={size} height={size}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={size * 0.3}
          outerRadius={size * 0.45}
          startAngle={90}
          endAngle={-270}
          dataKey="value"
          stroke="none"
        >
          <Cell fill={color} />
          <Cell fill="rgba(255,255,255,0.06)" />
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  )
}

function KpiCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
  children,
}: {
  title: string
  value: string
  subtitle?: string
  icon: React.ElementType
  color: string
  children?: React.ReactNode
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-slate-600/50 transition-colors">
      {children || (
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br ${color}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      )}
      <div className="min-w-0">
        <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">{title}</p>
        <p className="text-xl font-bold text-white leading-tight">{value}</p>
        {subtitle && <p className="text-[11px] text-slate-500">{subtitle}</p>}
      </div>
    </div>
  )
}

export default function KPIMetrics({ syllabus, accuracy, pyqAlignment }: KPIMetricsProps) {
  const total = useMemo(() => getTotalTopics(syllabus), [syllabus])
  const completed = useMemo(() => getCompletedTopics(syllabus), [syllabus])
  const overallPercent = Math.round((completed / total) * 100)
  const daysLeft = getDaysUntilPrelims()

  const polityPaper = syllabus.find((p) => p.id === 'polity')
  const polityCompleted = polityPaper ? polityPaper.topics.filter((t) => t.completed).length : 0
  const polityTotal = polityPaper ? polityPaper.topics.length : 0
  const polityPercent = polityTotal > 0 ? Math.round((polityCompleted / polityTotal) * 100) : 0

  const economyPaper = syllabus.find((p) => p.id === 'economy')
  const economyCompleted = economyPaper ? economyPaper.topics.filter((t) => t.completed).length : 0
  const economyTotal = economyPaper ? economyPaper.topics.length : 0
  const economyPercent = economyTotal > 0 ? Math.round((economyCompleted / economyTotal) * 100) : 0

  return (
    <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
      <KpiCard
        title="Overall Progress"
        value={`${overallPercent}%`}
        subtitle={`${completed}/${total} topics`}
        icon={Target}
        color="from-indigo-500 to-purple-600"
      >
        <div className="relative">
          <MiniDoughnut percent={overallPercent} color="#818cf8" />
          <span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-white">
            {overallPercent}%
          </span>
        </div>
      </KpiCard>

      <KpiCard
        title="Polity GS-2"
        value={`${polityPercent}%`}
        subtitle={`${polityCompleted}/${polityTotal} locked`}
        icon={BookOpen}
        color="from-violet-500 to-indigo-600"
      >
        <div className="relative">
          <MiniDoughnut percent={polityPercent} color={polityPercent === 100 ? '#22c55e' : '#818cf8'} />
          <span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-white">
            {polityPercent}%
          </span>
        </div>
      </KpiCard>

      <KpiCard
        title="Economy GS-3"
        value={`${economyPercent}%`}
        subtitle={`${economyCompleted}/${economyTotal} pillars`}
        icon={TrendingUp}
        color="from-amber-500 to-orange-600"
      >
        <div className="relative">
          <MiniDoughnut percent={economyPercent} color="#f59e0b" />
          <span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-white">
            {economyPercent}%
          </span>
        </div>
      </KpiCard>

      <KpiCard
        title="Test Accuracy"
        value={`${accuracy}%`}
        subtitle="Current mock avg"
        icon={Zap}
        color="from-emerald-500 to-green-600"
      />

      <KpiCard
        title="PYQ Alignment"
        value={`${pyqAlignment}%`}
        subtitle="Trend index"
        icon={Trophy}
        color="from-cyan-500 to-blue-600"
      />

      <KpiCard
        title="Days to Prelims"
        value={daysLeft.toString()}
        subtitle="24 May 2027"
        icon={Clock}
        color="from-rose-500 to-pink-600"
      />
    </div>
  )
}
