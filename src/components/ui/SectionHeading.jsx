import { motion } from 'framer-motion';

export default function SectionHeading({ label, title, description, centered = true }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6 }}
      className={`mb-16 lg:mb-20 ${centered ? 'text-center' : ''}`}
    >
      {label && (
        <span className="inline-block px-4 py-1.5 mb-4 text-xs font-semibold tracking-widest uppercase rounded-full bg-[#7CFF5B]/10 text-[#7CFF5B] border border-[#7CFF5B]/20">
          {label}
        </span>
      )}
      <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] text-white">
        {title}
      </h2>
      {description && (
        <p className={`mt-6 text-lg max-w-2xl ${centered ? 'mx-auto' : ''} text-[#B8B8B8] leading-relaxed`}>
          {description}
        </p>
      )}
    </motion.div>
  );
}