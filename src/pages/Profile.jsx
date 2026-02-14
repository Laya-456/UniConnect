import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/users/me')
      .then(({ data }) => {
        setFullName(data.full_name || '');
        setEmail(data.email || '');
      })
      .catch(() => setError('Failed to load profile'))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const nameTrim = fullName.trim();
    if (!nameTrim) {
      setError('Full name cannot be empty');
      return;
    }

    if (newPassword || confirmPassword) {
      if (newPassword !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      if (!PASSWORD_REGEX.test(newPassword)) {
        setError('Password must be at least 8 characters with 1 uppercase, 1 number and 1 special character');
        return;
      }
    }

    setSubmitting(true);
    try {
      const body = { full_name: nameTrim };
      if (email !== undefined) body.email = email.trim() || undefined;
      if (newPassword) body.new_password = newPassword;

      const { data } = await api.put('/profile/update', body);
      updateUser({
        full_name: data.full_name,
        email: data.email,
        role: data.role,
        streak_count: data.streak_count,
      });
      setSuccess('Profile updated successfully.');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-xl mx-auto flex items-center justify-center py-12">
        <p className="text-slate-600">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-xl font-bold text-slate-800 mb-2">Profile</h1>
      <p className="text-slate-600 text-sm mb-6">Manage your account details.</p>

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm mb-6">
        <h2 className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-2">Account info</h2>
        <dl className="grid gap-2 text-sm">
          <div>
            <dt className="text-slate-500">Role</dt>
            <dd className="font-medium text-slate-800 capitalize">{user?.role ?? '—'}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Streak</dt>
            <dd className="font-medium text-slate-800">{user?.streak_count ?? 0} day{(user?.streak_count ?? 0) !== 1 ? 's' : ''}</dd>
          </div>
        </dl>
      </div>

      <form onSubmit={handleSubmit} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        {success && (
          <div className="text-sm text-emerald-700 bg-emerald-50 px-3 py-2 rounded-lg" role="alert">
            {success}
          </div>
        )}
        {error && (
          <div className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg" role="alert">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="profile-full_name" className="block text-sm font-medium text-slate-700 mb-1">
            Full name
          </label>
          <input
            id="profile-full_name"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
            required
          />
        </div>

        <div>
          <label htmlFor="profile-email" className="block text-sm font-medium text-slate-700 mb-1">
            Email (optional)
          </label>
          <input
            id="profile-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
          />
        </div>

        <div>
          <label htmlFor="profile-new_password" className="block text-sm font-medium text-slate-700 mb-1">
            New password (leave blank to keep current)
          </label>
          <input
            id="profile-new_password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
            autoComplete="new-password"
          />
        </div>

        <div>
          <label htmlFor="profile-confirm_password" className="block text-sm font-medium text-slate-700 mb-1">
            Confirm new password
          </label>
          <input
            id="profile-confirm_password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
            autoComplete="new-password"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="btn-micro btn-micro-primary w-full py-2.5 bg-primary-500 text-white font-medium rounded-lg hover:bg-primary-600 disabled:opacity-60"
        >
          {submitting ? 'Saving...' : 'Save changes'}
        </button>
      </form>
    </div>
  );
}
