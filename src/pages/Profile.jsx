import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Camera,
  Phone,
  CalendarDays,
  Pencil,
  Check,
  X,
  Loader2,
  AlertCircle,
  Trash2,
  KeyRound,
} from 'lucide-react';
import * as api from '../utils/api';
import { useAuth } from '../context/auth-context';
import {
  userFields as uf,
  displayName,
  initialsOf,
  mediaUrl,
  toApiProfile,
  toApiPasswordChange,
} from '../utils/adapters';

const TABS = ['Personal Info', 'Security', 'Account'];

const inputCls =
  'w-full h-12 px-4 rounded-xl bg-[#151515] border border-white/10 text-white outline-none transition focus:border-[#7CFF5B] focus:ring-1 focus:ring-[#7CFF5B] disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-white/25';

function Field({ label, error, children }) {
  return (
    <div>
      <label className="block text-sm text-white/50 mb-2">{label}</label>
      {children}
      {error && <p className="mt-1.5 text-xs text-[#FF5B5B]">{error}</p>}
    </div>
  );
}

function Banner({ kind = 'error', children }) {
  const ok = kind === 'success';
  return (
    <div
      className={`mb-5 flex gap-3 p-4 rounded-xl border ${
        ok
          ? 'bg-[#7CFF5B]/10 border-[#7CFF5B]/25'
          : 'bg-[#FF5B5B]/10 border-[#FF5B5B]/25'
      }`}
    >
      {ok ? (
        <Check className="w-4 h-4 text-[#7CFF5B] shrink-0 mt-0.5" strokeWidth={3} />
      ) : (
        <AlertCircle className="w-4 h-4 text-[#FF5B5B] shrink-0 mt-0.5" />
      )}
      <p className={`text-sm whitespace-pre-line ${ok ? 'text-[#7CFF5B]' : 'text-[#FF8A8A]'}`}>
        {children}
      </p>
    </div>
  );
}

