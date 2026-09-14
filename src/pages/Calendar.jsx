import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  Check,
  Trash2,
  X,
  Loader2,
  CalendarDays,
  Repeat,
  AlertCircle,
  RefreshCw,
  Dumbbell,
} from 'lucide-react';
import * as api from '../utils/api';
import {
  normalizeScheduleEntry,
  toApiScheduleEntry,
  toApiScheduleUpdate,
  expandToRange,
  toISODate,
  exerciseFields as ex,
} from '../utils/adapters';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const WEEKDAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

/** Monday-first 6x7 grid covering the given month. */
function buildGrid(year, month) {
  const first = new Date(year, month, 1);
  const offset = (first.getDay() + 6) % 7;
  const start = new Date(year, month, 1 - offset);

  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return { date: d, iso: toISODate(d), inMonth: d.getMonth() === month };
  });
}

const EMPTY_FORM = {
  title: '',
  time: '18:00',
  duration: 60,
  exerciseId: '',
  sets: '',
  reps: '',
  notes: '',
};

const inputCls =
  'w-full h-12 px-4 rounded-xl bg-[#151515] border border-white/10 text-white outline-none transition focus:border-[#7CFF5B] focus:ring-1 focus:ring-[#7CFF5B] placeholder:text-white/25';

export default function Calendar() {
  const today = useMemo(() => new Date(), []);
  const [cursor, setCursor] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [entries, setEntries] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [selectedIso, setSelectedIso] = useState(toISODate(today));
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const todayIso = toISODate(today);

  // No state is set before the first await, so this is safe to call from an
  // effect without triggering a cascading render.
  const fetchEntries = useCallback(async () => {
    try {
      const raw = await api.listSchedule();
      setEntries(raw.map(normalizeScheduleEntry));
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const load = useCallback(() => {
    setLoading(true);
    fetchEntries();
  }, [fetchEntries]);

  useEffect(() => {
    // Fetch on mount: no state is set until after the await, so there is no
    // cascading render — the rule cannot see past the await boundary.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchEntries();
    // The exercise list only populates the picker — a failure here is not fatal.
    api.listExercises().then(setExercises).catch(() => {});
  }, [fetchEntries]);

  useEffect(() => {
    if (!modalOpen) return undefined;
    const onKey = (e) => e.key === 'Escape' && setModalOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [modalOpen]);

  const grid = useMemo(() => buildGrid(year, month), [year, month]);

  /** Weekday-only entries are projected onto every matching day on screen. */
  const visible = useMemo(() => {
    if (!grid.length) return [];
    return expandToRange(entries, grid[0].iso, grid[grid.length - 1].iso);
  }, [entries, grid]);

  const byDate = useMemo(() => {
    const map = new Map();
    for (const e of visible) {
      if (!map.has(e.date)) map.set(e.date, []);
      map.get(e.date).push(e);
    }
    for (const list of map.values()) {
      list.sort((a, b) => (a.time || '').localeCompare(b.time || ''));
    }
    return map;
  }, [visible]);

  const selectedEntries = byDate.get(selectedIso) ?? [];

  const monthStats = useMemo(() => {
    const prefix = `${year}-${String(month + 1).padStart(2, '0')}`;
    const inMonth = visible.filter((e) => e.date.startsWith(prefix));
    const done = inMonth.filter((e) => e.completed);
    return {
      planned: inMonth.length,
      completed: done.length,
      minutes: done.reduce((a, e) => a + (e.duration || 0), 0),
    };
  }, [visible, year, month]);

  const shiftMonth = (delta) => setCursor(new Date(year, month + delta, 1));
  const goToday = () => {
    setCursor(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelectedIso(todayIso);
  };

  const openAdd = (iso) => {
    setSelectedIso(iso);
    setForm(EMPTY_FORM);
    setFormError('');
    setModalOpen(true);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.title.trim() && !form.exerciseId) {
      setFormError('Give the session a name, or pick an exercise.');
      return;
    }
    setSaving(true);
    setFormError('');
    try {
      const chosen = exercises.find((x) => String(ex.id(x)) === String(form.exerciseId));
      const created = await api.createScheduleEntry(
        toApiScheduleEntry({
          ...form,
          date: selectedIso,
          title: form.title.trim() || (chosen ? ex.name(chosen) : 'Workout'),
        })
      );
      setEntries((prev) => [...prev, normalizeScheduleEntry(created)]);
      setModalOpen(false);
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const toggleComplete = async (entry) => {
    const next = !entry.completed;
    setEntries((prev) => prev.map((e) => (e.id === entry.id ? { ...e, completed: next } : e)));
    try {
      // The backend exposes PUT, so the whole object is resent.
      await api.updateScheduleEntry(entry.id, toApiScheduleUpdate(entry, { completed: next }));
    } catch (err) {
      setEntries((prev) =>
        prev.map((e) => (e.id === entry.id ? { ...e, completed: entry.completed } : e))
      );
      setError(err.message);
    }
  };

  const remove = async (entry) => {
    const snapshot = entries;
    setEntries((prev) => prev.filter((e) => e.id !== entry.id));
    try {
      await api.deleteScheduleEntry(entry.id);
    } catch (err) {
      setEntries(snapshot);
      setError(err.message);
    }
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
          <p className="text-[11px] font-bold tracking-[0.18em] uppercase text-[#7CFF5B]">Planner</p>
          <h1 className="mt-1.5 text-3xl lg:text-4xl font-bold tracking-tight">My Calendar</h1>
          <p className="mt-2 text-[#B8B8B8]">
            Plan sessions, tick them off, and keep the streak alive.
          </p>
        </div>
        <button
          onClick={() => openAdd(selectedIso)}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#7CFF5B] text-[#070707] font-semibold hover:bg-[#91ff75] transition-all hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4" strokeWidth={2.5} />
          Add Session
        </button>
      </div>

      {error && (
        <div className="mb-6 flex items-start gap-3 p-4 rounded-2xl bg-[#FF5B5B]/10 border border-[#FF5B5B]/25">
          <AlertCircle className="w-4 h-4 text-[#FF5B5B] shrink-0 mt-0.5" />
          <p className="flex-1 text-sm text-[#FF8A8A] whitespace-pre-line">{error}</p>
          <button
            onClick={load}
            className="flex items-center gap-1.5 text-xs font-semibold text-white/60 hover:text-white transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Retry
          </button>
        </div>
      )}

      {/* ================= MONTH STATS ================= */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {[
          { label: 'Planned', value: monthStats.planned, icon: CalendarDays, color: '#5BE7FF' },
          { label: 'Completed', value: monthStats.completed, icon: Check, color: '#7CFF5B' },
          {
            label: 'Minutes',
            value: monthStats.minutes.toLocaleString(),
            icon: Clock,
            color: '#B75BFF',
          },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="p-4 rounded-2xl bg-[#101010] border border-white/[0.06]">
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
            {WEEKDAY_LABELS.map((d) => (
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
                      {items.slice(0, 2).map((s) => (
                        <div
                          key={`${s.id}-${s.date}`}
                          className={`hidden sm:block truncate text-[10px] font-medium px-1.5 py-0.5 rounded ${
                            s.completed
                              ? 'bg-[#7CFF5B]/20 text-[#7CFF5B]'
                              : 'bg-white/[0.07] text-white/60'
                          }`}
                        >
                          {s.title}
                        </div>
                      ))}
                      {items.length > 2 && (
                        <div className="hidden sm:block text-[10px] text-white/30 px-1.5">
                          +{items.length - 2} more
                        </div>
                      )}

                      <div className="flex sm:hidden gap-0.5 flex-wrap">
                        {items.slice(0, 3).map((s) => (
                          <span
                            key={`${s.id}-${s.date}`}
                            className="w-1.5 h-1.5 rounded-full bg-[#7CFF5B]"
                            style={{ opacity: s.completed ? 1 : 0.4 }}
                          />
                        ))}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
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
              aria-label="Add a session to this day"
              className="w-9 h-9 shrink-0 grid place-items-center rounded-xl bg-[#7CFF5B]/12 border border-[#7CFF5B]/25 text-[#7CFF5B] hover:bg-[#7CFF5B]/20 transition"
            >
              <Plus className="w-4 h-4" strokeWidth={2.5} />
            </button>
          </div>

          {selectedEntries.length === 0 ? (
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
              {selectedEntries.map((s) => (
                <motion.div
                  key={`${s.id}-${s.date}`}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="group relative p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] overflow-hidden"
                >
                  <span
                    className="absolute left-0 inset-y-0 w-[3px]"
                    style={{ backgroundColor: s.completed ? '#7CFF5B' : 'rgba(255,255,255,0.15)' }}
                  />
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p
                        className={`font-semibold truncate ${
                          s.completed ? 'text-white/45 line-through' : ''
                        }`}
                      >
                        {s.title}
                      </p>
                      {s.recurring && (
                        <span className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded bg-[#5BE7FF]/12 text-[#5BE7FF]">
                          <Repeat className="w-2.5 h-2.5" />
                          Weekly
                        </span>
                      )}
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
                        onClick={() => remove(s)}
                        aria-label="Delete session"
                        className="w-7 h-7 grid place-items-center rounded-lg bg-white/[0.06] text-white/50 hover:text-[#FF5B5B] hover:bg-[#FF5B5B]/10 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-xs text-white/40">
                    {s.time && (
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3 h-3" />
                        {s.time}
                        {s.duration ? ` · ${s.duration} min` : ''}
                      </span>
                    )}
                    {s.sets && s.reps && (
                      <span className="flex items-center gap-1.5">
                        <Dumbbell className="w-3 h-3" />
                        {s.sets} × {s.reps}
                      </span>
                    )}
                  </div>

                  {s.notes && <p className="mt-2 text-xs text-white/35">{s.notes}</p>}
                </motion.div>
              ))}
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
                  <h3 className="text-xl font-bold">Add Session</h3>
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

              {formError && (
                <div className="mb-5 flex gap-3 p-4 rounded-xl bg-[#FF5B5B]/10 border border-[#FF5B5B]/25">
                  <AlertCircle className="w-4 h-4 text-[#FF5B5B] shrink-0 mt-0.5" />
                  <p className="text-sm text-[#FF8A8A] whitespace-pre-line">{formError}</p>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-white/60 mb-2">Session name</label>
                  <input
                    autoFocus
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g. Push Day A"
                    className={inputCls}
                  />
                </div>

                {exercises.length > 0 && (
                  <div>
                    <label className="block text-sm text-white/60 mb-2">Exercise (optional)</label>
                    <select
                      value={form.exerciseId}
                      onChange={(e) => setForm({ ...form, exerciseId: e.target.value })}
                      className={`${inputCls} appearance-none cursor-pointer`}
                    >
                      <option value="">— none —</option>
                      {exercises.map((x) => (
                        <option key={ex.id(x)} value={ex.id(x)}>
                          {ex.name(x)}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="grid grid-cols-[1.4fr_1fr] gap-3">
                  <div>
                    <label className="block text-sm text-white/60 mb-2">Time</label>
                    <input
                      type="time"
                      value={form.time}
                      onChange={(e) => setForm({ ...form, time: e.target.value })}
                      className={`${inputCls} [color-scheme:dark]`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-white/60 mb-2">Minutes</label>
                    <input
                      type="number"
                      min="5"
                      max="300"
                      value={form.duration}
                      onChange={(e) => setForm({ ...form, duration: e.target.value })}
                      className={inputCls}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-white/60 mb-2">Sets</label>
                    <input
                      type="number"
                      min="1"
                      value={form.sets}
                      onChange={(e) => setForm({ ...form, sets: e.target.value })}
                      placeholder="3"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-white/60 mb-2">Reps</label>
                    <input
                      type="number"
                      min="1"
                      value={form.reps}
                      onChange={(e) => setForm({ ...form, reps: e.target.value })}
                      placeholder="10"
                      className={inputCls}
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
                    className={`${inputCls} h-auto py-3 resize-none`}
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
                  {saving ? 'Saving…' : 'Add Session'}
                </button>
              </div>
            </motion.form>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
