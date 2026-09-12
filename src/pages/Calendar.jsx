import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  Flame,
  Dumbbell,
  Check,
  Trash2,
  X,
  Loader2,
  CalendarDays,
} from 'lucide-react';
import * as api from '../utils/api';
import { WORKOUT_TYPES, toISODate } from '../utils/mockData';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

/** Builds a Monday-first 6x7 grid for the given month. */
function buildGrid(year, month) {
  const first = new Date(year, month, 1);
  const offset = (first.getDay() + 6) % 7; // Mon = 0
  const start = new Date(year, month, 1 - offset);

  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return {
      date: d,
      iso: toISODate(d),
      inMonth: d.getMonth() === month,
    };
  });
}

const EMPTY_FORM = {
  title: '',
  type: 'push',
  time: '18:00',
  duration: 60,
  exercises: 5,
  notes: '',
};

export default function Calendar() {
  const today = useMemo(() => new Date(), []);
  const [cursor, setCursor] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIso, setSelectedIso] = useState(toISODate(today));
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const todayIso = toISODate(today);

  // TODO(django): re-fetch per visible month range — GET /api/workouts/?start=&end=
  useEffect(() => {
    let cancelled = false;
    api
      .getSessions()
      .then((data) => !cancelled && setSessions(data))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  const grid = useMemo(() => buildGrid(year, month), [year, month]);

  const byDate = useMemo(() => {
    const map = new Map();
    for (const s of sessions) {
      if (!map.has(s.date)) map.set(s.date, []);
      map.get(s.date).push(s);
    }
    return map;
  }, [sessions]);

  const selectedSessions = byDate.get(selectedIso) ?? [];

  const monthStats = useMemo(() => {
    const prefix = `${year}-${String(month + 1).padStart(2, '0')}`;
    const inMonth = sessions.filter((s) => s.date.startsWith(prefix));
    const done = inMonth.filter((s) => s.completed);
    return {
      planned: inMonth.length,
      completed: done.length,
      minutes: done.reduce((a, s) => a + s.duration, 0),
      volume: done.reduce((a, s) => a + s.volumeKg, 0),
    };
  }, [sessions, year, month]);

  const shiftMonth = (delta) => setCursor(new Date(year, month + delta, 1));
  const goToday = () => {
    setCursor(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelectedIso(todayIso);
  };

  useEffect(() => {
    if (!modalOpen) return undefined;
    const onKey = (e) => e.key === 'Escape' && setModalOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [modalOpen]);

  const openAdd = useCallback((iso) => {
    setSelectedIso(iso);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSaving(true);
    try {
      // TODO(django): POST /api/workouts/
      const created = await api.createSession({
        ...form,
        date: selectedIso,
        completed: false,
        volumeKg: 0,
        duration: Number(form.duration),
        exercises: Number(form.exercises),
      });
      setSessions((prev) => [...prev, created]);
      setModalOpen(false);
    } finally {
      setSaving(false);
    }
  };

  const toggleComplete = async (session) => {
    const next = !session.completed;
    setSessions((prev) =>
      prev.map((s) => (s.id === session.id ? { ...s, completed: next } : s))
    );
    // TODO(django): PATCH /api/workouts/:id/
    await api.updateSession(session.id, { completed: next });
  };

  const removeSession = async (id) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
    // TODO(django): DELETE /api/workouts/:id/
    await api.deleteSession(id);
  };

  const selectedLabel = new Date(`${selectedIso}T00:00:00`).toLocaleDateString(undefined, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <div>
      {/* ================= HEADER ================= */}
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <p className="text-[11px] font-bold tracking-[0.18em] uppercase text-[#7CFF5B]">
            Planner
          </p>
          <h1 className="mt-1.5 text-3xl lg:text-4xl font-bold tracking-tight">
            Training Calendar
          </h1>
          <p className="mt-2 text-[#B8B8B8]">
            Plan sessions, tick them off, and keep the streak alive.
          </p>
        </div>
        <button
          onClick={() => openAdd(selectedIso)}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#7CFF5B] text-[#070707] font-semibold hover:bg-[#91ff75] transition-all hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4" strokeWidth={2.5} />
          Add Workout
        </button>
      </div>

      {/* ================= MONTH STATS ================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {[
          { label: 'Planned', value: monthStats.planned, icon: CalendarDays, color: '#5BE7FF' },
          { label: 'Completed', value: monthStats.completed, icon: Check, color: '#7CFF5B' },
          {
            label: 'Minutes',
            value: monthStats.minutes.toLocaleString(),
            icon: Clock,
            color: '#B75BFF',
          },
          {
            label: 'Volume',
            value: `${(monthStats.volume / 1000).toFixed(1)}t`,
            icon: Flame,
            color: '#FF5B8A',
          },
        ].map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="p-4 rounded-2xl bg-[#101010] border border-white/[0.06]"
          >
            <div className="flex items-center gap-2 mb-2">
              <Icon className="w-3.5 h-3.5" style={{ color }} />
              <span className="text-xs text-white/40">{label}</span>
            </div>
            <p className="text-2xl font-bold">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_340px] gap-6">
        {/* ================= GRID ================= */}
        <div className="rounded-3xl bg-[#101010] border border-white/[0.06] p-4 sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">
              {MONTHS[month]} <span className="text-white/35 font-medium">{year}</span>
            </h2>
            <div className="flex items-center gap-1.5">
              <button
                onClick={goToday}
                className="px-3 py-2 text-xs font-semibold rounded-lg bg-white/[0.04] text-[#B8B8B8] hover:text-white hover:bg-white/[0.08] transition"
              >
                Today
              </button>
              <button
                onClick={() => shiftMonth(-1)}
                aria-label="Previous month"
                className="w-9 h-9 grid place-items-center rounded-lg bg-white/[0.04] text-[#B8B8B8] hover:text-white hover:bg-white/[0.08] transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => shiftMonth(1)}
                aria-label="Next month"
                className="w-9 h-9 grid place-items-center rounded-lg bg-white/[0.04] text-[#B8B8B8] hover:text-white hover:bg-white/[0.08] transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1.5 mb-2">
            {WEEKDAYS.map((d) => (
              <div
                key={d}
                className="text-center text-[11px] font-bold tracking-wider uppercase text-white/30 py-1"
              >
                {d}
              </div>
            ))}
          </div>

          {loading ? (
            <div className="h-[420px] grid place-items-center text-white/30">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-7 gap-1.5">
              {grid.map(({ date, iso, inMonth }) => {
                const items = byDate.get(iso) ?? [];
                const isToday = iso === todayIso;
                const isSelected = iso === selectedIso;

                return (
                  <button
                    key={iso}
                    onClick={() => setSelectedIso(iso)}
                    onDoubleClick={() => openAdd(iso)}
                    className={`relative aspect-square sm:aspect-[1/0.95] p-1.5 sm:p-2 rounded-xl text-left transition-all duration-200 border ${
                      isSelected
                        ? 'bg-[#7CFF5B]/10 border-[#7CFF5B]/50'
                        : 'border-transparent hover:bg-white/[0.04] hover:border-white/10'
                    } ${!inMonth ? 'opacity-30' : ''}`}
                  >
                    <span
                      className={`inline-grid place-items-center w-6 h-6 rounded-full text-xs font-semibold ${
                        isToday
                          ? 'bg-[#7CFF5B] text-[#070707]'
                          : isSelected
                            ? 'text-[#7CFF5B]'
                            : 'text-white/70'
                      }`}
                    >
                      {date.getDate()}
                    </span>

                    <div className="mt-1 space-y-0.5">
                      {items.slice(0, 2).map((s) => {
                        const t = WORKOUT_TYPES[s.type];
                        return (
                          <div
                            key={s.id}
                            className="hidden sm:block truncate text-[10px] font-medium px-1.5 py-0.5 rounded"
                            style={{
                              backgroundColor: `${t.color}1A`,
                              color: s.completed ? t.color : `${t.color}B3`,
                            }}
                          >
                            {s.title}
                          </div>
                        );
                      })}
                      {items.length > 2 && (
                        <div className="hidden sm:block text-[10px] text-white/30 px-1.5">
                          +{items.length - 2} more
                        </div>
                      )}

                      {/* Mobile: dots only */}
                      <div className="flex sm:hidden gap-0.5 flex-wrap">
                        {items.slice(0, 3).map((s) => (
                          <span
                            key={s.id}
                            className="w-1.5 h-1.5 rounded-full"
                            style={{
                              backgroundColor: WORKOUT_TYPES[s.type].color,
                              opacity: s.completed ? 1 : 0.45,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Legend */}
          <div className="flex flex-wrap gap-3 mt-6 pt-5 border-t border-white/[0.06]">
            {Object.entries(WORKOUT_TYPES).map(([key, t]) => (
              <div key={key} className="flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: t.color }}
                />
                <span className="text-xs text-white/45">{t.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ================= DAY PANEL ================= */}
        <aside className="lg:sticky lg:top-8 h-fit rounded-3xl bg-[#101010] border border-white/[0.06] p-6">
          <div className="flex items-start justify-between gap-3 mb-5">
            <div>
              <p className="text-[11px] font-bold tracking-[0.18em] uppercase text-white/30">
                {selectedIso === todayIso ? 'Today' : 'Selected'}
              </p>
              <h3 className="mt-1 text-lg font-bold leading-snug">{selectedLabel}</h3>
            </div>
            <button
              onClick={() => openAdd(selectedIso)}
              aria-label="Add workout to this day"
              className="w-9 h-9 shrink-0 grid place-items-center rounded-xl bg-[#7CFF5B]/12 border border-[#7CFF5B]/25 text-[#7CFF5B] hover:bg-[#7CFF5B]/20 transition"
            >
              <Plus className="w-4 h-4" strokeWidth={2.5} />
            </button>
          </div>

          {selectedSessions.length === 0 ? (
            <div className="py-10 text-center">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-white/[0.04] grid place-items-center mb-3">
                <CalendarDays className="w-5 h-5 text-white/25" />
              </div>
              <p className="text-sm text-white/40">Nothing scheduled.</p>
              <button
                onClick={() => openAdd(selectedIso)}
                className="mt-3 text-sm font-medium text-[#7CFF5B] hover:underline"
              >
                Plan a session
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {selectedSessions.map((s) => {
                const t = WORKOUT_TYPES[s.type];
                return (
                  <motion.div
                    key={s.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="group relative p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] overflow-hidden"
                  >
                    <span
                      className="absolute left-0 inset-y-0 w-[3px]"
                      style={{ backgroundColor: t.color }}
                    />
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p
                          className={`font-semibold truncate ${s.completed ? 'text-white/45 line-through' : ''}`}
                        >
                          {s.title}
                        </p>
                        <span
                          className="inline-block mt-1.5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded"
                          style={{ backgroundColor: `${t.color}1A`, color: t.color }}
                        >
                          {t.label}
                        </span>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition">
                        <button
                          onClick={() => toggleComplete(s)}
                          aria-label={s.completed ? 'Mark incomplete' : 'Mark complete'}
                          className={`w-7 h-7 grid place-items-center rounded-lg transition ${
                            s.completed
                              ? 'bg-[#7CFF5B] text-[#070707]'
                              : 'bg-white/[0.06] text-white/50 hover:text-[#7CFF5B]'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5" strokeWidth={3} />
                        </button>
                        <button
                          onClick={() => removeSession(s.id)}
                          aria-label="Delete workout"
                          className="w-7 h-7 grid place-items-center rounded-lg bg-white/[0.06] text-white/50 hover:text-[#FF5B5B] hover:bg-[#FF5B5B]/10 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-xs text-white/40">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3 h-3" />
                        {s.time} · {s.duration} min
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Dumbbell className="w-3 h-3" />
                        {s.exercises} exercises
                      </span>
                      {s.volumeKg > 0 && (
                        <span className="flex items-center gap-1.5">
                          <Flame className="w-3 h-3" />
                          {s.volumeKg.toLocaleString()} kg
                        </span>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </aside>
      </div>

      {/* ================= ADD MODAL ================= */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 grid place-items-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalOpen(false)}
              className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            />
            <motion.form
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              onSubmit={handleCreate}
              className="relative w-full max-w-md rounded-3xl bg-[#0F0F0F] border border-white/10 p-6 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold">Add Workout</h3>
                  <p className="mt-1 text-sm text-white/40">{selectedLabel}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  aria-label="Close"
                  className="w-8 h-8 grid place-items-center rounded-lg bg-white/[0.06] text-white/50 hover:text-white transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-white/60 mb-2">Workout name</label>
                  <input
                    autoFocus
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g. Push Day A"
                    required
                    className="w-full h-12 px-4 rounded-xl bg-[#151515] border border-white/10 outline-none focus:border-[#7CFF5B] focus:ring-1 focus:ring-[#7CFF5B] transition placeholder:text-white/25"
                  />
                </div>

                <div>
                  <label className="block text-sm text-white/60 mb-2">Type</label>
                  <div className="grid grid-cols-3 gap-2">
                    {Object.entries(WORKOUT_TYPES).map(([key, t]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setForm({ ...form, type: key })}
                        className="px-2 py-2.5 rounded-xl text-xs font-semibold border transition-all"
                        style={{
                          borderColor: form.type === key ? t.color : 'rgba(255,255,255,0.10)',
                          backgroundColor: form.type === key ? `${t.color}1A` : 'transparent',
                          color: form.type === key ? t.color : 'rgba(255,255,255,0.55)',
                        }}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-[1.4fr_1fr_1fr] gap-3">
                  <div>
                    <label className="block text-sm text-white/60 mb-2">Time</label>
                    <input
                      type="time"
                      value={form.time}
                      onChange={(e) => setForm({ ...form, time: e.target.value })}
                      className="w-full h-12 px-3 rounded-xl bg-[#151515] border border-white/10 outline-none focus:border-[#7CFF5B] transition [color-scheme:dark]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-white/60 mb-2">Mins</label>
                    <input
                      type="number"
                      min="5"
                      max="300"
                      value={form.duration}
                      onChange={(e) => setForm({ ...form, duration: e.target.value })}
                      className="w-full h-12 px-3 rounded-xl bg-[#151515] border border-white/10 outline-none focus:border-[#7CFF5B] transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-white/60 mb-2">Exercises</label>
                    <input
                      type="number"
                      min="1"
                      max="30"
                      value={form.exercises}
                      onChange={(e) => setForm({ ...form, exercises: e.target.value })}
                      className="w-full h-12 px-3 rounded-xl bg-[#151515] border border-white/10 outline-none focus:border-[#7CFF5B] transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-white/60 mb-2">Notes (optional)</label>
                  <textarea
                    rows={3}
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    placeholder="Focus points, target weights…"
                    className="w-full px-4 py-3 rounded-xl bg-[#151515] border border-white/10 outline-none focus:border-[#7CFF5B] transition resize-none placeholder:text-white/25"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-7">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 h-12 rounded-xl border border-white/10 text-white/70 font-medium hover:bg-white/[0.04] transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 h-12 rounded-xl bg-[#7CFF5B] text-[#070707] font-bold hover:bg-[#91ff75] transition disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {saving ? 'Saving…' : 'Add Workout'}
                </button>
              </div>
            </motion.form>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
