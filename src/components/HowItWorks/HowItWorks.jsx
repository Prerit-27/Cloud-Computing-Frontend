import { motion } from 'framer-motion';
import SectionHeading from '../ui/SectionHeading';
import { HOW_IT_WORKS_STEPS } from '../../utils/data';

export default function HowItWorks() {
  return (
    <section id="workouts" className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          label="How It Works"
          title="Your fitness journey in three steps."
          description="Getting started is simple — define your goals, get your plan, and watch the progress unfold."
        />

        <div className="relative">
          {/* Connecting line */}
          <div className="hidden lg:block absolute top-32 left-[16.5%] right-[16.5%] h-[2px] bg-gradient-to-r from-[#7CFF5B]/30 via-[#5BE7FF]/30 to-[#B75BFF]/30 rounded-full" />

          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {HOW_IT_WORKS_STEPS.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                className="relative text-center lg:text-left"
              >
                {/* Step number badge */}
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#111111] border border-[rgba(255,255,255,0.08)] mb-6">
                  <span className="text-2xl font-bold bg-gradient-to-r from-[#7CFF5B] to-[#5BE7FF] bg-clip-text text-transparent">
                    {step.step}
                  </span>
                </div>

                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-[#181818] border border-[rgba(255,255,255,0.06)] mb-5">
                  <step.icon className="w-6 h-6 text-[#7CFF5B]" />
                </div>

                <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>
                <p className="text-[#B8B8B8] leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}