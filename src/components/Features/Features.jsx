import { motion } from 'framer-motion';
import SectionHeading from '../ui/SectionHeading';
import { FEATURES } from '../../utils/data';

function FeatureCard({ icon: Icon, title, description, color, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className="group relative p-8 rounded-2xl bg-[#111111] border border-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.12)] transition-all duration-500 overflow-hidden"
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
        style={{
          background: `radial-gradient(400px circle at 50% 0%, ${color}08, transparent 70%)`,
        }}
      />
      <div className="relative z-10 w-12 h-12 rounded-xl flex items-center justify-center mb-5" style={{ backgroundColor: `${color}15` }}>
        <Icon className="w-6 h-6" style={{ color }} />
      </div>
      <h3 className="relative z-10 text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="relative z-10 text-[#B8B8B8] leading-relaxed text-sm">{description}</p>
    </motion.div>
  );
}

export default function Features() {
  return (
    <section id="features" className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          label="Features"
          title="Everything you need to transform."
          description="Your complete fitness companion packed with powerful tools designed to help you achieve every goal you set."
        />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature, i) => (
            <FeatureCard key={feature.title} {...feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}