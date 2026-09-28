import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Pencil,
  Check,
  Trash2,
  X,
  Loader2,
  CalendarDays,
  Repeat,
  AlertCircle,
  RefreshCw,
  Dumbbell,
  Search,
  Activity,
} from 'lucide-react';
import * as api from '../utils/api';
import {
  normalizeScheduleEntry,
  toApiScheduleEntry,
  toISODate,
  dayCodeOf,
  dayLabel,
  DAYS,
  exerciseFields as ex,
  muscleColor,
  humanize,
} from '../utils/adapters';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

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
  const [form, setForm] = useState({ day: 'mon', exerciseIds: [], notes: '' });
  const [pickerQuery, setPickerQuery] = useState('');
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const todayIso = toISODate(today);

  // No state is set before the first await, so this is safe to call from an
  // effect without triggering a cascading render.
  const fetchEntries = useCallback(async () => {
    try {
      const [raw, lib] = await Promise.all([api.listSchedule(), api.listExercises()]);
      setEntries(raw.map(normalizeScheduleEntry));
      setExercises(lib);
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
  }, [fetchEntries]);

  useEffect(() => {
    if (!modalOpen) return undefined;
    const onKey = (e) => e.key === 'Escape' && setModalOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [modalOpen]);

  const grid = useMemo(() => buildGrid(year, month), [year, month]);

  /** One plan per weekday; every calendar day shows its weekday's plan. */
  const byDay = useMemo(() => new Map(entries.map((e) => [e.day, e])), [entries]);

  const selectedDate = new Date(`${selectedIso}T00:00:00`);
  const selectedDay = dayCodeOf(selectedDate);
  const selectedEntry = byDay.get(selectedDay) ?? null;

  const weekStats = useMemo(() => {
    const active = entries.filter((e) => e.exercises.length > 0);
    return {
      days: active.length,
      exercises: active.reduce((a, e) => a + e.exercises.length, 0),
      muscles: new Set(active.flatMap((e) => e.muscleGroups)).size,
    };
  }, [entries]);

  const shiftMonth = (delta) => setCursor(new Date(year, month + delta, 1));
  const goToday = () => {
    setCursor(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelectedIso(todayIso);
  };

  const openEditor = (iso) => {
    const day = dayCodeOf(new Date(`${iso}T00:00:00`));
    const entry = byDay.get(day);
    setSelectedIso(iso);
    setForm({ day, exerciseIds: entry?.exerciseIds ?? [], notes: entry?.notes ?? '' });
    setPickerQuery('');
    setFormError('');
    setModalOpen(true);
  };

  const toggleExercise = (id) =>
    setForm((f) => ({
      ...f,
      exerciseIds: f.exerciseIds.includes(id)
        ? f.exerciseIds.filter((x) => x !== id)
        : [...f.exerciseIds, id],
    }));

  const handleSave = async (e) => {
    e.preventDefault();
    if (form.exerciseIds.length === 0) {
      setFormError('Pick at least one exercise for this day.');
      return;
    }
    setSaving(true);
    setFormError('');
    try {
      const body = toApiScheduleEntry(form);
      const existing = byDay.get(form.day);
      // day_of_week is unique per user, so an existing day is updated, not re-created.
      const saved = existing
        ? await api.updateScheduleEntry(existing.id, body)
        : await api.createScheduleEntry(body);
      const next = normalizeScheduleEntry(saved);
      setEntries((prev) => [...prev.filter((x) => x.day !== next.day), next]);
      setModalOpen(false);
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (entry) => {
    const snapshot = entries;
    setConfirmDelete(false);
    setEntries((prev) => prev.filter((e) => e.id !== entry.id));
    try {
      await api.deleteScheduleEntry(entry.id);
    } catch (err) {
      setEntries(snapshot);
      setError(err.message);
    }
  };

  const selectedLabel = selectedDate.toLocaleDateString(undefined, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  const pickerItems = useMemo(() => {
    const q = pickerQuery.trim().toLowerCase();
    if (!q) return exercises;
    return exercises.filter(
      (x) =>
        ex.name(x).toLowerCase().includes(q) ||
        ex.muscleGroup(x).includes(q) ||
        ex.category(x).includes(q)
    );
  }, [exercises, pickerQuery]);

  return (
    <div>
      {/* ================= HEADER ================= */}
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <p className="text-[11px] font-bold tracking-[0.18em] uppercase text-[#7CFF5B]">Planner</p>
          <h1 className="mt-1.5 text-3xl lg:text-4xl font-bold tracking-tight">My Calendar</h1>
          <p className="mt-2 text-[#B8B8B8]">
            Set a plan for each weekday — it repeats every week.
          </p>
        </div>
        <button
          onClick={() => openEditor(selectedIso)}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#7CFF5B] text-[#070707] font-semibold hover:bg-[#91ff75] transition-all hover:scale-[1.02]"
        >
          {selectedEntry ? (
            <Pencil className="w-4 h-4" strokeWidth={2.5} />
          ) : (
            <Plus className="w-4 h-4" strokeWidth={2.5} />
          )}
          {selectedEntry ? `Edit ${dayLabel(selectedDay)}` : `Plan ${dayLabel(selectedDay)}`}
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

      {/* ================= WEEK STATS ================= */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {[
          { label: 'Training days / week', value: weekStats.days, icon: CalendarDays, color: '#5BE7FF' },
          { label: 'Exercises / week', value: weekStats.exercises, icon: Dumbbell, color: '#7CFF5B' },
          { label: 'Muscle groups', value: weekStats.muscles, icon: Activity, color: '#B75BFF' },
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
            {DAYS.map((d) => (
              <div
                key={d.value}
                className="text-center text-[11px] font-bold tracking-wider uppercase text-white/30 py-1"
              >
                {d.short}
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
                const plan = byDay.get(dayCodeOf(date));
                const items = plan?.exercises ?? [];
                const isToday = iso === todayIso;
                const isSelected = iso === selectedIso;

                return (
                  <button
                    key={iso}
                    onClick={() => {
                      setSelectedIso(iso);
                      setConfirmDelete(false);
                    }}
                    onDoubleClick={() => openEditor(iso)}
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
                      {items.slice(0, 2).map((x) => (
                        <div
                          key={ex.id(x)}
                          className="hidden sm:block truncate text-[10px] font-medium px-1.5 py-0.5 rounded bg-white/[0.07] text-white/60"
                        >
                          {ex.name(x)}
                        </div>
                      ))}
                      {items.length > 2 && (
                        <div className="hidden sm:block text-[10px] text-white/30 px-1.5">
                          +{items.length - 2} more
                        </div>
                      )}

                      <div className="flex sm:hidden gap-0.5 flex-wrap">
                        {items.slice(0, 3).map((x) => (
                          <span key={ex.id(x)} className="w-1.5 h-1.5 rounded-full bg-[#7CFF5B]" />
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
              {selectedEntry && (
                <span className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded bg-[#5BE7FF]/12 text-[#5BE7FF]">
                  <Repeat className="w-2.5 h-2.5" />
                  Every {dayLabel(selectedDay)}
                </span>
              )}
            </div>
            <div className="flex gap-1.5 shrink-0">
              <button
                onClick={() => openEditor(selectedIso)}
                aria-label={selectedEntry ? 'Edit this day' : 'Plan this day'}
                className="w-9 h-9 grid place-items-center rounded-xl bg-[#7CFF5B]/12 border border-[#7CFF5B]/25 text-[#7CFF5B] hover:bg-[#7CFF5B]/20 transition"
              >
                {selectedEntry ? (
                  <Pencil className="w-4 h-4" />
                ) : (
                  <Plus className="w-4 h-4" strokeWidth={2.5} />
                )}
              </button>
              {selectedEntry && (
                <button
                  onClick={() => setConfirmDelete(true)}
                  aria-label="Clear this day's plan"
                  className="w-9 h-9 grid place-items-center rounded-xl bg-white/[0.06] text-white/50 hover:text-[#FF5B5B] hover:bg-[#FF5B5B]/10 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {confirmDelete && selectedEntry && (
            <div className="mb-4 p-4 rounded-2xl bg-[#FF5B5B]/[0.06] border border-[#FF5B5B]/20">
              <p className="text-sm font-semibold">Clear every {dayLabel(selectedDay)}?</p>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="px-4 py-2 rounded-lg border border-white/10 text-xs font-medium text-white/70 hover:bg-white/[0.04] transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => remove(selectedEntry)}
                  className="px-4 py-2 rounded-lg bg-[#FF5B5B] text-white text-xs font-bold hover:bg-[#ff7070] transition"
                >
                  Clear
                </button>
              </div>
            </div>
          )}

          {!selectedEntry || selectedEntry.exercises.length === 0 ? (
            <div className="py-10 text-center">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-white/[0.04] grid place-items-center mb-3">
                <CalendarDays className="w-5 h-5 text-white/25" />
              </div>
              <p className="text-sm text-white/40">Rest day — nothing planned.</p>
              <button
                onClick={() => openEditor(selectedIso)}
                className="mt-3 text-sm font-medium text-[#7CFF5B] hover:underline"
              >
                Plan {dayLabel(selectedDay)}
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {selectedEntry.muscleGroups.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {selectedEntry.muscleGroups.map((m) => (
                    <span
                      key={m}
                      className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded"
                      style={{ backgroundColor: `${muscleColor(m)}1A`, color: muscleColor(m) }}
                    >
                      {humanize(m)}
                    </span>
                  ))}
                </div>
              )}

              {selectedEntry.exercises.map((x) => (
                <motion.div
                  key={ex.id(x)}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] overflow-hidden"
                >
                  <span
                    className="absolute left-0 inset-y-0 w-[3px]"
                    style={{ backgroundColor: muscleColor(ex.muscleGroup(x)) }}
                  />
                  <p className="font-semibold truncate">{ex.name(x)}</p>
                  <p className="mt-1 text-xs text-white/40">
                    {[humanize(ex.category(x)), humanize(ex.muscleGroup(x))]
                      .filter(Boolean)
                      .join(' · ')}
                  </p>
                </motion.div>
              ))}

              {selectedEntry.notes && (
                <p className="text-xs text-white/40 pt-1">{selectedEntry.notes}</p>
              )}
            </div>
          )}
        </aside>
      </div>

      {/* ================= EDIT MODAL ================= */}
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
              onSubmit={handleSave}
              className="relative w-full max-w-md rounded-3xl bg-[#0F0F0F] border border-white/10 p-6 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold">{dayLabel(form.day)} plan</h3>
                  <p className="mt-1 text-sm text-white/40">Repeats every {dayLabel(form.day)}.</p>
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
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm text-white/60">Exercises</label>
                    <span className="text-xs text-white/35">
                      {form.exerciseIds.length} selected
                    </span>
                  </div>

                  {exercises.length === 0 ? (
                    <p className="text-sm text-white/40 p-4 rounded-xl bg-white/[0.03]">
                      Your exercise library is empty. Add exercises on the Exercises page first.
                    </p>
                  ) : (
                    <>
                      <div className="relative mb-2">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                        <input
                          value={pickerQuery}
                          onChange={(e) => setPickerQuery(e.target.value)}
                          placeholder="Filter exercises…"
                          className={`${inputCls} pl-11 h-10`}
                        />
                      </div>
                      <div className="max-h-60 overflow-y-auto space-y-1 pr-1">
                        {pickerItems.map((x) => {
                          const id = ex.id(x);
                          const on = form.exerciseIds.includes(id);
                          return (
                            <button
                              key={id}
                              type="button"
                              onClick={() => toggleExercise(id)}
                              className={`w-full flex items-center gap-3 p-3 rounded-xl text-left border transition ${
                                on
                                  ? 'bg-[#7CFF5B]/10 border-[#7CFF5B]/40'
                                  : 'bg-white/[0.02] border-white/[0.06] hover:border-white/15'
                              }`}
                            >
                              <span
                                className={`w-5 h-5 shrink-0 rounded-md border grid place-items-center ${
                                  on ? 'bg-[#7CFF5B] border-[#7CFF5B]' : 'border-white/20'
                                }`}
                              >
                                {on && (
                                  <Check className="w-3.5 h-3.5 text-[#070707]" strokeWidth={3} />
                                )}
                              </span>
                              <span className="min-w-0 flex-1">
                                <span className="block text-sm font-medium truncate">
                                  {ex.name(x)}
                                </span>
                                <span className="block text-[11px] text-white/35">
                                  {[humanize(ex.category(x)), humanize(ex.muscleGroup(x))]
                                    .filter(Boolean)
                                    .join(' · ')}
                                </span>
                              </span>
                            </button>
                          );
                        })}
                        {pickerItems.length === 0 && (
                          <p className="text-xs text-white/35 p-3">No matches.</p>
                        )}
                      </div>
                    </>
                  )}
                </div>

                <div>
                  <label className="block text-sm text-white/60 mb-2">Notes (optional)</label>
                  <textarea
                    rows={2}
                    maxLength={255}
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    placeholder="e.g. Push day — focus on form"
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
                  disabled={saving || exercises.length === 0}
                  className="flex-1 h-12 rounded-xl bg-[#7CFF5B] text-[#070707] font-bold hover:bg-[#91ff75] transition disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {saving ? 'Saving…' : 'Save plan'}
                </button>
              </div>
            </motion.form>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
