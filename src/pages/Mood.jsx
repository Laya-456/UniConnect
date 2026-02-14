import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Mood() {
  const { updateUser } = useAuth();
  const [moodValue, setMoodValue] = useState(5);
  const [note, setNote] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showGlow, setShowGlow] = useState(false);

  const loadHistory = () => {
    api.get('/mood').then(({ data }) => setHistory(data)).catch(() => {});
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSubmitted(false);
    try {
      await api.post('/mood', { mood_value: moodValue, note: note.trim() || undefined });
      setNote('');
      setSubmitted(true);
      setShowGlow(true);
      loadHistory();
      api.get('/users/me').then(({ data }) => updateUser({ streak_count: data.streak_count })).catch(() => {});
      setTimeout(() => setShowGlow(false), 1000);
    } catch (err) {
      // error handled by interceptor or show toast
    } finally {
      setLoading(false);
    }
  };

  const label = (v) => {
    if (v <= 3) return 'Stressed';
    if (v <= 6) return 'Neutral';
    return 'Positive';
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-xl font-bold text-slate-800 mb-4">Mood Tracker</h1>

      <div className={`mood-card-wrap rounded-2xl border border-slate-200 bg-white p-6 shadow-sm mb-6 ${showGlow ? 'mood-card-glow' : ''}`}>
        <h2 className="text-lg font-semibold text-slate-800 mb-4">How are you feeling?</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Mood (1 = low, 10 = great)
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setMoodValue(n)}
                  className={`btn-micro w-10 h-10 rounded-lg font-medium transition-colors ${
                    moodValue === n
                      ? 'bg-primary-500 text-white btn-micro-primary'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
            <p className="text-sm text-slate-500 mt-1">{label(moodValue)}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Note (optional)</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Anything you'd like to note..."
            />
          </div>
          {submitted && (
            <p className="text-sm text-accent-600 font-medium">Mood logged successfully.</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="btn-micro btn-micro-primary w-full py-2.5 bg-primary-500 text-white font-medium rounded-lg hover:bg-primary-600 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Log mood'}
          </button>
        </form>
      </div>

      <h2 className="text-lg font-semibold text-slate-800 mb-3">Your mood history</h2>
      <div className="space-y-2">
        {history.length === 0 ? (
          <p className="text-slate-500 text-sm">No mood entries yet.</p>
        ) : (
          history.map((entry) => (
            <div
              key={entry.id}
              className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`inline-flex w-10 h-10 items-center justify-center rounded-lg font-bold text-white ${
                    entry.mood_value <= 3
                      ? 'bg-rose-500'
                      : entry.mood_value <= 6
                        ? 'bg-amber-500'
                        : 'bg-accent-500'
                  }`}
                >
                  {entry.mood_value}
                </span>
                <div>
                  <p className="font-medium text-slate-800">{label(entry.mood_value)}</p>
                  {entry.note && <p className="text-sm text-slate-600">{entry.note}</p>}
                </div>
              </div>
              <span className="text-xs text-slate-500">
                {new Date(entry.created_at).toLocaleDateString()}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
