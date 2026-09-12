import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Dumbbell, Lightbulb, X } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';
import BodyMap from './BodyMap';
import { FRONT_MUSCLES, BACK_MUSCLES, MUSCLE_LIBRARY } from '../../utils/muscleData';

export default function MuscleGroup() {
  const [view, setView] = useState('front');
  const [hovered, setHovered] = useState(null);
  const [selected, setSelected] = useState('chest');

  const muscles = view === 'front' ? FRONT_MUSCLES : BACK_MUSCLES;
  const detail = useMemo(() => MUSCLE_LIBRARY[selected] ?? null, [selected]);
  const accent = useMemo(
    () => muscles.find((m) => m.id === selected)?.color ?? '#7CFF5B',
    [muscles, selected]
  );

  const flip = () => {
    const next = view === 'front' ? 'back' : 'front';
    setView(next);
    const list = next === 'front' ? FRONT_MUSCLES : BACK_MUSCLES;
    // Keep the selection if the muscle exists on the other side, else pick the first.
    if (!list.some((m) => m.id === selected)) setSelected(list[0].id);
  };

  return (
    <section id="muscles" className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          label="Anatomy"
          title="Interactive Muscle Guide."
          description="Explore every muscle group. Hover to highlight, click to see what it does and how to train it."
        />

        <div className="grid lg:grid-cols-[minmax(0,1fr)_380px] gap-10 lg:gap-14 items-start">
          {/* ============ BODY ============ */}
          <div className="relative">
            {/* Ambient glow */}
            <div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full blur-[130px] pointer-events-none transition-colors duration-500"
              style={{ backgroundColor: `${accent}14` }}
            />

            {/* View toggle */}
            <div className="relative flex items-center justify-center gap-2 mb-6">
              <div className="inline-flex p-1 rounded-xl bg-[#121212] border border-white/[0.08]">
                {['front', 'back'].map((v) => (
                  <button
                    key={v}
                    onClick={() => v !== view && flip()}
                    className={`px-5 py-2 text-sm font-semibold rounded-lg capitalize transition-all duration-300 ${
                      view === v
                        ? 'bg-[#7CFF5B] text-[#070707]'
                        : 'text-[#B8B8B8] hover:text-white'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
              <button
                onClick={flip}
                aria-label="Rotate body"
                className="w-10 h-10 grid place-items-center rounded-xl bg-[#121212] border border-white/[0.08] text-[#B8B8B8] hover:text-white hover:border-white/20 transition-all"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={view}
                initial={{ opacity: 0, rotateY: -25 }}
                animate={{ opacity: 1, rotateY: 0 }}
                exit={{ opacity: 0, rotateY: 25 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
                className="relative mx-auto w-full max-w-[440px] h-[560px] sm:h-[640px]"
                style={{ perspective: 1000 }}
              >
                <BodyMap
                  view={view}
                  active={hovered}
                  selected={selected}
                  onHover={setHovered}
                  onSelect={setSelected}
                />
              </motion.div>
            </AnimatePresence>

            {/* Quick-pick chips */}
            <div className="relative flex flex-wrap justify-center gap-2 mt-6">
              {muscles.map((m) => (
                <button
                  key={m.id}
                  onMouseEnter={() => setHovered(m.id)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => setSelected(m.id)}
                  className="px-3 py-1.5 text-xs font-medium rounded-full border transition-all duration-300"
                  style={{
                    borderColor: selected === m.id ? m.color : 'rgba(255,255,255,0.08)',
                    backgroundColor: selected === m.id ? `${m.color}1A` : 'transparent',
                    color: selected === m.id ? m.color : '#B8B8B8',
                  }}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* ============ DETAIL PANEL ============ */}
          <AnimatePresence mode="wait">
            {detail && (
              <motion.aside
                key={selected + view}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35 }}
                className="lg:sticky lg:top-28 rounded-3xl bg-[#101010] border border-white/[0.08] p-7 overflow-hidden"
              >
                <div
                  className="absolute inset-x-0 top-0 h-[3px]"
                  style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }}
                />

                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p
                      className="text-[11px] font-bold tracking-[0.18em] uppercase"
                      style={{ color: accent }}
                    >
                      Muscle Group
                    </p>
                    <h3 className="mt-1.5 text-2xl font-bold text-white">{detail.name}</h3>
                    <p className="mt-1 text-sm italic text-white/35">{detail.latin}</p>
                  </div>
                  <button
                    onClick={() => setSelected(null)}
                    aria-label="Close details"
                    className="lg:hidden w-8 h-8 grid place-items-center rounded-lg bg-white/5 text-white/50"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <p className="mt-5 text-sm leading-relaxed text-[#B8B8B8]">{detail.function}</p>

                <div className="mt-7">
                  <div className="flex items-center gap-2 mb-3">
                    <Dumbbell className="w-4 h-4" style={{ color: accent }} />
                    <span className="text-xs font-bold tracking-wider uppercase text-white/70">
                      Best Exercises
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {detail.exercises.map((ex) => (
                      <div
                        key={ex}
                        className="px-3 py-2.5 text-xs font-medium rounded-xl bg-white/[0.03] border border-white/[0.06] text-[#D4D4D4] hover:border-white/15 transition-colors"
                      >
                        {ex}
                      </div>
                    ))}
                  </div>
                </div>

                <div
                  className="mt-6 flex gap-3 p-4 rounded-2xl"
                  style={{ backgroundColor: `${accent}0F`, border: `1px solid ${accent}26` }}
                >
                  <Lightbulb className="w-4 h-4 shrink-0 mt-0.5" style={{ color: accent }} />
                  <p className="text-xs leading-relaxed text-[#C8C8C8]">{detail.tip}</p>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
