import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function Clubs() {
  const [clubs, setClubs] = useState([]);

  useEffect(() => {
    api.get('/clubs').then(({ data }) => setClubs(data)).catch(() => setClubs([]));
  }, []);

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-xl font-bold text-slate-800 mb-2">Clubs</h1>
      <p className="text-slate-600 text-sm mb-6">Campus clubs and convenors.</p>

      <div className="space-y-3">
        {clubs.length === 0 ? (
          <p className="text-slate-500 text-sm">No clubs listed yet.</p>
        ) : (
          clubs.map((club) => (
            <div
              key={club.id}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <p className="font-medium text-slate-800">{club.name}</p>
              {club.convenor_name && (
                <p className="text-sm text-slate-500 mt-1">Convenor: {club.convenor_name}</p>
              )}
              <p className="text-xs text-slate-400 mt-1">
                {new Date(club.created_at).toLocaleDateString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
