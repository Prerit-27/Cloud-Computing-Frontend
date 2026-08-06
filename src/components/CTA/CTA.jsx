import { motion } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';

export default function CTA() {
  const handleScroll = (href) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="pricing" className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative rounded-3xl p-12 md:p-20 overflow-hidden text-center"
        >
          {/* Animated gradient background */}
          <div
            className="absolute inset-0 opacity-80"
            style={{
              background: `
                radial-gradient(ellipse at 20% 50%, rgba(124, 255, 91, 0.08) 0%, transparent 50%),
                radial-gradient(ellipse at 80% 50%, rgba(91, 231, 255, 0.08) 0%, transparent 50%),
                radial-gradient(ellipse at 50% 0%, rgba(183, 91, 255, 0.06) 0%, transparent 50%)
              `,
            }}
          />
          <div className="absolute inset-0 bg-[#111111]/90 backdrop-blur-xl rounded-3xl border border-[rgba(255,255,255,0.06)]" />

          <div className="relative z-10">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="inline-block px-4 py-1.5 mb-6 text-xs font-semibold tracking-widest uppercase rounded-full bg-[#7CFF5B]/10 text-[#7CFF5B] border border-[#7CFF5B]/20"
            >
              Start Free Trial
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-white mb-6"
            >
              Start Building Your{' '}
              <span className="bg-gradient-to-r from-[#7CFF5B] to-[#5BE7FF] bg-clip-text text-transparent">
                Best Body Today.
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-lg text-[#B8B8B8] max-w-xl mx-auto mb-10 leading-relaxed"
            >
              Join 50,000+ fitness enthusiasts who are already using FitPulse to crush their goals. No credit card needed.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <button
                onClick={() => handleScroll('#home')}
                className="group px-8 py-4 rounded-2xl bg-[#7CFF5B] text-[#070707] font-bold text-base hover:bg-[#8FFF6B] transition-all duration-300 hover:scale-105 shadow-xl shadow-[#7CFF5B]/25 flex items-center gap-2 cursor-pointer"
              >
                Create Free Account
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => handleScroll('#exercises')}
                className="group px-8 py-4 rounded-2xl bg-[#181818] text-white font-medium text-base border border-[rgba(255,255,255,0.08)] hover:bg-[#222] hover:border-[rgba(255,255,255,0.15)] transition-all duration-300 flex items-center gap-2 cursor-pointer"
              >
                <Play className="w-5 h-5 text-[#7CFF5B]" />
                Explore Exercises
              </button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}