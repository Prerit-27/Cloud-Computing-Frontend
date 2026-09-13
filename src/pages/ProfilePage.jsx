import { useState } from 'react';
import { Camera, LogOut, Save, Trash2, UserRound } from 'lucide-react';
import { api } from '../utils/api';
import { useResource } from '../hooks/useAppData';
import { ErrorState, LoadingState, PageIntro } from './Home';

function ProfileForm({ current, onUserChange, onLogout, reload }) {
  const [form, setForm] = useState({ name: current.name || current.fullName || '', email: current.email || '', bio: current.bio || '' });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [saveError, setSaveError] = useState('');

  const save = async (event) => {
    event.preventDefault(); setSaving(true); setMessage(''); setSaveError('');
    try { const updated = await api.profile.update(form); onUserChange(updated); setMessage('Profile updated.'); }
    catch (err) { setSaveError(err.message); } finally { setSaving(false); }
  };
  const uploadPicture = async (event) => {
    const picture = event.target.files?.[0]; if (!picture) return;
    try { const updated = await api.profile.picture(picture); onUserChange(updated); reload(); }
    catch (err) { setSaveError(err.message); }
  };
  const deleteProfile = async () => {
    if (!window.confirm('Delete your profile and account? This cannot be undone.')) return;
    try { await api.profile.remove(); await onLogout(); } catch (err) { setSaveError(err.message); }
  };
  const avatar = current.profilePicture || current.avatar || current.picture;

  return <div className="grid gap-5 lg:grid-cols-[0.7fr_1.3fr]">
    <section className="card flex flex-col items-center p-6 text-center">
      <div className="relative"><div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-2 border-[#7CFF5B]/30 bg-[#7CFF5B]/10 text-3xl font-bold text-[#7CFF5B]">{avatar ? <img src={avatar} alt="Profile" className="h-full w-full object-cover" /> : (current.name || current.email || 'FP').slice(0, 2).toUpperCase()}</div><label className="absolute -bottom-1 -right-1 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-4 border-[#111] bg-[#7CFF5B] text-[#070707]" aria-label="Change profile picture"><Camera className="h-4 w-4" /><input type="file" accept="image/*" onChange={uploadPicture} className="hidden" /></label></div>
      <h2 className="mt-5 text-xl font-bold">{current.name || current.fullName || 'Your profile'}</h2><p className="mt-1 text-sm text-[#888]">{current.email || 'Add your email'}</p>
      <button onClick={onLogout} className="mt-8 flex items-center gap-2 text-sm text-[#A5A5A5] hover:text-white"><LogOut className="h-4 w-4" /> Log out</button>
    </section>
    <section className="card p-6"><form onSubmit={save} className="space-y-5"><label className="field"><span>Full name</span><div className="input-wrap"><UserRound /><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" /></div></label><label className="field"><span>Email</span><input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" /></label><label className="field"><span>About you <em className="font-normal text-[#777]">(optional)</em></span><textarea rows="4" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} placeholder="A short note about your training…" /></label>{message && <p className="text-sm text-[#7CFF5B]">{message}</p>}{saveError && <p className="text-sm text-[#FF8CAE]">{saveError}</p>}<button disabled={saving} className="button-primary"><Save className="h-4 w-4" />{saving ? 'Saving…' : 'Save profile'}</button></form><div className="mt-10 border-t border-white/[0.07] pt-5"><h3 className="text-sm font-semibold text-[#FF9AB4]">Danger zone</h3><p className="mt-1 text-xs text-[#777]">Permanently remove your profile and associated account.</p><button onClick={deleteProfile} className="mt-4 flex items-center gap-2 text-sm text-[#FF7F9E] hover:text-[#FFB0C3]"><Trash2 className="h-4 w-4" /> Delete profile</button></div></section>
  </div>;
}

export default function ProfilePage({ user, onUserChange, onLogout }) {
  const { data: profile, loading, error, reload } = useResource(api.profile.get);
  const current = profile || user || {};
  if (loading) return <div className="page-container"><PageIntro eyebrow="Profile" title="Your profile" /><LoadingState /></div>;
  if (error) return <div className="page-container"><PageIntro eyebrow="Profile" title="Your profile" /><ErrorState message={error} onRetry={reload} /></div>;
  return <div className="page-container"><PageIntro eyebrow="Profile" title="Your profile" description="Keep your details up to date and your account in your control." /><ProfileForm key={current.id || current._id || current.updatedAt || current.email} current={current} onUserChange={onUserChange} onLogout={onLogout} reload={reload} /></div>;
}

