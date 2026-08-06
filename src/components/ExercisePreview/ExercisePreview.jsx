import { motion } from 'framer-motion';
import { Dumbbell, Target, Gauge } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';
import { EXERCISES, DIFFICULTY_COLORS } from '../../utils/data';

function ExerciseCard({ exercise, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -6, transition: { duration: 0.3 } }}
      className="group relative rounded-2xl bg-[#111111] border border-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.12)] overflow-hidden transition-all duration-500"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={exercise.image}
          alt={exercise.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent" />
        {/* Difficulty badge */}
        <span
          className="absolute top-3 right-3 px-2.5 py-1 rounded-lg text-xs font-semibold backdrop-blur-md bg-black/50 border border-white/10"
          style={{ color: DIFFICULTY_COLORS[exercise.difficulty] }}
        >
          {exercise.difficulty}
        </span>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-base font-semibold text-white mb-3">{exercise.name}</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-xs text-[#B8B8B8]">
            <Target className="w-3.5 h-3.5" />
            {exercise.muscle}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[#B8B8B8]">
            <Dumbbell className="w-3.5 h-3.5" />
            {exercise.equipment}
          </div>
        </div>
      </div>

      {/* Hover overlay glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
        style={{
          background: `radial-gradient(300px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(124,255,91,0.06), transparent 60%)`,
        }}
      />
    </motion.div>
  );
}

export default function ExercisePreview() {
  return (
    <section id="exercises" className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          label="Exercises"
          title="Exercise Library Preview."
          description="Explore our comprehensive exercise database with detailed instructions and visual guides."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {EXERCISES.map((ex, i) => (
            <ExerciseCard key={ex.name} exercise={ex} index={i} />
          ))}
        </div>

        {/* View All CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-12 text-center"
        >
          <button className="px-8 py-3.5 rounded-2xl bg-[#181818] text-white font-medium text-sm border border-[rgba(255,255,255,0.08)] hover:bg-[#222] hover:border-[rgba(255,255,255,0.15)] transition-all duration-300 hover:scale-105 cursor-pointer">
            View Full Exercise Library
          </button>
        </motion.div>
      </div>
    </section>
  );
}