export default function Profile() {
  const navigate = useNavigate();
  const { user, patchUser, setUser, clearSession, deleteAccount } = useAuth();
  const fileRef = useRef(null);

  const [tab, setTab] = useState('Personal Info');

  // ---- profile form ----
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({});
  const [saving, setSaving] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [savedFlash, setSavedFlash] = useState(false);

  // ---- avatar ----
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  // ---- password ----
  const [pw, setPw] = useState({ current: '', next: '', confirm: '' });
  const [pwState, setPwState] = useState({ saving: false, error: '', done: false });

  // ---- delete ----
  const [confirmText, setConfirmText] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  if (!user) {
    return (
      <div className="py-24 grid place-items-center text-white/30">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  const startEdit = () => {
    setDraft({
      firstName: uf.firstName(user),
      lastName: uf.lastName(user),
      email: uf.email(user),
      bio: uf.bio(user),
      phone: uf.phone(user),
    });
    setProfileError('');
    setFieldErrors({});
    setEditing(true);
  };

  const set = (key) => (e) => setDraft((d) => ({ ...d, [key]: e.target.value }));

  const saveProfile = async () => {
    setSaving(true);
    setProfileError('');
    setFieldErrors({});
    try {
      await patchUser(toApiProfile(draft));
      setEditing(false);
      setSavedFlash(true);
      setTimeout(() => setSavedFlash(false), 2500);
    } catch (err) {
      setProfileError(err.message);
      setFieldErrors(err.fields ?? {});
    } finally {
      setSaving(false);
    }
  };

  const onPickFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = ''; // allow re-picking the same file
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Please choose an image file.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image must be under 5 MB.');
      return;
    }

    setUploading(true);
    setUploadError('');
    try {
      const { profile_picture_url } = await api.uploadProfilePicture(file);
      // Supabase keeps the same public URL on re-upload; bust the browser cache.
      setUser((prev) => ({
        ...prev,
        profile_picture_url: `${profile_picture_url.split('?')[0]}?v=${Date.now()}`,
      }));
    } catch (err) {
      setUploadError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const submitPassword = async (e) => {
    e.preventDefault();
    if (pw.next !== pw.confirm) {
      setPwState({ saving: false, error: 'New passwords do not match.', done: false });
      return;
    }
    if (pw.next.length < 6) {
      setPwState({ saving: false, error: 'New password must be at least 6 characters.', done: false });
      return;
    }

    setPwState({ saving: true, error: '', done: false });
    try {
      await api.changePassword(toApiPasswordChange(pw));
      // The backend deletes the token on a password change, so log in again.
      clearSession();
      navigate('/login', {
        replace: true,
        state: { notice: 'Password changed. Please log in with your new password.' },
      });
    } catch (err) {
      setPwState({
        saving: false,
        error: err.fields?.old_password ?? err.fields?.new_password ?? err.message,
        done: false,
      });
    }
  };

  const confirmDelete = async () => {
    setDeleting(true);
    setDeleteError('');
    try {
      await deleteAccount();
      navigate('/');
    } catch (err) {
      setDeleteError(err.message);
      setDeleting(false);
    }
  };

  const avatar = mediaUrl(uf.avatar(user));
  const joined = uf.dateJoined(user);

  return (
    <div>
      {/* ================= COVER + IDENTITY ================= */}
      <div className="relative rounded-3xl overflow-hidden border border-white/[0.06] mb-6">
        {/* Decorative only. The blur circle overflows the header, so without
            pointer-events-none it sits on top of the buttons below it. */}
        <div className="h-36 sm:h-44 bg-gradient-to-br from-[#7CFF5B]/25 via-[#5BE7FF]/12 to-transparent relative pointer-events-none">
          <div className="absolute inset-0 bg-[#070707]/35" />
          <div className="absolute -top-20 -right-10 w-80 h-80 rounded-full bg-[#7CFF5B]/20 blur-[100px]" />
        </div>

        <div className="bg-[#101010] px-6 sm:px-8 pb-7">
          <div className="flex flex-wrap items-end gap-5 -mt-14">
            <div className="relative">
              <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-[#7CFF5B] to-[#5BE7FF] grid place-items-center text-[#070707] text-3xl font-black ring-4 ring-[#101010] overflow-hidden">
                {avatar ? (
                  <img src={avatar} alt="" className="w-full h-full object-cover" />
                ) : (
                  initialsOf(user)
                )}
                {uploading && (
                  <div className="absolute inset-0 bg-black/60 grid place-items-center">
                    <Loader2 className="w-5 h-5 animate-spin text-white" />
                  </div>
                )}
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={onPickFile}
                className="sr-only"
              />
              <button
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                aria-label="Change profile picture"
                className="absolute -bottom-1 -right-1 w-9 h-9 grid place-items-center rounded-xl bg-[#181818] border border-white/10 text-white/60 hover:text-white transition disabled:opacity-50"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 min-w-[200px] pt-2">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                {displayName(user)}
              </h1>
              {uf.username(user) && (
                <p className="text-white/40 text-sm mt-0.5">@{uf.username(user)}</p>
              )}
              <div className="flex flex-wrap gap-4 mt-3 text-sm text-white/45">
                {uf.phone(user) && (
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5" />
                    {uf.phone(user)}
                  </span>
                )}
                {joined && (
                  <span className="flex items-center gap-1.5">
                    <CalendarDays className="w-3.5 h-3.5" />
                    Joined{' '}
                    {new Date(joined).toLocaleDateString(undefined, {
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                )}
              </div>
            </div>

            <div className="pt-2">
              {editing ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditing(false)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 text-white/70 text-sm font-medium hover:bg-white/[0.04] transition"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                  <button
                    onClick={saveProfile}
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
                  onClick={() => {
                    setTab('Personal Info');
                    startEdit();
                  }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/[0.06] border border-white/10 text-sm font-semibold hover:bg-white/[0.10] transition"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          {uf.bio(user) && (
            <p className="mt-5 text-[#B8B8B8] max-w-2xl leading-relaxed">{uf.bio(user)}</p>
          )}

          {uploadError && <p className="mt-4 text-xs text-[#FF5B5B]">{uploadError}</p>}

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

      {/* ================= PERSONAL INFO ================= */}
      {tab === 'Personal Info' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#101010] border border-white/[0.06]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold">Personal Information</h2>
              <p className="text-sm text-white/40 mt-0.5">
                {editing ? 'Make your changes and hit Save.' : 'Click Edit Profile to change these.'}
              </p>
            </div>
          </div>

          {profileError && <Banner>{profileError}</Banner>}

          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="First name" error={fieldErrors.first_name}>
              <input
                value={editing ? draft.firstName ?? '' : uf.firstName(user)}
                onChange={set('firstName')}
                disabled={!editing}
                className={inputCls}
              />
            </Field>
            <Field label="Last name" error={fieldErrors.last_name}>
              <input
                value={editing ? draft.lastName ?? '' : uf.lastName(user)}
                onChange={set('lastName')}
                disabled={!editing}
                className={inputCls}
              />
            </Field>
            <Field label="Username (cannot be changed)">
              <input value={uf.username(user)} disabled className={inputCls} />
            </Field>
            <Field label="Email address" error={fieldErrors.email}>
              <input
                type="email"
                value={editing ? draft.email ?? '' : uf.email(user)}
                onChange={set('email')}
                disabled={!editing}
                className={inputCls}
              />
            </Field>
            <Field label="Phone number" error={fieldErrors.phone_number}>
              <input
                type="tel"
                maxLength={20}
                value={editing ? draft.phone ?? '' : uf.phone(user)}
                onChange={set('phone')}
                disabled={!editing}
                className={inputCls}
              />
            </Field>
          </div>

          <div className="mt-5">
            <Field label="Bio" error={fieldErrors.bio}>
              <textarea
                rows={3}
                value={editing ? draft.bio ?? '' : uf.bio(user)}
                onChange={set('bio')}
                disabled={!editing}
                className={`${inputCls} h-auto py-3 resize-none`}
              />
            </Field>
          </div>
        </div>
      )}

      {/* ================= SECURITY ================= */}
      {tab === 'Security' && (
        <form
          onSubmit={submitPassword}
          className="p-6 sm:p-8 rounded-3xl bg-[#101010] border border-white/[0.06]"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#5BE7FF]/12 grid place-items-center">
              <KeyRound className="w-4 h-4 text-[#5BE7FF]" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Change Password</h2>
              <p className="text-sm text-white/40 mt-0.5">
                You will be signed out and asked to log in again.
              </p>
            </div>
          </div>

          {pwState.error && <Banner>{pwState.error}</Banner>}

          <div className="grid sm:grid-cols-2 gap-5 max-w-2xl">
            <div className="sm:col-span-2">
              <Field label="Current password">
                <input
                  type="password"
                  autoComplete="current-password"
                  value={pw.current}
                  onChange={(e) => setPw({ ...pw, current: e.target.value })}
                  placeholder="••••••••"
                  required
                  className={inputCls}
                />
              </Field>
            </div>
            <Field label="New password">
              <input
                type="password"
                autoComplete="new-password"
                value={pw.next}
                onChange={(e) => setPw({ ...pw, next: e.target.value })}
                placeholder="At least 6 characters"
                required
                className={inputCls}
              />
            </Field>
            <Field label="Confirm new password">
              <input
                type="password"
                autoComplete="new-password"
                value={pw.confirm}
                onChange={(e) => setPw({ ...pw, confirm: e.target.value })}
                placeholder="Re-enter it"
                required
                className={inputCls}
              />
            </Field>
          </div>

          <button
            type="submit"
            disabled={pwState.saving}
            className="mt-6 flex items-center gap-2 px-5 py-3 rounded-xl bg-[#7CFF5B] text-[#070707] text-sm font-bold hover:bg-[#91ff75] transition disabled:opacity-60"
          >
            {pwState.saving && <Loader2 className="w-4 h-4 animate-spin" />}
            {pwState.saving ? 'Updating…' : 'Update password'}
          </button>
        </form>
      )}

      {/* ================= ACCOUNT ================= */}
      {tab === 'Account' && (
        <section className="p-6 sm:p-8 rounded-3xl bg-[#FF5B5B]/[0.04] border border-[#FF5B5B]/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#FF5B5B]/12 grid place-items-center">
              <Trash2 className="w-4 h-4 text-[#FF5B5B]" />
            </div>
            <h2 className="text-lg font-bold text-[#FF8A8A]">Delete Account</h2>
          </div>

          <p className="text-sm text-white/50 max-w-xl leading-relaxed">
            This permanently removes your account, profile and weekly schedule. Exercises you
            added stay in the shared library. It cannot be undone.
          </p>

          {deleteError && (
            <div className="mt-5 max-w-md">
              <Banner>{deleteError}</Banner>
            </div>
          )}

          <div className="mt-6 max-w-md">
            <Field label={`Type DELETE to confirm`}>
              <input
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="DELETE"
                className={inputCls}
              />
            </Field>
            <button
              onClick={confirmDelete}
              disabled={confirmText !== 'DELETE' || deleting}
              className="mt-4 flex items-center gap-2 px-5 py-3 rounded-xl bg-[#FF5B5B] text-white text-sm font-bold hover:bg-[#ff7070] transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {deleting && <Loader2 className="w-4 h-4 animate-spin" />}
              {deleting ? 'Deleting…' : 'Delete my account'}
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
