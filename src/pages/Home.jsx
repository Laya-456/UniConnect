import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [suggestion, setSuggestion] = useState(null);

  useEffect(() => {
    api.get('/users/me').then(({ data }) => {
      setProfile(data);
      updateUser({ streak_count: data.streak_count });
    }).catch(() => {});
    api.get('/wellness/suggestion').then(({ data }) => setSuggestion(data)).catch(() => {});
  }, [updateUser]);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="rounded-2xl bg-gradient-to-br from-primary-500/10 to-accent-500/10 border border-primary-500/20 p-6 mb-6">
        <p className="text-slate-700 text-lg italic">
          &ldquo;We don&apos;t connect people by algorithms. We connect them by intention.&rdquo;
        </p>
        <p className="text-sm text-slate-500 mt-2">— UniConnect</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 mb-6">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="text-sm font-medium text-slate-500">Your streak</h3>
          <p className="text-2xl font-bold text-accent-600 mt-1">
            {profile?.streak_count ?? 0} day{profile?.streak_count !== 1 ? 's' : ''}
          </p>
          <p className="text-xs text-slate-500 mt-1">Log mood or chat to keep it going</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="text-sm font-medium text-slate-500">Hello, {user?.full_name}</h3>
          <p className="text-slate-700 mt-1 capitalize">{user?.role}</p>
        </div>
      </div>

      {suggestion?.showSuggestion && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 mb-6">
          <p className="text-amber-800 text-sm">{suggestion.message}</p>
          <Link to="/wellness" className="inline-block mt-2 text-sm font-medium text-amber-700 hover:underline">
            View Wellness Centre →
          </Link>
        </div>
      )}

      <h2 className="text-lg font-semibold text-slate-800 mb-3">Quick actions</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        <Link
          to="/mood"
          className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:border-primary-300 hover:bg-primary-50/50 transition-colors"
        >
          <span className="text-2xl">😊</span>
          <div>
            <p className="font-medium text-slate-800">Log your mood</p>
            <p className="text-sm text-slate-500">How are you feeling today?</p>
          </div>
        </Link>
        <Link
          to="/mood-meter"
          className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:border-primary-300 hover:bg-primary-50/50 transition-colors"
        >
          <span className="text-2xl">📊</span>
          <div>
            <p className="font-medium text-slate-800">Campus mood</p>
            <p className="text-sm text-slate-500">See today&apos;s vibe</p>
          </div>
        </Link>
        <Link
          to="/match"
          className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:border-accent-300 hover:bg-accent-50/50 transition-colors"
        >
          <span className="text-2xl">🤝</span>
          <div>
            <p className="font-medium text-slate-800">Connect</p>
            <p className="text-sm text-slate-500">Find someone to talk to</p>
          </div>
        </Link>
        <Link
          to="/chat"
          className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:border-accent-300 hover:bg-accent-50/50 transition-colors"
        >
          <span className="text-2xl">💬</span>
          <div>
            <p className="font-medium text-slate-800">Chat</p>
            <p className="text-sm text-slate-500">Message your connections</p>
          </div>
        </Link>
        <Link
          to="/kindness"
          className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:border-accent-300 hover:bg-accent-50/50 transition-colors"
        >
          <span className="text-2xl">💚</span>
          <div>
            <p className="font-medium text-slate-800">Kindness wall</p>
            <p className="text-sm text-slate-500">Share or read positivity</p>
          </div>
        </Link>
        <Link
          to="/wellness"
          className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:border-accent-300 hover:bg-accent-50/50 transition-colors"
        >
          <span className="text-2xl">🩺</span>
          <div>
            <p className="font-medium text-slate-800">Wellness centre</p>
            <p className="text-sm text-slate-500">Support & contacts</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
