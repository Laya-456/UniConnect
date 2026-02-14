import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function MoodMeter() {
  const [meter, setMeter] = useState({ positive: 0, neutral: 0, stressed: 0, total: 0 });

  useEffect(() => {
    api.get('/mood/meter').then(({ data }) => setMeter(data)).catch(() => {});
  }, []);

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-xl font-bold text-slate-800 mb-2">Campus Mood Meter</h1>
      <p className="text-slate-600 text-sm mb-6">Today&apos;s mood distribution across campus</p>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
        {meter.total === 0 ? (
          <p className="text-slate-500 text-sm">No mood logs today yet. Be the first to log!</p>
        ) : (
          <>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-accent-600">Positive (7–10)</span>
                <span>{meter.positive}%</span>
              </div>
              <div className="h-6 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent-500 rounded-full transition-all duration-500"
                  style={{ width: `${meter.positive}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-amber-600">Neutral (4–6)</span>
                <span>{meter.neutral}%</span>
              </div>
              <div className="h-6 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all duration-500"
                  style={{ width: `${meter.neutral}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-rose-600">Stressed (1–3)</span>
                <span>{meter.stressed}%</span>
              </div>
              <div className="h-6 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-rose-500 rounded-full transition-all duration-500"
                  style={{ width: `${meter.stressed}%` }}
                />
              </div>
            </div>
            <p className="text-sm text-slate-500 pt-2 border-t border-slate-100">
              Based on {meter.total} log{meter.total !== 1 ? 's' : ''} today.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
