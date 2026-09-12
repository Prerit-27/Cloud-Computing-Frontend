import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Flame,
  Dumbbell,
  TrendingUp,
  Clock,
  ArrowRight,
  CalendarDays,
  Play,
} from 'lucide-react';
import * as api from '../utils/api';
import { useAuth } from '../context/auth-context';
import { MOCK_USER, WORKOUT_TYPES, toISODate } from '../utils/mockData';
import BodyMap from '../components/MuscleGroup/BodyMap';

export default function Dashboard() {
  const { user } = useAuth();
  const base = user ?? MOCK_USER;
  const [stats, setStats] = useState(null);
  const [upcoming, setUpcoming] = useState([]);

  useEffect(() => {
    // TODO(django): GET /api/stats/summary/ and GET /api/workouts/
    api.getStats().then(setStats);
    api.getSessions().then((all) => {
      const today = toISODate(new Date());
      setUpcoming(all.filter((s) => s.date >= today).slice(0, 4));
    });
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div>
      <div className="mb-8">
        <p className="text-[11px] font-bold tracking-[0.18em] uppercase text-[#7CFF5B]">
          {greeting}
        </p>
        <h1 className="mt-1.5 text-3xl lg:text-4xl font-bold tracking-tight">
          Ready to train, {base.firstName}?
        </h1>
        {stats && (
          <p className="mt-2 text-[#B8B8B8]">
            You are {stats.thisWeek.target - stats.thisWeek.done} session
            {stats.thisWeek.target - stats.thisWeek.done === 1 ? '' : 's'} away from hitting this
            week's target.
          </p>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Current streak', value: stats ? `${stats.currentStreak} days` : '—', icon: Flame, color: '#FF5B8A' },
          { label: 'Total workouts', value: stats?.totalWorkouts ?? '—', icon: Dumbbell, color: '#7CFF5B' },
          { label: 'Volume lifted', value: stats ? `${(stats.totalVolumeKg / 1000).toFixed(0)}t` : '—', icon: TrendingUp, color: '#5BE7FF' },
          { label: 'Hours trained', value: stats?.hoursTrained ?? '—', icon: Clock, color: '#B75BFF' },
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

      <div className="grid lg:grid-cols-[minmax(0,1fr)_320px] gap-6">
        <div className="space-y-6">
          {/* Weekly progress ring-ish bar */}
          <section className="p-6 rounded-3xl bg-[#101010] border border-white/[0.06]">
            <div className="flex items-end justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold">Weekly Volume</h2>
                <p className="text-sm text-white/40 mt-0.5">Total kilograms moved per day</p>
              </div>
              {stats && (
                <span className="px-3 py-1.5 rounded-lg bg-[#7CFF5B]/12 text-[#7CFF5B] text-xs font-bold">
                  {stats.thisWeek.done}/{stats.thisWeek.target} done
                </span>
              )}
            </div>

            <div className="flex items-end gap-2 sm:gap-3 h-44">
              {(stats?.weeklyVolume ?? []).map((d) => {
                const max = Math.max(...stats.weeklyVolume.map((x) => x.volume), 1);
                return (
                  <div key={d.day} className="flex-1 h-full flex flex-col items-center justify-end gap-2">
                    <span className="text-[10px] text-white/35 font-medium">
                      {d.volume ? `${(d.volume / 1000).toFixed(1)}t` : '—'}
                    </span>
                    <div className="w-full flex-1 flex items-end">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${Math.max((d.volume / max) * 100, 3)}%` }}
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
          </section>

          {/* Upcoming */}
          <section className="p-6 rounded-3xl bg-[#101010] border border-white/[0.06]">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold">Coming Up</h2>
              <Link
                to="/app/calendar"
                className="flex items-center gap-1.5 text-sm font-medium text-[#7CFF5B] hover:gap-2.5 transition-all"
              >
                Full calendar
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {upcoming.length === 0 ? (
              <div className="py-8 text-center">
                <CalendarDays className="w-6 h-6 mx-auto text-white/20 mb-2" />
                <p className="text-sm text-white/40">Nothing scheduled yet.</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {upcoming.map((s) => {
                  const t = WORKOUT_TYPES[s.type];
                  const d = new Date(`${s.date}T00:00:00`);
                  return (
                    <div
                      key={s.id}
                      className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-white/15 transition"
                    >
                      <div className="w-12 shrink-0 text-center">
                        <p className="text-[10px] uppercase tracking-wider text-white/35">
                          {d.toLocaleDateString(undefined, { weekday: 'short' })}
                        </p>
                        <p className="text-lg font-bold leading-tight">{d.getDate()}</p>
                      </div>
                      <div className="w-px self-stretch bg-white/[0.08]" />
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold truncate">{s.title}</p>
                        <p className="text-xs text-white/35 mt-0.5">
                          {s.time} · {s.duration} min · {s.exercises} exercises
                        </p>
                      </div>
                      <span
                        className="hidden sm:inline-block px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded"
                        style={{ backgroundColor: `${t.color}1A`, color: t.color }}
                      >
                        {t.label}
                      </span>
                      <button
                        aria-label="Start workout"
                        className="w-9 h-9 shrink-0 grid place-items-center rounded-xl bg-[#7CFF5B]/12 text-[#7CFF5B] hover:bg-[#7CFF5B] hover:text-[#070707] transition"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>

        <div className="space-y-6">
          <section className="p-6 rounded-3xl bg-[#101010] border border-white/[0.06]">
            <h2 className="text-lg font-bold mb-1">Muscle Coverage</h2>
            <p className="text-sm text-white/40 mb-4">Trained in the last 7 days</p>
            <div className="h-72">
              <BodyMap view="front" selected="chest" active="quads" showLabels={false} />
            </div>
            <Link
              to="/#muscles"
              className="mt-4 flex items-center justify-center gap-2 w-full h-11 rounded-xl bg-white/[0.04] border border-white/10 text-sm font-medium hover:bg-white/[0.08] transition"
            >
              Open muscle guide
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </section>

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
      </div>
    </div>
  );
}
