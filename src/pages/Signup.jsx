import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Dumbbell, Eye, EyeOff, Check, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/auth-context';

const GOALS = [
  { value: 'build_muscle', label: 'Build Muscle' },
  { value: 'lose_fat', label: 'Lose Fat' },
  { value: 'strength', label: 'Get Stronger' },
  { value: 'endurance', label: 'Endurance' },
];

const EXPERIENCE = [
  { value: 'beginner', label: 'Beginner', hint: '0–1 yr' },
  { value: 'intermediate', label: 'Intermediate', hint: '1–3 yrs' },
  { value: 'advanced', label: 'Advanced', hint: '3+ yrs' },
];

const inputClass = `
  w-full h-13 px-4 rounded-xl bg-[#151515] border border-white/10 text-white
  placeholder:text-white/25 outline-none transition
  focus:border-[#7CFF5B] focus:ring-1 focus:ring-[#7CFF5B]
`;

function passwordScore(pw) {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
}

export default function Signup() {
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirm: '',
    goal: 'build_muscle',
    experience: 'beginner',
    terms: false,
  });
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const set = (key) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (!form.firstName.trim()) next.firstName = 'Required';
    if (!form.email.trim()) next.email = 'Required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Enter a valid email';
    if (form.password.length < 8) next.password = 'At least 8 characters';
    if (form.confirm !== form.password) next.confirm = 'Passwords do not match';
    if (!form.terms) next.terms = 'Please accept the terms';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;

    setSubmitting(true);
    try {
      // TODO(django): POST /api/auth/register/ — see utils/api.js
      await signUp({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
        primaryGoal: form.goal,
        experience: form.experience,
      });
      navigate('/app/dashboard');
    } catch (err) {
      setServerError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const score = passwordScore(form.password);
  const scoreColors = ['#3A3A3A', '#FF5B5B', '#FFB85B', '#5BE7FF', '#7CFF5B'];
  const scoreLabels = ['', 'Weak', 'Fair', 'Good', 'Strong'];

  return (
    <div className="min-h-screen bg-[#070707] text-white flex">
      {/* ================= LEFT — PROMO ================= */}
      <div className="hidden lg:flex w-[52%] min-h-screen relative overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-[#7CFF5B]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-200px] right-[-120px] w-[520px] h-[520px] bg-[#5BE7FF]/10 rounded-full blur-[130px]" />

        <div className="relative z-10 w-full p-10 flex flex-col">
          <Link to="/" className="flex items-center gap-2.5 group w-fit">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#7CFF5B] to-[#5BE7FF] flex items-center justify-center shadow-lg shadow-[#7CFF5B]/20 transition-transform duration-300 group-hover:scale-105">
              <Dumbbell className="w-5 h-5 text-[#070707]" strokeWidth={2.5} />
            </div>
            <span className="text-xl font-bold tracking-tight">
              Fit<span className="text-[#7CFF5B]">Pulse</span>
            </span>
          </Link>

          <div className="flex-1 flex flex-col justify-center max-w-[560px]">
            <h1 className="text-5xl xl:text-6xl font-bold leading-[0.95] tracking-tight">
              Start your
              <br />
              <span className="text-[#7CFF5B]">transformation.</span>
            </h1>
            <p className="mt-6 text-lg text-white/50">
              Join 50,000+ lifters tracking every set, every rep, every gain.
            </p>

            <div className="mt-10 space-y-4">
              {[
                'Personalised workout plans built around your goals',
                '500+ exercises with full anatomy breakdowns',
                'Calendar planning and streak tracking',
                'Progress analytics that actually mean something',
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="w-6 h-6 shrink-0 rounded-full bg-[#7CFF5B]/15 border border-[#7CFF5B]/30 grid place-items-center">
                    <Check className="w-3.5 h-3.5 text-[#7CFF5B]" strokeWidth={3} />
                  </div>
                  <span className="text-white/70">{item}</span>
                </div>
              ))}
            </div>

            <div className="mt-12 flex items-center gap-6 p-5 rounded-2xl bg-[#121212] border border-white/[0.08]">
              <div>
                <p className="text-3xl font-bold text-[#7CFF5B]">50K+</p>
                <p className="text-sm text-white/40">Active members</p>
              </div>
              <div className="w-px h-12 bg-white/10" />
              <div>
                <p className="text-3xl font-bold text-[#5BE7FF]">2.4M</p>
                <p className="text-sm text-white/40">Workouts logged</p>
              </div>
              <div className="w-px h-12 bg-white/10" />
              <div>
                <p className="text-3xl font-bold text-[#FF5B8A]">4.9</p>
                <p className="text-sm text-white/40">Average rating</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= RIGHT — FORM ================= */}
      <div className="w-full lg:w-[48%] min-h-screen bg-[#0D0D0D] lg:border-l border-white/10 flex items-center justify-center">
        <div className="w-full max-w-[480px] px-8 py-12">
          <Link to="/" className="flex lg:hidden items-center gap-3 mb-12">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7CFF5B] to-[#5BE7FF] grid place-items-center">
              <Dumbbell className="w-5 h-5 text-[#070707]" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-lg">
              Fit<span className="text-[#7CFF5B]">Pulse</span>
            </span>
          </Link>

          <div className="mb-8">
            <h2 className="text-3xl font-bold tracking-tight">Create your account</h2>
            <p className="mt-2 text-white/40">Free forever. No card required.</p>
          </div>

          {serverError && (
            <div className="mb-5 flex gap-3 p-4 rounded-xl bg-[#FF5B5B]/10 border border-[#FF5B5B]/25">
              <AlertCircle className="w-4 h-4 text-[#FF5B5B] shrink-0 mt-0.5" />
              <p className="text-sm text-[#FF8A8A]">{serverError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Name */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-white/60 mb-2">First name</label>
                <input
                  value={form.firstName}
                  onChange={set('firstName')}
                  placeholder="Daniel"
                  className={`${inputClass} h-13 py-3.5 ${errors.firstName ? 'border-[#FF5B5B]' : ''}`}
                />
                {errors.firstName && (
                  <p className="mt-1.5 text-xs text-[#FF5B5B]">{errors.firstName}</p>
                )}
              </div>
              <div>
                <label className="block text-sm text-white/60 mb-2">Last name</label>
                <input
                  value={form.lastName}
                  onChange={set('lastName')}
                  placeholder="Dao"
                  className={`${inputClass} py-3.5`}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm text-white/60 mb-2">Email address</label>
              <input
                type="email"
                value={form.email}
                onChange={set('email')}
                placeholder="you@example.com"
                className={`${inputClass} py-3.5 ${errors.email ? 'border-[#FF5B5B]' : ''}`}
              />
              {errors.email && <p className="mt-1.5 text-xs text-[#FF5B5B]">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm text-white/60 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={form.password}
                  onChange={set('password')}
                  placeholder="At least 8 characters"
                  className={`${inputClass} py-3.5 pr-12 ${errors.password ? 'border-[#FF5B5B]' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/35 hover:text-white/70 transition"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {form.password && (
                <div className="mt-2.5 flex items-center gap-3">
                  <div className="flex-1 flex gap-1.5">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="h-1 flex-1 rounded-full transition-colors duration-300"
                        style={{ backgroundColor: i <= score ? scoreColors[score] : '#232323' }}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-medium" style={{ color: scoreColors[score] }}>
                    {scoreLabels[score]}
                  </span>
                </div>
              )}
              {errors.password && (
                <p className="mt-1.5 text-xs text-[#FF5B5B]">{errors.password}</p>
              )}
            </div>

            {/* Confirm */}
            <div>
              <label className="block text-sm text-white/60 mb-2">Confirm password</label>
              <input
                type={showPw ? 'text' : 'password'}
                value={form.confirm}
                onChange={set('confirm')}
                placeholder="Re-enter your password"
                className={`${inputClass} py-3.5 ${errors.confirm ? 'border-[#FF5B5B]' : ''}`}
              />
              {errors.confirm && <p className="mt-1.5 text-xs text-[#FF5B5B]">{errors.confirm}</p>}
            </div>

            {/* Goal */}
            <div>
              <label className="block text-sm text-white/60 mb-2.5">What is your main goal?</label>
              <div className="grid grid-cols-2 gap-2">
                {GOALS.map((g) => (
                  <button
                    key={g.value}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, goal: g.value }))}
                    className={`px-4 py-3 rounded-xl text-sm font-medium border transition-all duration-200 ${
                      form.goal === g.value
                        ? 'bg-[#7CFF5B]/12 border-[#7CFF5B] text-[#7CFF5B]'
                        : 'bg-[#151515] border-white/10 text-white/60 hover:border-white/25'
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Experience */}
            <div>
              <label className="block text-sm text-white/60 mb-2.5">Training experience</label>
              <div className="grid grid-cols-3 gap-2">
                {EXPERIENCE.map((x) => (
                  <button
                    key={x.value}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, experience: x.value }))}
                    className={`px-3 py-3 rounded-xl border transition-all duration-200 ${
                      form.experience === x.value
                        ? 'bg-[#7CFF5B]/12 border-[#7CFF5B]'
                        : 'bg-[#151515] border-white/10 hover:border-white/25'
                    }`}
                  >
                    <span
                      className={`block text-sm font-medium ${
                        form.experience === x.value ? 'text-[#7CFF5B]' : 'text-white/70'
                      }`}
                    >
                      {x.label}
                    </span>
                    <span className="block text-[11px] text-white/35 mt-0.5">{x.hint}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Terms */}
            <div>
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={form.terms}
                  onChange={set('terms')}
                  className="sr-only"
                />
                <span
                  className={`mt-0.5 w-5 h-5 shrink-0 rounded-md border grid place-items-center transition-all ${
                    form.terms
                      ? 'bg-[#7CFF5B] border-[#7CFF5B]'
                      : 'border-white/20 group-hover:border-white/40'
                  }`}
                >
                  {form.terms && <Check className="w-3.5 h-3.5 text-[#070707]" strokeWidth={3} />}
                </span>
                <span className="text-sm text-white/50 leading-relaxed">
                  I agree to the{' '}
                  <span className="text-[#7CFF5B] hover:underline">Terms of Service</span> and{' '}
                  <span className="text-[#7CFF5B] hover:underline">Privacy Policy</span>.
                </span>
              </label>
              {errors.terms && <p className="mt-1.5 text-xs text-[#FF5B5B]">{errors.terms}</p>}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full h-14 rounded-xl bg-[#7CFF5B] text-[#070707] font-bold transition-all duration-300 hover:bg-[#91ff75] hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {submitting ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <div className="flex items-center gap-4 my-7">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-sm text-white/30">OR</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <button
            type="button"
            className="w-full h-14 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] transition flex items-center justify-center gap-3 font-medium"
          >
            <span className="text-lg">G</span>
            Sign up with Google
          </button>

          <p className="text-center text-sm text-white/40 mt-8">
            Already have an account?
            <Link to="/login" className="ml-1 text-[#7CFF5B] font-medium hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
