import { useState, useEffect } from 'react';
import api from '../api/axios';

const WELLNESS_LINKS = {
  mindfulness: 'https://www.youtube.com/results?search_query=guided+mindfulness',
  groups: 'https://www.meetup.com/find/?keywords=mental%20health%20support',
  workshops: 'https://www.eventbrite.com/d/online/mental-health-workshop/',
};

function openWellnessLink(type) {
  const url = WELLNESS_LINKS[type] || 'https://www.google.com/search?q=wellness+center';
  window.open(url, '_blank');
}

export default function Wellness() {
  const [info, setInfo] = useState(null);
  const [suggestion, setSuggestion] = useState(null);

  useEffect(() => {
    api.get('/wellness').then(({ data }) => setInfo(data)).catch(() => {});
    api.get('/wellness/suggestion').then(({ data }) => setSuggestion(data)).catch(() => {});
  }, []);

  if (!info) {
    return (
      <div className="max-w-2xl mx-auto">
        <p className="text-slate-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="wellness-page-wrap max-w-4xl mx-auto">
      {suggestion?.showSuggestion && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 mb-6">
          <p className="text-amber-800 text-sm font-medium">{suggestion.message}</p>
        </div>
      )}

      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-3">🏥 Wellness Center</h1>
        <p className="text-gray-600 text-base md:text-lg">Your one-stop hub for campus wellness resources, workshops, and support services.</p>
      </div>

      <div className="flex flex-wrap gap-6">
        <div className="wellness-card flex-1 min-w-[240px] rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="text-3xl mb-2">🧘‍♀️</div>
          <h3 className="text-xl font-semibold mb-2 text-gray-800">Mindfulness & Yoga</h3>
          <p className="text-gray-600 mb-4">Join guided sessions to reduce stress and improve focus.</p>
          <button
            type="button"
            className="w-full sm:w-auto px-4 py-2.5 rounded-lg font-medium text-white bg-emerald-600 hover:bg-emerald-700 transition-colors"
            data-wellness-link="mindfulness"
            onClick={() => openWellnessLink('mindfulness')}
          >
            View Schedule
          </button>
        </div>
        <div className="wellness-card flex-1 min-w-[240px] rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="text-3xl mb-2">👥</div>
          <h3 className="text-xl font-semibold mb-2 text-gray-800">Support Groups</h3>
          <p className="text-gray-600 mb-4">Peer-led groups for anxiety, burnout, and study stress.</p>
          <button
            type="button"
            className="w-full sm:w-auto px-4 py-2.5 rounded-lg font-medium text-white bg-teal-600 hover:bg-teal-700 transition-colors"
            data-wellness-link="groups"
            onClick={() => openWellnessLink('groups')}
          >
            Explore Groups
          </button>
        </div>
        <div className="wellness-card flex-1 min-w-[240px] rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="text-3xl mb-2">📅</div>
          <h3 className="text-xl font-semibold mb-2 text-gray-800">Workshops & Events</h3>
          <p className="text-gray-600 mb-4">Time management, sleep hygiene, and resilience workshops.</p>
          <button
            type="button"
            className="w-full sm:w-auto px-4 py-2.5 rounded-lg font-medium text-white bg-cyan-600 hover:bg-cyan-700 transition-colors"
            data-wellness-link="workshops"
            onClick={() => openWellnessLink('workshops')}
          >
            Upcoming Events
          </button>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">On-Campus Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="wellness-resource-box rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h4 className="font-semibold text-emerald-700 mb-1">Counseling Center</h4>
            <p className="text-gray-600 text-sm">
              {info.counselling.name} • Email: {info.counselling.email} • Phone: {info.counselling.phone} • Hours: {info.counselling.hours}
            </p>
          </div>
          <div className="wellness-resource-box rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h4 className="font-semibold text-cyan-700 mb-1">24/7 Crisis & Health</h4>
            <p className="text-gray-600 text-sm">
              {info.emergency.name} • Phone: {info.emergency.phone} • {info.emergency.text}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
