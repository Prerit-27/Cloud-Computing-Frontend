import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Camera,
  MapPin,
  CalendarDays,
  Pencil,
  Check,
  X,
  Flame,
  Trophy,
  Zap,
  Medal,
  Sunrise,
  Dumbbell,
  TrendingUp,
  Clock,
  Target,
  Loader2,
} from 'lucide-react';
import * as api from '../utils/api';
import { useAuth } from '../context/auth-context';
import { MOCK_USER } from '../utils/mockData';
import BodyMap from '../components/MuscleGroup/BodyMap';
import { initialsOf } from '../utils/format';

const TABS = ['Overview', 'Personal Info', 'Training', 'Account'];

const GOAL_LABELS = {
  build_muscle: 'Build Muscle',
  lose_fat: 'Lose Fat',
  strength: 'Get Stronger',
  endurance: 'Endurance',
};

const ACHIEVEMENT_ICONS = {
  flame: Flame,
  trophy: Trophy,
  zap: Zap,
  medal: Medal,
  sunrise: Sunrise,
  calendar: CalendarDays,
};

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-sm text-white/50 mb-2">{label}</label>
      {children}
    </div>
  );
}

const inputCls =
  'w-full h-12 px-4 rounded-xl bg-[#151515] border border-white/10 text-white outline-none transition focus:border-[#7CFF5B] focus:ring-1 focus:ring-[#7CFF5B] disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-white/25';

