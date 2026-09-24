import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Dumbbell,
  ArrowRight,
  CalendarDays,
  Activity,
  ListChecks,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import * as api from '../utils/api';
import { useAuth } from '../context/auth-context';
import {
  normalizeScheduleEntry,
  deriveStats,
  dayCodeOf,
  userFields,
  exerciseFields as ex,
  categoryColor,
  muscleColor,
  humanize,
} from '../utils/adapters';
import BodyMap from '../components/MuscleGroup/BodyMap';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      const raw = await api.listSchedule();
      setStats(deriveStats(raw.map(normalizeScheduleEntry)));
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const load = useCallback(() => {
    setLoading(true);
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    // Fetch on mount: no state is set until after the await, so there is no
    // cascading render — the rule cannot see past the await boundary.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchStats();
    api.listExercises().then(setExercises).catch(() => {});
  }, [fetchStats]);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const firstName = userFields.firstName(user) || userFields.username(user) || 'there';

  const todayCode = dayCodeOf(new Date());
  const todayCount = stats?.today?.exercises.length ?? 0;

  return (
    <div>
      <div className="mb-8">
        <p className="text-[11px] font-bold tracking-[0.18em] uppercase text-[#7CFF5B]">
          {greeting}
        </p>
        <h1 className="mt-1.5 text-3xl lg:text-4xl font-bold tracking-tight">
          Ready to train, {firstName}?
        </h1>
        {stats && (
          <p className="mt-2 text-[#B8B8B8]">
            {stats.trainingDays === 0
              ? 'No weekly plan yet — set one up in the calendar to get going.'
              : todayCount === 0
                ? 'Rest day today. Recover well.'
                : `${todayCount} exercise${todayCount === 1 ? '' : 's'} on today's plan.`}
          </p>
        )}
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

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[
          {
            label: 'Training days / week',
            value: stats?.trainingDays ?? '—',
            icon: CalendarDays,
            color: '#FF5B8A',
          },
          {
            label: 'Exercises / week',
            value: stats?.exercisesScheduled ?? '—',
            icon: ListChecks,
            color: '#7CFF5B',
          },
          {
            label: 'Muscle groups trained',
            value: stats?.muscleGroups.length ?? '—',
            icon: Activity,
            color: '#5BE7FF',
          },
          {
            label: 'Exercises in library',
            value: exercises.length,
            icon: Dumbbell,
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

      <div className="grid lg:grid-cols-[minmax(0,1fr)_320px] gap-6">
        <div className="space-y-6">
          {/* This week */}
          <section className="p-6 rounded-3xl bg-[#101010] border border-white/[0.06]">
            <div className="flex items-end justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold">Weekly Plan</h2>
                <p className="text-sm text-white/40 mt-0.5">Exercises planned per day</p>
              </div>
              {stats && (
                <span className="px-3 py-1.5 rounded-lg bg-[#7CFF5B]/12 text-[#7CFF5B] text-xs font-bold">
                  {stats.trainingDays}/7 days
                </span>
              )}
            </div>

            {loading ? (
              <div className="h-44 rounded-2xl bg-white/[0.02] animate-pulse" />
            ) : (
              <div className="flex items-end gap-2 sm:gap-3 h-44">
                {(stats?.week ?? []).map((d) => {
                  const max = Math.max(...stats.week.map((x) => x.count), 1);
                  const isToday = d.code === todayCode;
                  return (
                    <div
                      key={d.day}
                      className="flex-1 h-full flex flex-col items-center justify-end gap-2"
                    >
                      <span className="text-[10px] text-white/35 font-medium">
                        {d.count || '—'}
                      </span>
                      <div className="w-full flex-1 flex items-end">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${Math.max((d.count / max) * 100, 3)}%` }}
                          transition={{ duration: 0.6, ease: 'easeOut' }}
                          className="w-full rounded-t-lg"
                          style={{
                            background: d.count
                              ? 'linear-gradient(180deg, #7CFF5B, #7CFF5B60)'
                              : 'rgba(255,255,255,0.05)',
                          }}
                        />
                      </div>
                      <span
                        className={`text-xs ${isToday ? 'text-[#7CFF5B] font-bold' : 'text-white/45'}`}
                      >
                        {d.day}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
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

            {!stats || stats.upcoming.length === 0 ? (
              <div className="py-8 text-center">
                <CalendarDays className="w-6 h-6 mx-auto text-white/20 mb-2" />
                <p className="text-sm text-white/40">Nothing scheduled yet.</p>
                <Link
                  to="/app/calendar"
                  className="mt-2 inline-block text-sm font-medium text-[#7CFF5B] hover:underline"
                >
                  Plan a session
                </Link>
              </div>
            ) : (
              <div className="space-y-2.5">
                {stats.upcoming.slice(0, 4).map(({ date: d, entry }) => {
                  return (
                    <div
                      key={d.toDateString()}
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
                        <p className="font-semibold truncate">
                          {entry.exercises.map((x) => ex.name(x)).join(', ')}
                        </p>
                        <p className="text-xs text-white/35 mt-0.5 truncate">
                          {entry.muscleGroups.map(humanize).join(' · ') || entry.notes || '—'}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>

        <div className="space-y-6">
          <section className="p-6 rounded-3xl bg-[#101010] border border-white/[0.06]">
            <h2 className="text-lg font-bold mb-1">Muscle Guide</h2>
            <p className="text-sm text-white/40 mb-4">Explore the anatomy map</p>
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
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold">Your Exercises</h2>
              <Link
                to="/app/exercises"
                className="text-sm font-medium text-[#7CFF5B] hover:underline"
              >
                All
              </Link>
            </div>

            {exercises.length === 0 ? (
              <div className="py-6 text-center">
                <Dumbbell className="w-5 h-5 mx-auto text-white/20 mb-2" />
                <p className="text-sm text-white/40">No exercises yet.</p>
                <Link
                  to="/app/exercises"
                  className="mt-2 inline-block text-sm font-medium text-[#7CFF5B] hover:underline"
                >
                  Add one
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                {exercises.slice(0, 5).map((x) => {
                  const cat = ex.muscleGroup(x) || ex.category(x);
                  const color = ex.muscleGroup(x) ? muscleColor(cat) : categoryColor(cat);
                  return (
                    <div
                      key={ex.id(x)}
                      className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white/[0.03]"
                    >
                      <span className="text-sm font-medium truncate">{ex.name(x)}</span>
                      {cat && (
                        <span
                          className="shrink-0 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded"
                          style={{ backgroundColor: `${color}1A`, color }}
                        >
                          {humanize(cat)}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
