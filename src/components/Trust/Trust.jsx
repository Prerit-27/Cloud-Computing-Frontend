import { motion } from 'framer-motion';
import CountUp from '../ui/CountUp';
import { Flame, Library, ClipboardList, Salad } from 'lucide-react';

const METRICS = [
  { icon: Flame, value: 20000, suffix: '+', label: 'Exercises Logged', color: '#FF5B8A' },
  { icon: Library, value: 500, suffix: '+', label: 'Exercise Library', color: '#5BE7FF' },
  { icon: ClipboardList, value: 150, suffix: '+', label: 'Workout Plans', color: '#B75BFF' },
  { icon: Salad, value: 100, suffix: '+', label: 'Diet Templates', color: '#7CFF5B' },
];

function MetricIcon({ icon: Icon, color }) {
  return (
    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#181818] border border-[rgba(255,255,255,0.06)] mb-4">
      <Icon className="w-5 h-5" style={{ color }} />
    </div>
  );
}

export default function Trust() {
  return (
    <section className="py-20 lg:py-28 border-t border-b border-[rgba(255,255,255,0.06)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center text-sm font-medium tracking-widest uppercase text-[#B8B8B8]/60 mb-12"
        >
          Trusted by fitness enthusiasts worldwide
        </motion.p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {METRICS.map((metric, i) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="text-center"
            >
              <MetricIcon icon={metric.icon} color={metric.color} />
              <div className="text-3xl lg:text-4xl font-bold text-white mb-1 tracking-tight tabular-nums">
                <CountUp end={metric.value} suffix={metric.suffix} duration={2500} />
              </div>
              <div className="text-sm text-[#B8B8B8]">{metric.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}