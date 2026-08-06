import { useState } from 'react';
import { motion } from 'framer-motion';
import SectionHeading from '../ui/SectionHeading';
import { MUSCLE_GROUPS } from '../../utils/data';

export default function MuscleGroup() {
  const [activeMuscle, setActiveMuscle] = useState(null);

  return (
    <section id="muscles" className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          label="Anatomy"
          title="Interactive Muscle Guide."
          description="Explore every muscle group. Click to learn exercises, functions, and training tips."
        />

        <div className="relative max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative mx-auto w-[280px] h-[560px] sm:w-[320px] sm:h-[640px]"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1577221084712-45b0445d2b00?w=400&h=800&fit=crop&q=80"
                alt="Human body anatomy reference"
                className="w-full h-full object-contain opacity-40 filter brightness-75"
                loading="lazy"
              />
            </div>

            {MUSCLE_GROUPS.map((muscle) => (
              <div
                key={muscle.id}
                style={{
                  position: 'absolute',
                  ...muscle.position,
                  transform: 'translate(-50%, -50%)',
                }}
                className="z-10"
              >
                <motion.button
                  whileHover={{ scale: 1.15 }}
                  onMouseEnter={() => setActiveMuscle(muscle.id)}
                  onMouseLeave={() => setActiveMuscle(null)}
                  className="cursor-pointer"
                  aria-label={muscle.label}
                >
                  <div
                    className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full transition-all duration-300 ${
                      activeMuscle === muscle.id ? 'scale-150' : ''
                    }`}
                    style={{
                      backgroundColor:
                        activeMuscle === muscle.id
                          ? muscle.color
                          : 'rgba(255,255,255,0.3)',
                      boxShadow:
                        activeMuscle === muscle.id
                          ? `0 0 20px ${muscle.color}40, 0 0 40px ${muscle.color}20`
                          : '0 0 0px transparent',
                    }}
                  />
                  <div
                    className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-300 ${
                      activeMuscle === muscle.id
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-2 pointer-events-none'
                    }`}
                    style={{
                      backgroundColor: `${muscle.color}20`,
                      border: `1px solid ${muscle.color}30`,
                      color: muscle.color,
                    }}
                  >
                    {muscle.label}
                  </div>
                </motion.button>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}