export default function Profile() {
  const { user, patchUser } = useAuth();
  const base = user ?? MOCK_USER;

  const [tab, setTab] = useState('Overview');
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);
  const [draft, setDraft] = useState(base);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    // TODO(django): GET /api/stats/summary/
    api.getStats().then(setStats);
  }, []);

  const set = (key) => (e) => setDraft((d) => ({ ...d, [key]: e.target.value }));

  const save = async () => {
    setSaving(true);
    try {
      // TODO(django): PATCH /api/profile/
      if (user) await patchUser(draft);
      setEditing(false);
      setSavedFlash(true);
      setTimeout(() => setSavedFlash(false), 2200);
    } finally {
      setSaving(false);
    }
  };

  const cancel = () => {
    setDraft(base);
    setEditing(false);
  };

  const bmi = draft.heightCm ? (draft.weightKg / (draft.heightCm / 100) ** 2).toFixed(1) : '—';
  const weightProgress = Math.min(
    100,
    Math.round((draft.weightKg / (draft.goalWeightKg || draft.weightKg)) * 100)
  );

  return (
    <div>
      {/* ================= COVER + IDENTITY ================= */}
      <div className="relative rounded-3xl overflow-hidden border border-white/[0.06] mb-6">
        <div className="h-36 sm:h-44 bg-gradient-to-br from-[#7CFF5B]/25 via-[#5BE7FF]/12 to-transparent relative">
          <div className="absolute inset-0 bg-[#070707]/35" />
          <div className="absolute -top-20 -right-10 w-80 h-80 rounded-full bg-[#7CFF5B]/20 blur-[100px]" />
        </div>

        <div className="bg-[#101010] px-6 sm:px-8 pb-7">
          <div className="flex flex-wrap items-end gap-5 -mt-14">
            <div className="relative">
              <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-[#7CFF5B] to-[#5BE7FF] grid place-items-center text-[#070707] text-3xl font-black ring-4 ring-[#101010]">
                {base.avatar ? (
                  <img
                    src={base.avatar}
                    alt=""
                    className="w-full h-full object-cover rounded-3xl"
                  />
                ) : (
                  initialsOf(base)
                )}
              </div>
              <button
                aria-label="Change photo"
                className="absolute -bottom-1 -right-1 w-9 h-9 grid place-items-center rounded-xl bg-[#181818] border border-white/10 text-white/60 hover:text-white transition"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 min-w-[200px] pt-2">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                {base.firstName} {base.lastName}
              </h1>
              <p className="text-white/40 text-sm mt-0.5">@{base.username}</p>
              <div className="flex flex-wrap gap-4 mt-3 text-sm text-white/45">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  {base.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="w-3.5 h-3.5" />
                  Joined{' '}
                  {new Date(base.joinedAt).toLocaleDateString(undefined, {
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
                <span className="flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5" />
                  {GOAL_LABELS[base.primaryGoal]}
                </span>
              </div>
            </div>

            <div className="pt-2">
              {editing ? (
                <div className="flex gap-2">
                  <button
                    onClick={cancel}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 text-white/70 text-sm font-medium hover:bg-white/[0.04] transition"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                  <button
                    onClick={save}
                    disabled={saving}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#7CFF5B] text-[#070707] text-sm font-bold hover:bg-[#91ff75] transition disabled:opacity-60"
                  >
                    {saving ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Check className="w-4 h-4" strokeWidth={3} />
                    )}
                    Save
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/[0.06] border border-white/10 text-sm font-semibold hover:bg-white/[0.10] transition"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          <p className="mt-5 text-[#B8B8B8] max-w-2xl leading-relaxed">{base.bio}</p>

          {savedFlash && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#7CFF5B]/12 border border-[#7CFF5B]/25 text-[#7CFF5B] text-xs font-semibold"
            >
              <Check className="w-3.5 h-3.5" strokeWidth={3} />
              Profile updated
            </motion.p>
          )}
        </div>
      </div>

      {/* ================= STAT STRIP ================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[
          {
            label: 'Workouts',
            value: stats?.totalWorkouts ?? '—',
            icon: Dumbbell,
            color: '#7CFF5B',
          },
          {
            label: 'Day Streak',
            value: stats?.currentStreak ?? '—',
            icon: Flame,
            color: '#FF5B8A',
          },
          {
            label: 'Volume Lifted',
            value: stats ? `${(stats.totalVolumeKg / 1000).toFixed(0)}t` : '—',
            icon: TrendingUp,
            color: '#5BE7FF',
          },
          {
            label: 'Hours Trained',
            value: stats?.hoursTrained ?? '—',
            icon: Clock,
            color: '#B75BFF',
          },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="p-5 rounded-2xl bg-[#101010] border border-white/[0.06]">
            <div
              className="w-9 h-9 rounded-xl grid place-items-center mb-3"
              style={{ backgroundColor: `${color}18` }}
            >
              <Icon className="w-4 h-4" style={{ color }} />
            </div>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-xs text-white/40 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* ================= TABS ================= */}
      <div className="flex gap-1 p-1 rounded-2xl bg-[#101010] border border-white/[0.06] mb-6 overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 sm:px-5 py-2.5 text-sm font-semibold rounded-xl whitespace-nowrap transition-all ${
              tab === t ? 'bg-[#7CFF5B] text-[#070707]' : 'text-[#B8B8B8] hover:text-white'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* ================= TAB CONTENT ================= */}
      {tab === 'Overview' && (
        <div className="grid lg:grid-cols-[minmax(0,1fr)_320px] gap-6">
          <div className="space-y-6">
            {/* Weekly volume */}
            <section className="p-6 rounded-3xl bg-[#101010] border border-white/[0.06]">
              <div className="flex items-end justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold">This Week</h2>
                  <p className="text-sm text-white/40 mt-0.5">Training volume by day</p>
                </div>
                {stats && (
                  <span className="px-3 py-1.5 rounded-lg bg-[#7CFF5B]/12 text-[#7CFF5B] text-xs font-bold">
                    {stats.thisWeek.done}/{stats.thisWeek.target} sessions
                  </span>
                )}
              </div>

              {stats ? (
                <div className="flex items-end gap-2 sm:gap-3 h-40">
                  {stats.weeklyVolume.map((d) => {
                    const max = Math.max(...stats.weeklyVolume.map((x) => x.volume), 1);
                    const pct = (d.volume / max) * 100;
                    return (
                      <div key={d.day} className="flex-1 h-full flex flex-col items-center justify-end gap-2">
                        <span className="text-[10px] text-white/35 font-medium">
                          {d.volume ? `${(d.volume / 1000).toFixed(1)}t` : '—'}
                        </span>
                        <div className="w-full flex-1 flex items-end">
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${Math.max(pct, 3)}%` }}
                            transition={{ duration: 0.6, ease: 'easeOut' }}
                            className="w-full rounded-t-lg"
                            style={{
                              background: d.volume
                                ? 'linear-gradient(180deg, #7CFF5B, #7CFF5B60)'
                                : 'rgba(255,255,255,0.05)',
                            }}
                          />
                        </div>
                        <span className="text-xs text-white/45">{d.day}</span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="h-40 grid place-items-center text-white/25">
                  <Loader2 className="w-5 h-5 animate-spin" />
                </div>
              )}
            </section>

            {/* Personal bests */}
            <section className="p-6 rounded-3xl bg-[#101010] border border-white/[0.06]">
              <h2 className="text-lg font-bold mb-5">Personal Bests</h2>
              <div className="space-y-2.5">
                {(stats?.personalBests ?? []).map((pb) => (
                  <div
                    key={pb.lift}
                    className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#7CFF5B]/12 grid place-items-center">
                        <Dumbbell className="w-4 h-4 text-[#7CFF5B]" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{pb.lift}</p>
                        <p className="text-xs text-white/35">
                          {new Date(pb.date).toLocaleDateString(undefined, {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-[#7CFF5B]">{pb.weightKg} kg</p>
                      <p className="text-xs text-white/35">× {pb.reps}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Activity */}
            <section className="p-6 rounded-3xl bg-[#101010] border border-white/[0.06]">
              <h2 className="text-lg font-bold mb-5">Recent Activity</h2>
              <div className="space-y-4">
                {(stats?.recentActivity ?? []).map((a, i, arr) => (
                  <div key={a.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <span className="w-2 h-2 rounded-full bg-[#7CFF5B] mt-1.5" />
                      {i < arr.length - 1 && <span className="flex-1 w-px bg-white/[0.08] my-1" />}
                    </div>
                    <div className="pb-1">
                      <p className="text-sm font-medium">{a.text}</p>
                      <p className="text-xs text-white/35 mt-0.5">
                        {a.detail} · {a.when}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            <section className="p-6 rounded-3xl bg-[#101010] border border-white/[0.06]">
              <h2 className="text-lg font-bold mb-1">Body Focus</h2>
              <p className="text-sm text-white/40 mb-4">Muscles trained this week</p>
              <div className="h-64">
                <BodyMap
                  view="front"
                  selected="chest"
                  active="quads"
                  showLabels={false}
                  onHover={() => {}}
                  onSelect={() => {}}
                />
              </div>
            </section>

            <section className="p-6 rounded-3xl bg-[#101010] border border-white/[0.06]">
              <h2 className="text-lg font-bold mb-5">Achievements</h2>
              <div className="grid grid-cols-3 gap-2.5">
                {(stats?.achievements ?? []).map((a) => {
                  const Icon = ACHIEVEMENT_ICONS[a.icon] ?? Trophy;
                  return (
                    <div
                      key={a.id}
                      title={a.label}
                      className={`aspect-square rounded-2xl grid place-items-center p-2 border transition ${
                        a.earned
                          ? 'bg-[#7CFF5B]/10 border-[#7CFF5B]/25'
                          : 'bg-white/[0.02] border-white/[0.06] opacity-40'
                      }`}
                    >
                      <Icon
                        className="w-5 h-5"
                        style={{ color: a.earned ? '#7CFF5B' : '#8A8A8A' }}
                      />
                      <span className="mt-1.5 text-[9px] text-center leading-tight text-white/50">
                        {a.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        </div>
      )}

      {tab === 'Personal Info' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#101010] border border-white/[0.06]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold">Personal Information</h2>
              <p className="text-sm text-white/40 mt-0.5">
                {editing ? 'Make your changes and hit save.' : 'Click Edit Profile to change these.'}
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="First name">
              <input
                value={draft.firstName ?? ''}
                onChange={set('firstName')}
                disabled={!editing}
                className={inputCls}
              />
            </Field>
            <Field label="Last name">
              <input
                value={draft.lastName ?? ''}
                onChange={set('lastName')}
                disabled={!editing}
                className={inputCls}
              />
            </Field>
            <Field label="Username">
              <input
                value={draft.username ?? ''}
                onChange={set('username')}
                disabled={!editing}
                className={inputCls}
              />
            </Field>
            <Field label="Email address">
              <input
                type="email"
                value={draft.email ?? ''}
                onChange={set('email')}
                disabled={!editing}
                className={inputCls}
              />
            </Field>
            <Field label="Date of birth">
              <input
                type="date"
                value={draft.dateOfBirth ?? ''}
                onChange={set('dateOfBirth')}
                disabled={!editing}
                className={`${inputCls} [color-scheme:dark]`}
              />
            </Field>
            <Field label="Location">
              <input
                value={draft.location ?? ''}
                onChange={set('location')}
                disabled={!editing}
                className={inputCls}
              />
            </Field>
            <Field label="Height (cm)">
              <input
                type="number"
                value={draft.heightCm ?? ''}
                onChange={(e) => setDraft({ ...draft, heightCm: Number(e.target.value) })}
                disabled={!editing}
                className={inputCls}
              />
            </Field>
            <Field label="Weight (kg)">
              <input
                type="number"
                step="0.1"
                value={draft.weightKg ?? ''}
                onChange={(e) => setDraft({ ...draft, weightKg: Number(e.target.value) })}
                disabled={!editing}
                className={inputCls}
              />
            </Field>
          </div>

          <div className="mt-5">
            <Field label="Bio">
              <textarea
                rows={3}
                value={draft.bio ?? ''}
                onChange={set('bio')}
                disabled={!editing}
                className={`${inputCls} h-auto py-3 resize-none`}
              />
            </Field>
          </div>

          <div className="grid sm:grid-cols-3 gap-3 mt-7 pt-7 border-t border-white/[0.06]">
            <div className="p-4 rounded-2xl bg-white/[0.03]">
              <p className="text-xs text-white/40">BMI</p>
              <p className="text-2xl font-bold mt-1">{bmi}</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.03]">
              <p className="text-xs text-white/40">Goal weight</p>
              <p className="text-2xl font-bold mt-1">{draft.goalWeightKg} kg</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.03]">
              <p className="text-xs text-white/40 mb-2">Progress to goal</p>
              <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#7CFF5B] to-[#5BE7FF]"
                  style={{ width: `${weightProgress}%` }}
                />
              </div>
              <p className="text-xs text-white/40 mt-2">{weightProgress}%</p>
            </div>
          </div>
        </div>
      )}

      {tab === 'Training' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#101010] border border-white/[0.06]">
          <h2 className="text-lg font-bold mb-6">Training Preferences</h2>

          <div className="space-y-7">
            <div>
              <p className="text-sm text-white/50 mb-3">Primary goal</p>
              <div className="grid sm:grid-cols-4 gap-2">
                {Object.entries(GOAL_LABELS).map(([value, label]) => (
                  <button
                    key={value}
                    disabled={!editing}
                    onClick={() => setDraft({ ...draft, primaryGoal: value })}
                    className={`px-4 py-3 rounded-xl text-sm font-medium border transition disabled:cursor-not-allowed ${
                      draft.primaryGoal === value
                        ? 'bg-[#7CFF5B]/12 border-[#7CFF5B] text-[#7CFF5B]'
                        : 'bg-[#151515] border-white/10 text-white/60 enabled:hover:border-white/25'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm text-white/50 mb-3">Experience level</p>
              <div className="grid sm:grid-cols-3 gap-2">
                {['beginner', 'intermediate', 'advanced'].map((lvl) => (
                  <button
                    key={lvl}
                    disabled={!editing}
                    onClick={() => setDraft({ ...draft, experience: lvl })}
                    className={`px-4 py-3 rounded-xl text-sm font-medium capitalize border transition disabled:cursor-not-allowed ${
                      draft.experience === lvl
                        ? 'bg-[#7CFF5B]/12 border-[#7CFF5B] text-[#7CFF5B]'
                        : 'bg-[#151515] border-white/10 text-white/60 enabled:hover:border-white/25'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-white/50">Weekly session target</p>
                <span className="text-sm font-bold text-[#7CFF5B]">
                  {draft.weeklyTarget} / week
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="7"
                value={draft.weeklyTarget ?? 3}
                disabled={!editing}
                onChange={(e) => setDraft({ ...draft, weeklyTarget: Number(e.target.value) })}
                className="w-full accent-[#7CFF5B] disabled:opacity-50"
              />
              <div className="flex justify-between mt-1 text-[11px] text-white/25">
                {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                  <span key={n}>{n}</span>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm text-white/50 mb-3">Available equipment</p>
              <div className="flex flex-wrap gap-2">
                {['Barbell', 'Dumbbell', 'Cable', 'Machine', 'Kettlebell', 'Bands', 'Bodyweight'].map(
                  (eq) => {
                    const on = (draft.equipment ?? []).includes(eq);
                    return (
                      <button
                        key={eq}
                        disabled={!editing}
                        onClick={() =>
                          setDraft({
                            ...draft,
                            equipment: on
                              ? draft.equipment.filter((x) => x !== eq)
                              : [...(draft.equipment ?? []), eq],
                          })
                        }
                        className={`px-4 py-2 rounded-full text-sm font-medium border transition disabled:cursor-not-allowed ${
                          on
                            ? 'bg-[#7CFF5B]/12 border-[#7CFF5B] text-[#7CFF5B]'
                            : 'bg-transparent border-white/10 text-white/50 enabled:hover:border-white/25'
                        }`}
                      >
                        {eq}
                      </button>
                    );
                  }
                )}
              </div>
            </div>

            <div>
              <p className="text-sm text-white/50 mb-3">Units</p>
              <div className="inline-flex p-1 rounded-xl bg-[#151515] border border-white/10">
                {['metric', 'imperial'].map((u) => (
                  <button
                    key={u}
                    disabled={!editing}
                    onClick={() => setDraft({ ...draft, units: u })}
                    className={`px-5 py-2 text-sm font-semibold rounded-lg capitalize transition disabled:cursor-not-allowed ${
                      draft.units === u ? 'bg-[#7CFF5B] text-[#070707]' : 'text-white/55'
                    }`}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'Account' && (
        <div className="space-y-6">
          <section className="p-6 sm:p-8 rounded-3xl bg-[#101010] border border-white/[0.06]">
            <h2 className="text-lg font-bold mb-6">Security</h2>
            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Current password">
                <input type="password" placeholder="••••••••" className={inputCls} />
              </Field>
              <Field label="New password">
                <input type="password" placeholder="••••••••" className={inputCls} />
              </Field>
            </div>
            {/* TODO(django): POST /api/auth/change-password/ */}
            <button className="mt-5 px-5 py-3 rounded-xl bg-white/[0.06] border border-white/10 text-sm font-semibold hover:bg-white/[0.10] transition">
              Update password
            </button>
          </section>

          <section className="p-6 sm:p-8 rounded-3xl bg-[#101010] border border-white/[0.06]">
            <h2 className="text-lg font-bold mb-6">Notifications</h2>
            <div className="space-y-4">
              {[
                ['Workout reminders', 'A nudge 30 minutes before a scheduled session.'],
                ['Streak alerts', 'Tell me when my streak is about to break.'],
                ['Weekly summary', 'A recap of volume and PRs every Sunday.'],
              ].map(([title, desc], i) => (
                <label
                  key={title}
                  className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-white/[0.03] cursor-pointer"
                >
                  <div>
                    <p className="text-sm font-medium">{title}</p>
                    <p className="text-xs text-white/35 mt-0.5">{desc}</p>
                  </div>
                  <input type="checkbox" defaultChecked={i !== 2} className="sr-only peer" />
                  <span className="relative w-11 h-6 shrink-0 rounded-full bg-white/10 peer-checked:bg-[#7CFF5B] transition-colors after:absolute after:top-0.5 after:left-0.5 after:w-5 after:h-5 after:rounded-full after:bg-white after:transition-transform peer-checked:after:translate-x-5" />
                </label>
              ))}
            </div>
          </section>

          <section className="p-6 sm:p-8 rounded-3xl bg-[#FF5B5B]/[0.04] border border-[#FF5B5B]/20">
            <h2 className="text-lg font-bold text-[#FF8A8A] mb-2">Danger Zone</h2>
            <p className="text-sm text-white/45 mb-5">
              Deleting your account removes every workout, plan and personal record. This cannot be
              undone.
            </p>
            {/* TODO(django): DELETE /api/profile/ */}
            <button className="px-5 py-3 rounded-xl border border-[#FF5B5B]/40 text-[#FF8A8A] text-sm font-semibold hover:bg-[#FF5B5B]/10 transition">
              Delete account
            </button>
          </section>
        </div>
      )}
    </div>
  );
}
