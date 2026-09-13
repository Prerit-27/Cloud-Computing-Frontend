import { useMemo, useState } from 'react';
import { ArrowRight, CalendarDays, ChevronRight, Clock3, Dumbbell, LoaderCircle, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../utils/api';
import { useResource } from '../hooks/useAppData';
import { formatDate, getExerciseName, getExercises, getScheduleDate, getScheduleMuscle, MUSCLE_GROUPS, normalizeMuscle, todayISO } from '../utils/data';

function PageIntro({ eyebrow, title, description, action }) {
  return <div className="page-intro"><div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7CFF5B]">{eyebrow}</p><h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>{description && <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#9B9B9B]">{description}</p>}</div>{action}</div>;
}

export function LoadingState({ label = 'Loading your data…' }) { return <div className="flex min-h-48 items-center justify-center gap-3 rounded-2xl border border-white/[0.06] bg-[#111] text-sm text-[#9B9B9B]"><LoaderCircle className="h-5 w-5 animate-spin text-[#7CFF5B]" />{label}</div>; }
export function ErrorState({ message, onRetry }) { return <div className="rounded-2xl border border-[#FF5B8A]/20 bg-[#FF5B8A]/[0.07] p-6 text-sm text-[#FF9AB4]"><p>{message}</p>{onRetry && <button onClick={onRetry} className="mt-3 flex items-center gap-2 font-semibold text-white"><RefreshCw className="h-4 w-4" /> Try again</button>}</div>; }
export function EmptyState({ title, description, action }) { return <div className="rounded-2xl border border-dashed border-white/[0.1] bg-[#111] p-10 text-center"><div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[#7CFF5B]/10 text-[#7CFF5B]"><Dumbbell className="h-5 w-5" /></div><h3 className="mt-4 font-semibold">{title}</h3><p className="mx-auto mt-2 max-w-sm text-sm text-[#858585]">{description}</p>{action && <div className="mt-5">{action}</div>}</div>; }

function BodyMap({ activeMuscle }) {
  const active = normalizeMuscle(activeMuscle);
  return <div className="relative mx-auto aspect-[0.62] w-full max-w-[310px] overflow-hidden rounded-3xl border border-white/[0.07] bg-[radial-gradient(circle_at_50%_30%,rgba(124,255,91,.1),transparent_48%),#0c100d]">
    <div className="absolute inset-0 flex items-center justify-center p-[7%]"><img src="https://images.unsplash.com/photo-1577221084712-45b0445d2b00?w=500&h=900&fit=crop&q=85" alt="Human body reference" className="h-full w-full object-contain opacity-45 grayscale" /></div>
    <div className="absolute inset-x-[18%] top-[7%] bottom-[5%] opacity-80" style={{ background: 'linear-gradient(90deg, transparent 0 20%, rgba(185,205,190,.16) 20% 24%, transparent 24% 76%, rgba(185,205,190,.16) 76% 80%, transparent 80%), radial-gradient(ellipse at 50% 12%, rgba(215,225,216,.3) 0 9%, transparent 9.5%), radial-gradient(ellipse at 50% 25%, rgba(170,195,175,.18) 0 17%, transparent 17.5%), linear-gradient(90deg, transparent 40%, rgba(170,195,175,.2) 40% 60%, transparent 60%)', filter: 'blur(4px)' }} />
    <div className="absolute left-1/2 top-5 h-16 w-14 -translate-x-1/2 rounded-[45%] border border-white/10 bg-[#bbc9bd]/20" /><div className="absolute left-1/2 top-[17%] h-[27%] w-[38%] -translate-x-1/2 rounded-[45%] border border-white/10 bg-[#b8c8ba]/15" /><div className="absolute left-[32%] top-[38%] h-[48%] w-[14%] -rotate-2 rounded-[45%] border border-white/10 bg-[#b8c8ba]/15" /><div className="absolute right-[32%] top-[38%] h-[48%] w-[14%] rotate-2 rounded-[45%] border border-white/10 bg-[#b8c8ba]/15" />
    {MUSCLE_GROUPS.map((muscle) => { const isActive = active === muscle.id; return <div key={muscle.id} className="absolute z-10 -translate-x-1/2 -translate-y-1/2" style={{ top: muscle.top, left: muscle.left }}><span className={`block h-3 w-3 rounded-full border-2 border-[#070707] transition-all duration-300 sm:h-4 sm:w-4 ${isActive ? 'scale-150' : 'opacity-65'}`} style={{ backgroundColor: isActive ? muscle.color : '#CBD6CC', boxShadow: isActive ? `0 0 0 6px ${muscle.color}25, 0 0 24px ${muscle.color}` : undefined }} /><span className={`absolute left-1/2 top-6 -translate-x-1/2 whitespace-nowrap rounded-md border px-2 py-1 text-[10px] font-semibold transition-all ${isActive ? 'opacity-100' : 'pointer-events-none opacity-0'}`} style={{ borderColor: `${muscle.color}50`, backgroundColor: `${muscle.color}18`, color: muscle.color }}>{muscle.label}</span></div>; })}
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/[0.08] bg-black/30 px-3 py-1 text-[10px] text-[#8C978D]">Today’s focus</div>
  </div>;
}

export default function Home({ user }) {
  const { data: rawSchedule, loading, error, reload } = useResource(api.schedule.list);
  const schedule = Array.isArray(rawSchedule) ? rawSchedule : [];
  const today = todayISO();
  const todayWorkout = schedule.find((item) => getScheduleDate(item).slice(0, 10) === today);
  const nextWorkout = schedule.filter((item) => getScheduleDate(item).slice(0, 10) > today).sort((a, b) => getScheduleDate(a).localeCompare(getScheduleDate(b)))[0];
  const muscleName = getScheduleMuscle(todayWorkout);
  const exercises = getExercises(todayWorkout);
  const [selected, setSelected] = useState(null);
  const focus = selected || muscleName;
  const selectedGroup = MUSCLE_GROUPS.find((muscle) => muscle.id === normalizeMuscle(focus));
  const greeting = user?.name || user?.fullName || user?.firstName || 'Athlete';
  const dateLabel = useMemo(() => new Intl.DateTimeFormat(undefined, { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date()), []);

  if (loading) return <div className="page-container"><PageIntro eyebrow="Home" title={`Good to see you, ${greeting}.`} description={dateLabel} /><LoadingState /></div>;
  if (error) return <div className="page-container"><PageIntro eyebrow="Home" title="Your training overview" /><ErrorState message={error} onRetry={reload} /></div>;

  return <div className="page-container"><PageIntro eyebrow={dateLabel} title={`Good to see you, ${greeting}.`} description="Your training plan, at a glance." action={<Link to="/calendar" className="button-secondary">Manage schedule <ArrowRight className="h-4 w-4" /></Link>} />
    <section className="dashboard-grid">
      <div className="card dashboard-panel dashboard-map-panel flex flex-col items-center justify-center p-5 sm:p-8"><div className="mb-5 flex w-full items-center justify-between"><div><p className="text-xs uppercase tracking-widest text-[#858585]">Muscle map</p><h2 className="mt-1 text-xl font-bold">{selectedGroup?.label || muscleName || 'Rest day'}</h2></div><span className="rounded-full bg-[#7CFF5B]/10 px-3 py-1 text-xs font-semibold text-[#7CFF5B]">{muscleName ? 'Scheduled today' : 'No workout planned'}</span></div><BodyMap activeMuscle={focus} /><div className="mt-5 flex flex-wrap justify-center gap-2">{MUSCLE_GROUPS.filter((m) => schedule.some((item) => normalizeMuscle(getScheduleMuscle(item)) === m.id)).slice(0, 6).map((m) => <button key={m.id} onClick={() => setSelected(m.id)} className={`rounded-full border px-3 py-1.5 text-xs transition ${normalizeMuscle(focus) === m.id ? 'border-[#7CFF5B]/50 bg-[#7CFF5B]/10 text-[#7CFF5B]' : 'border-white/[0.08] text-[#929292] hover:text-white'}`}>{m.label}</button>)}</div></div>
      <div className="card dashboard-panel dashboard-workout-panel p-5 sm:p-8"><div className="flex items-start justify-between border-b border-white/[0.07] pb-5"><div><p className="flex items-center gap-2 text-sm text-[#9B9B9B]"><CalendarDays className="h-4 w-4 text-[#7CFF5B]" /> {dateLabel}</p><h2 className="mt-2 text-2xl font-bold">{muscleName || 'A recovery day'}</h2><p className="mt-1 text-sm text-[#858585]">{todayWorkout ? 'Here’s what you have planned.' : 'Use your calendar to plan your next session.'}</p></div>{todayWorkout && <span className="rounded-lg bg-white/[0.05] p-2 text-[#7CFF5B]"><Dumbbell className="h-5 w-5" /></span>}</div>{todayWorkout ? <div className="mt-6 space-y-3">{exercises.length ? exercises.map((exercise, index) => <div key={`${getExerciseName(exercise)}-${index}`} className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-[#0C0C0C] p-4"><div className="flex items-center gap-3"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#7CFF5B]/10 text-xs font-bold text-[#7CFF5B]">{String(index + 1).padStart(2, '0')}</span><span className="font-medium">{getExerciseName(exercise)}</span></div><ChevronRight className="h-4 w-4 text-[#555]" /></div>) : <EmptyState title="No exercises added" description="This workout has a muscle assigned but no exercises yet." />}</div> : <div className="mt-6"><EmptyState title="Nothing scheduled today" description="A clear plan makes showing up easier. Add your next workout in the calendar." action={<Link to="/calendar" className="button-primary">Open calendar</Link>} /></div>}{nextWorkout && <div className="mt-6 flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.025] p-4 text-sm"><Clock3 className="h-4 w-4 text-[#5BE7FF]" /><span className="text-[#969696]">Up next</span><strong>{getScheduleMuscle(nextWorkout)}</strong><span className="ml-auto text-[#777]">{formatDate(getScheduleDate(nextWorkout), { month: 'short', day: 'numeric' })}</span></div>}</div>
    </section>
  </div>;
}

export { PageIntro };
export { BodyMap };
