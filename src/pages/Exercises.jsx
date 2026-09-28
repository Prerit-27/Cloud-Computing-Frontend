import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  Loader2,
  Dumbbell,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import * as api from '../utils/api';
import {
  exerciseFields as ex,
  toApiExercise,
  EXERCISE_CATEGORIES,
  MUSCLE_GROUPS,
  categoryColor,
  muscleColor,
  humanize,
} from '../utils/adapters';

const EMPTY_FORM = {
  name: '',
  description: '',
  category: 'strength',
  muscleGroup: '',
};

/** Chip picker for a fixed set of choices. */
function ChoiceChips({ options, value, onChange, colorOf, allowNone = false }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((c) => {
        const on = value === c;
        return (
          <button
            key={c}
            type="button"
            onClick={() => onChange(on && allowNone ? '' : c)}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold border transition"
            style={{
              borderColor: on ? colorOf(c) : 'rgba(255,255,255,0.10)',
              backgroundColor: on ? `${colorOf(c)}1A` : 'transparent',
              color: on ? colorOf(c) : 'rgba(255,255,255,0.55)',
            }}
          >
            {humanize(c)}
          </button>
        );
      })}
    </div>
  );
}

const inputCls =
  'w-full h-12 px-4 rounded-xl bg-[#151515] border border-white/10 text-white outline-none transition focus:border-[#7CFF5B] focus:ring-1 focus:ring-[#7CFF5B] placeholder:text-white/25';

