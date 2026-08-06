import { motion } from 'framer-motion';
import SectionHeading from '../ui/SectionHeading';
import { BarChart3, TrendingUp, Activity, Calendar, Flame, Gauge } from 'lucide-react';

function MiniChart({ label, value, change, color, bars }) {
  return (
    <div className="bg-[#0C0C0C] rounded-xl p-4 border border-[rgba(255,255,255,0.04)]">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-[#B8B8B8]">{label}</span>
        <span className="text-xs font-medium" style={{ color }}>{change}</span>
      </div>
      <div className="text-2xl font-bold text-white mb-3">{value}</div>
      <div className="flex items-end gap-[3px] h-10">
        {bars.map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-t-sm transition-all duration-500"
            style={{
              height: `${h}%`,
              backgroundColor: h > 60 ? color : `${color}30`,
              borderTopWidth: 2,
              borderTopStyle: 'solid',
              borderTopColor: color,
            }}
          />
        ))}
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color, subtitle }) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl bg-[#0C0C0C] border border-[rgba(255,255,255,0.04)]">
      <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${color}15` }}>
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      <div>
        <div className="text-xs text-[#B8B8B8]">{label}</div>
        <div className="text-lg font-bold text-white">{value}</div>
        {subtitle && <div className="text-xs text-[#B8B8B8]/60">{subtitle}</div>}
      </div>
    </div>
  );
}

export default function DashboardPreview() {
  return (
    <section id="diet" className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          label="Dashboard"
          title="Beautiful analytics at your fingertips."
          description="Track every metric that matters. Your progress, beautifully visualized in real-time."
        />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative rounded-3xl bg-gradient-to-b from-[#111111] to-[#0A0A0A] border border-[rgba(255,255,255,0.06)] p-6 lg:p-8 overflow-hidden shadow-2xl"
        >
          {/* Fake top bar */}
          <div className="flex items-center gap-2 mb-8 pb-4 border-b border-[rgba(255,255,255,0.04)]">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/60" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
              <div className="w-3 h-3 rounded-full bg-green-500/60" />
            </div>
            <span className="text-xs text-[#B8B8B8]/40 ml-3">FitPulse — Dashboard Overview</span>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard icon={Flame} label="Calories Today" value="1,847" subtitle="+340 from yesterday" color="#FF5B8A" />
            <StatCard icon={Activity} label="Workout Streak" value="14 Days" subtitle="Best: 21 days" color="#5BE7FF" />
            <StatCard icon={TrendingUp} label="Weekly Progress" value="+12.5%" subtitle="vs last week" color="#7CFF5B" />
            <StatCard icon={Gauge} label="Muscle Split" value="5 Groups" subtitle="Upper / Lower" color="#B75BFF" />
          </div>

          {/* Charts Grid */}
          <div className="grid lg:grid-cols-4 gap-4">
            <MiniChart
              label="Weekly Progress"
              value="+12.5%"
              change="▲ Increased"
              color="#7CFF5B"
              bars={[40, 55, 48, 72, 65, 58, 88]}
            />
            <MiniChart
              label="Calories"
              value="1,847"
              change="On Track"
              color="#FF5B8A"
              bars={[65, 68, 70, 72, 68, 65, 70]}
            />
            <MiniChart
              label="Weight Tracker"
              value="178.4"
              change="-1.2 kg"
              color="#5BE7FF"
              bars={[72, 68, 65, 58, 52, 48, 42]}
            />
            <MiniChart
              label="Volume Load"
              value="12,450"
              change="+15%"
              color="#B75BFF"
              bars={[32, 45, 38, 65, 72, 58, 80]}
            />
          </div>

          {/* Weekly Calendar Strip */}
          <div className="mt-6 p-5 rounded-2xl bg-[#0C0C0C] border border-[rgba(255,255,255,0.04)]">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-4 h-4 text-[#B8B8B8]" />
              <span className="text-sm font-medium text-white">This Week</span>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                <div key={i} className="text-center">
                  <div className="text-xs text-[#B8B8B8]/60 mb-2">{day}</div>
                  <div
                    className={`w-full aspect-square rounded-xl flex items-center justify-center text-sm font-semibold transition-colors ${
                      i < 4
                        ? 'bg-[#7CFF5B]/10 text-[#7CFF5B] border border-[#7CFF5B]/20'
                        : i === 4
                        ? 'bg-[#111111] text-[#B8B8B8] border border-[rgba(255,255,255,0.06)]'
                        : 'bg-[#0C0C0C] text-[#B8B8B8]/40'
                    }`}
                  >
                    {i === 3 ? ' 🏆' : ''}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}