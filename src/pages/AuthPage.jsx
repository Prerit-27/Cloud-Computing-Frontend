import { useState } from 'react';
import { ArrowRight, Dumbbell, Eye, LockKeyhole, Mail, UserRound } from 'lucide-react';

export default function AuthPage({ mode, onSubmit, onDemo, loading, error, onModeChange }) {
  const isSignup = mode === 'signup';
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const submit = (event) => {
    event.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="auth-page">
      <div className="auth-glow auth-glow-green" />
      <div className="auth-glow auth-glow-blue" />
      <div className="auth-card">
        <section className="auth-story">
          <div className="auth-brand"><span className="brand-mark"><Dumbbell className="h-5 w-5 text-[#070707]" strokeWidth={2.5} /></span><strong className="brand-name">Fit<span>Pulse</span></strong></div>
          <div className="auth-story-copy"><p className="auth-eyebrow">Your training, focused</p><h1>Show up for the body you’re building.</h1><p>Know exactly what to train today, keep your schedule close, and see your progress over time.</p></div>
          <div className="auth-story-lines"><span /><span /></div>
        </section>
        <section className="auth-form-panel">
          <div className="auth-mobile-brand"><span className="brand-mark"><Dumbbell className="h-5 w-5 text-[#070707]" /></span><strong className="brand-name">Fit<span>Pulse</span></strong></div>
          <p className="auth-eyebrow">Welcome back</p>
          <h2>{isSignup ? 'Create your account' : 'Sign in to FitPulse'}</h2>
          <p className="auth-subtitle">{isSignup ? 'Start keeping your training simple and consistent.' : 'Your next workout is waiting.'}</p>
          <form onSubmit={submit} className="auth-form">
            {isSignup && <label className="field"><span>Name</span><div className="input-wrap"><UserRound /><input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Alex Morgan" /></div></label>}
            <label className="field"><span>Email</span><div className="input-wrap"><Mail /><input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" /></div></label>
            <label className="field"><span>Password</span><div className="input-wrap"><LockKeyhole /><input required minLength={6} type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••••" /></div></label>
            {error && <p className="auth-error">{error}</p>}
            <button disabled={loading} className="auth-submit">{loading ? 'Please wait…' : isSignup ? 'Create account' : 'Sign in'} {!loading && <ArrowRight className="h-4 w-4" />}</button>
          </form>
          <div className="auth-divider"><span />or<span /></div>
          <button type="button" onClick={onDemo} className="auth-demo"><Eye className="h-4 w-4" /> Preview the app</button>
          <p className="auth-demo-note">Explore all pages with sample data. No backend account required.</p>
          <p className="auth-switch">{isSignup ? 'Already have an account?' : 'New to FitPulse?'} <button onClick={() => onModeChange(isSignup ? 'login' : 'signup')}>{isSignup ? 'Sign in' : 'Create an account'}</button></p>
        </section>
      </div>
    </div>
  );
}
