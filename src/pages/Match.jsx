import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const DEEP_CONNECT_PROMPT =
  "Before you start chatting, take a moment to share one thing you're grateful for today, or one intention you have for this conversation.";

export default function Match() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('interest');
  const [interestMatch, setInterestMatch] = useState([]);
  const [moodMatch, setMoodMatch] = useState([]);
  const [interests, setInterests] = useState('');
  const [savingInterests, setSavingInterests] = useState(false);
  const [deepConnectPartner, setDeepConnectPartner] = useState(null);
  const [deepResponse, setDeepResponse] = useState('');
  const [savingDeep, setSavingDeep] = useState(false);

  const loadInterest = () => {
    api.get('/users/match/interest').then(({ data }) => setInterestMatch(data)).catch(() => {});
  };
  const loadMood = () => {
    api.get('/users/match/mood').then(({ data }) => setMoodMatch(data)).catch(() => {});
  };

  useEffect(() => {
    api.get('/users/me').then(({ data }) => setInterests(data.interests || '')).catch(() => {});
    loadInterest();
    loadMood();
  }, []);

  const saveInterests = async () => {
    setSavingInterests(true);
    try {
      await api.put('/users/interests', { interests });
      loadInterest();
    } finally {
      setSavingInterests(false);
    }
  };

  const startDeepConnect = (partner) => {
    setDeepConnectPartner(partner);
    setDeepResponse('');
  };

  const submitDeepConnect = async () => {
    if (!deepConnectPartner || !deepResponse.trim()) return;
    const partnerId = deepConnectPartner.id;
    setSavingDeep(true);
    try {
      await api.post('/deep-connect', { partner_id: partnerId, response: deepResponse.trim() });
      setDeepConnectPartner(null);
      setDeepResponse('');
      navigate(`/chat/${partnerId}`);
    } finally {
      setSavingDeep(false);
    }
  };

  const list = tab === 'interest' ? interestMatch : moodMatch;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-xl font-bold text-slate-800 mb-4">Connect</h1>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm mb-6">
        <h2 className="text-sm font-medium text-slate-700 mb-2">Your interests (for matching)</h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
            className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="e.g. music, sports, coding"
          />
          <button
            onClick={saveInterests}
            disabled={savingInterests}
            className="btn-micro btn-micro-primary px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50"
          >
            Save
          </button>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setTab('interest')}
          type="button"
          className={`btn-micro px-4 py-2 rounded-lg font-medium ${
            tab === 'interest' ? 'bg-primary-500 text-white btn-micro-primary' : 'bg-slate-100 text-slate-600'
          }`}
        >
          By interest
        </button>
        <button
          onClick={() => setTab('mood')}
          type="button"
          className={`btn-micro px-4 py-2 rounded-lg font-medium ${
            tab === 'mood' ? 'bg-primary-500 text-white btn-micro-primary' : 'bg-slate-100 text-slate-600'
          }`}
        >
          By mood
        </button>
      </div>

      <div className="space-y-3">
        {list.length === 0 ? (
          <p className="text-slate-500 text-sm">
            {tab === 'interest'
              ? 'Add interests and save to find matches, or no one with similar interests yet.'
              : 'Log your mood first to find people with similar mood.'}
          </p>
        ) : (
          list.map((u) => (
            <div
              key={u.id}
              className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div>
                <p className="font-medium text-slate-800">{u.full_name}</p>
                <p className="text-sm text-slate-500">
                  {tab === 'interest' ? (u.interests || '—') : `Mood: ${u.mood_value}`}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => startDeepConnect(u)}
                  className="btn-micro btn-micro-accent px-3 py-1.5 text-sm bg-accent-500 text-white rounded-lg hover:bg-accent-600"
                >
                  Deep connect
                </button>
                <Link
                  to={`/chat/${u.id}`}
                  className="btn-micro btn-micro-primary inline-block px-3 py-1.5 text-sm bg-primary-500 text-white rounded-lg hover:bg-primary-600"
                >
                  Chat
                </Link>
              </div>
            </div>
          ))
        )}
      </div>

      {deepConnectPartner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <h3 className="font-semibold text-slate-800 mb-2">Deep Connect with {deepConnectPartner.full_name}</h3>
            <p className="text-slate-600 text-sm mb-4">{DEEP_CONNECT_PROMPT}</p>
            <textarea
              value={deepResponse}
              onChange={(e) => setDeepResponse(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 mb-4"
              placeholder="Your response..."
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => { setDeepConnectPartner(null); setDeepResponse(''); }}
                className="btn-micro flex-1 py-2 border border-slate-300 rounded-lg text-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={submitDeepConnect}
                disabled={savingDeep || !deepResponse.trim()}
                className="btn-micro btn-micro-accent flex-1 py-2 bg-accent-500 text-white rounded-lg hover:bg-accent-600 disabled:opacity-50"
              >
                Save & open chat
              </button>
            </div>
            <Link
              to={`/chat/${deepConnectPartner.id}`}
              className="block mt-2 text-center text-sm text-primary-600 hover:underline"
            >
              Skip and go to chat →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
