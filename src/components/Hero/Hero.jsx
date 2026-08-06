import { motion } from 'framer-motion';
import { ArrowRight, Play, Flame, TrendingUp, Activity, Zap, ChevronDown } from 'lucide-react';

function ParticleField() {
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 1,
    duration: Math.random() * 3 + 2,
    delay: Math.random() * 2,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-white/20"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
          animate={{
            y: [0, -30, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

const FLOATING_CARDS = [
  {
    icon: Flame,
    label: 'Calories',
    value: '2,847',
    sub: 'kcal today',
    color: '#FF5B8A',
    position: '-right-8 top-20',
  },
  {
    icon: TrendingUp,
    label: 'Progress',
    value: '+12%',
    sub: 'this week',
    color: '#7CFF5B',
    position: '-left-4 bottom-20',
  },
  {
    icon: Activity,
    label: 'Streak',
    value: '14',
    sub: 'days',
    color: '#5BE7FF',
    getPosition: '-right-16 bottom-40',
  },
];

export default function Hero() {
  const handleScroll = (href) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden pt-20">
      {/* Background Gradients */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#7CFF5B]/5 rounded-full blur-[120px] animate-[gradient-shift_15s_ease-in-out_infinite]" />
        <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-[#5BE7FF]/5 rounded-full blur-[120px] animate-[gradient-shift_20s_ease-in-out_infinite]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#B75BFF]/5 rounded-full blur-[100px] animate-[gradient-shift_18s_ease-in-out_infinite]" />
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: 'radial-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <ParticleField />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-[#7CFF5B]/10 border border-[#7CFF5B]/20"
            >
              <Zap className="w-4 h-4 text-[#7CFF5B]" />
              <span className="text-sm font-medium text-[#7CFF5B]">AI-Powered Fitness Platform</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-extrabold tracking-tight leading-[0.95] text-white"
            >
              Train{' '}
              <span className="bg-gradient-to-r from-[#7CFF5B] via-[#7CFF5B] to-[#5BE7FF] bg-clip-text text-transparent">
                Smarter
              </span>
              .<br />
              Track{' '}
              <span className="bg-gradient-to-r from-[#5BE7FF] to-[#7CFF5B] bg-clip-text text-transparent">
                Better
              </span>
              .
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.7 }}
              className="mt-6 text-lg lg:text-xl text-[#B8B8B8] max-w-lg leading-relaxed"
            >
              Everything you need to build muscle, lose fat, and stay consistent — in one intelligent fitness platform.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.7 }}
              className="mt-10 flex flex-col sm:flex-row gap-4"
            >
              <button
                onClick={() => handleScroll('#features')}
                className="group px-8 py-4 rounded-2xl bg-[#7CFF5B] text-[#070707] font-bold text-base hover:bg-[#8FFF6B] transition-all duration-300 hover:scale-105 shadow-xl shadow-[#7CFF5B]/25 flex items-center justify-center gap-2 cursor-pointer"
              >
                Start Tracking
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => handleScroll('#exercises')}
                className="group px-8 py-4 rounded-2xl bg-[#181818] text-white font-medium text-base border border-[rgba(255,255,255,0.08)] hover:bg-[#222] hover:border-[rgba(255,255,255,0.15)] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Play className="w-5 h-5 text-[#7CFF5B]" />
                Explore Exercises
              </button>
            </motion.div>

            {/* Stats Row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="mt-12 flex gap-8"
            >
              {[
                { value: '500+', label: 'Exercises' },
                { value: '150+', label: 'Workout Plans' },
                { value: '50k+', label: 'Active Users' },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-[#B8B8B8]">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Side - Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="relative hidden lg:block"
          >
            {/* Main fitness figure */}
            <div className="relative mx-auto w-[420px] h-[520px]">
              {/* Background glow behind figure */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-b from-[#7CFF5B]/10 to-transparent blur-3xl" />

              {/* Silhouette using a high-quality fitness image */}
              <motion.img
                src="https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=500&h=600&fit=crop&q=90"
                alt="Fitness athlete"
                className="relative z-10 w-full h-full object-cover rounded-3xl"
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                loading="eager"
              />

              {/* Floating Cards */}
              {[
                { icon: Flame, label: 'Calories Burned', value: '2,847 kcal', color: 'border-l-[#FF5B8A]', pos: '-left-8 top-12' },
                { icon: Activity, label: 'Workout Streak', value: '14 Days', color: 'border-l-[#5BE7FF]', pos: '-right-4 bottom-28' },
                { icon: TrendingUp, label: 'Weekly Progress', value: '+12.5%', color: 'border-l-[#7CFF5B]', pos: '-left-4 bottom-8' },
              ].map((card, i) => (
                <motion.div
                  key={card.label}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1 + i * 0.2, duration: 0.6 }}
                  className={`absolute ${card.pos} z-20`}
                >
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 4 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }}
                    className={`backdrop-blur-xl bg-[#111111]/90 border ${card.color} border-l-2 border-white/[0.06] rounded-2xl px-4 py-3 shadow-2xl min-w-[160px]`}
                  >
                    <div className="flex items-center gap-2">
                      <card.icon className="w-4 h-4 text-[#B8B8B8]" />
                      <span className="text-xs text-[#B8B8B8]">{card.label}</span>
                    </div>
                    <div className="mt-1.5 text-base font-bold text-white">{card.value}</div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
      >
        <span className="text-xs text-[#B8B8B8]/60">Scroll to explore</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-4 h-4 text-[#B8B8B8]/40" />
        </motion.div>
      </motion.div>
    </section>
  );
}