export default function Exercises() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [query, setQuery] = useState('');
  const [muscle, setMuscle] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null); // null = create mode
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [confirmId, setConfirmId] = useState(null);

  // No state is set before the first await, so this is safe to call from an
  // effect without triggering a cascading render.
  const fetchItems = useCallback(async () => {
    try {
      setItems(await api.listExercises());
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const load = useCallback(() => {
    setLoading(true);
    fetchItems();
  }, [fetchItems]);

  useEffect(() => {
    // Fetch on mount: no state is set until after the await, so there is no
    // cascading render — the rule cannot see past the await boundary.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchItems();
  }, [fetchItems]);

  useEffect(() => {
    if (!modalOpen) return undefined;
    const onKey = (e) => e.key === 'Escape' && setModalOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [modalOpen]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((i) => {
      if (muscle && ex.muscleGroup(i) !== muscle) return false;
      if (!q) return true;
      return (
        ex.name(i).toLowerCase().includes(q) ||
        ex.description(i).toLowerCase().includes(q) ||
        ex.category(i).includes(q)
      );
    });
  }, [items, query, muscle]);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setFormError('');
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({
      name: ex.name(item),
      description: ex.description(item),
      category: ex.category(item) || 'strength',
      muscleGroup: ex.muscleGroup(item),
    });
    setFormError('');
    setModalOpen(true);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setFormError('Name is required.');
      return;
    }
    setSaving(true);
    setFormError('');
    try {
      const body = toApiExercise(form);
      if (editing) {
        const updated = await api.updateExercise(ex.id(editing), body);
        setItems((prev) => prev.map((i) => (ex.id(i) === ex.id(editing) ? updated : i)));
      } else {
        const created = await api.createExercise(body);
        setItems((prev) => [created, ...prev]);
      }
      setModalOpen(false);
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    const snapshot = items;
    setItems((prev) => prev.filter((i) => ex.id(i) !== id));
    setConfirmId(null);
    try {
      await api.deleteExercise(id);
    } catch (err) {
      setItems(snapshot); // roll back on failure
      setError(err.message);
    }
  };

  return (
    <div>
      {/* ================= HEADER ================= */}
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <p className="text-[11px] font-bold tracking-[0.18em] uppercase text-[#7CFF5B]">Library</p>
          <h1 className="mt-1.5 text-3xl lg:text-4xl font-bold tracking-tight">Exercises</h1>
          <p className="mt-2 text-[#B8B8B8]">
            Build the catalogue your workouts are made from.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#7CFF5B] text-[#070707] font-semibold hover:bg-[#91ff75] transition-all hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4" strokeWidth={2.5} />
          New Exercise
        </button>
      </div>

      {/* ================= FILTERS ================= */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search exercises…"
            className={`${inputCls} pl-11`}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setMuscle('')}
            className={`px-4 h-12 shrink-0 rounded-xl text-sm font-semibold border transition ${
              muscle === ''
                ? 'bg-[#7CFF5B] text-[#070707] border-[#7CFF5B]'
                : 'border-white/10 text-white/55 hover:border-white/25'
            }`}
          >
            All
          </button>
          {MUSCLE_GROUPS.map((c) => {
            const on = muscle === c;
            return (
              <button
                key={c}
                onClick={() => setMuscle(on ? '' : c)}
                className="px-4 h-12 shrink-0 rounded-xl text-sm font-semibold border transition"
                style={{
                  borderColor: on ? muscleColor(c) : 'rgba(255,255,255,0.10)',
                  backgroundColor: on ? `${muscleColor(c)}1A` : 'transparent',
                  color: on ? muscleColor(c) : 'rgba(255,255,255,0.55)',
                }}
              >
                {humanize(c)}
              </button>
            );
          })}
        </div>
      </div>

      {/* ================= ERROR ================= */}
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

      {/* ================= LIST ================= */}
      {loading ? (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-44 rounded-3xl bg-[#101010] border border-white/[0.06] animate-pulse"
            />
          ))}
        </div>
      ) : visible.length === 0 ? (
        <div className="py-20 text-center rounded-3xl bg-[#101010] border border-white/[0.06]">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-white/[0.04] grid place-items-center mb-4">
            <Dumbbell className="w-6 h-6 text-white/25" />
          </div>
          <p className="font-semibold">
            {items.length === 0 ? 'No exercises yet' : 'Nothing matches that filter'}
          </p>
          <p className="mt-1 text-sm text-white/40">
            {items.length === 0
              ? 'Add your first exercise to get started.'
              : 'Try a different search or muscle group.'}
          </p>
          {items.length === 0 && (
            <button
              onClick={openCreate}
              className="mt-5 px-5 py-2.5 rounded-xl bg-[#7CFF5B] text-[#070707] text-sm font-bold hover:bg-[#91ff75] transition"
            >
              New Exercise
            </button>
          )}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {visible.map((item) => {
              const id = ex.id(item);
              const cat = ex.category(item);
              const mg = ex.muscleGroup(item);
              const color = mg ? muscleColor(mg) : categoryColor(cat);

              return (
                <motion.article
                  key={id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  className="group relative p-5 rounded-3xl bg-[#101010] border border-white/[0.06] hover:border-white/15 transition overflow-hidden"
                >
                  <span
                    className="absolute inset-x-0 top-0 h-[3px]"
                    style={{ background: `linear-gradient(90deg, ${color}, transparent)` }}
                  />

                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-bold leading-snug pr-2">{ex.name(item)}</h3>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition shrink-0">
                      <button
                        onClick={() => openEdit(item)}
                        aria-label={`Edit ${ex.name(item)}`}
                        className="w-8 h-8 grid place-items-center rounded-lg bg-white/[0.06] text-white/50 hover:text-white transition"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setConfirmId(id)}
                        aria-label={`Delete ${ex.name(item)}`}
                        className="w-8 h-8 grid place-items-center rounded-lg bg-white/[0.06] text-white/50 hover:text-[#FF5B5B] hover:bg-[#FF5B5B]/10 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    {cat && (
                      <span
                        className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded"
                        style={{ backgroundColor: `${categoryColor(cat)}1A`, color: categoryColor(cat) }}
                      >
                        {humanize(cat)}
                      </span>
                    )}
                    {mg && (
                      <span
                        className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded"
                        style={{ backgroundColor: `${muscleColor(mg)}1A`, color: muscleColor(mg) }}
                      >
                        {humanize(mg)}
                      </span>
                    )}
                  </div>

                  {ex.description(item) && (
                    <p className="mt-3 text-sm text-[#B8B8B8] line-clamp-3 leading-relaxed">
                      {ex.description(item)}
                    </p>
                  )}

                  {/* Inline delete confirmation */}
                  <AnimatePresence>
                    {confirmId === id && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-[#0B0B0B]/95 backdrop-blur-sm grid place-items-center p-5 text-center"
                      >
                        <div>
                          <p className="text-sm font-semibold">Delete this exercise?</p>
                          <p className="mt-1 text-xs text-white/40">
                            It is also removed from any weekly plan. This cannot be undone.
                          </p>
                          <div className="flex gap-2 mt-4">
                            <button
                              onClick={() => setConfirmId(null)}
                              className="px-4 py-2 rounded-lg border border-white/10 text-xs font-medium text-white/70 hover:bg-white/[0.04] transition"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => remove(id)}
                              className="px-4 py-2 rounded-lg bg-[#FF5B5B] text-white text-xs font-bold hover:bg-[#ff7070] transition"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* ================= CREATE / EDIT MODAL ================= */}
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
              onSubmit={submit}
              className="relative w-full max-w-lg rounded-3xl bg-[#0F0F0F] border border-white/10 p-6 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-start justify-between mb-6">
                <h3 className="text-xl font-bold">
                  {editing ? 'Edit Exercise' : 'New Exercise'}
                </h3>
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
                  <label className="block text-sm text-white/60 mb-2">Name</label>
                  <input
                    autoFocus
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Barbell Bench Press"
                    className={inputCls}
                  />
                </div>

                <div>
                  <label className="block text-sm text-white/60 mb-2">Category</label>
                  <ChoiceChips
                    options={EXERCISE_CATEGORIES}
                    value={form.category}
                    onChange={(v) => setForm({ ...form, category: v })}
                    colorOf={categoryColor}
                  />
                </div>

                <div>
                  <label className="block text-sm text-white/60 mb-2">
                    Muscle group (optional)
                  </label>
                  <ChoiceChips
                    options={MUSCLE_GROUPS}
                    value={form.muscleGroup}
                    onChange={(v) => setForm({ ...form, muscleGroup: v })}
                    colorOf={muscleColor}
                    allowNone
                  />
                </div>

                <div>
                  <label className="block text-sm text-white/60 mb-2">Description</label>
                  <textarea
                    rows={3}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="How the movement is performed, cues, setup…"
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
                  {saving ? 'Saving…' : editing ? 'Save changes' : 'Create'}
                </button>
              </div>
            </motion.form>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
