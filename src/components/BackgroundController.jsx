import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

function getTimeOfDay() {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return 'morning';
  if (h >= 12 && h < 17) return 'afternoon';
  if (h >= 17 && h < 21) return 'evening';
  return 'night';
}

function getClubThemeFromNames(clubs) {
  if (!Array.isArray(clubs) || clubs.length === 0) return null;
  const name = (clubs[0]?.name || '').toLowerCase();
  if (name.includes('music')) return 'music';
  if (name.includes('art')) return 'art';
  if (name.includes('tech')) return 'tech';
  return null;
}

export default function BackgroundController() {
  const { user } = useAuth();
  const [timeOfDay, setTimeOfDay] = useState(getTimeOfDay);
  const [clubTheme, setClubTheme] = useState(null);

  useEffect(() => {
    const t = getTimeOfDay();
    setTimeOfDay(t);
    const id = setInterval(() => {
      const next = getTimeOfDay();
      setTimeOfDay((prev) => (next !== prev ? next : prev));
    }, 60000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!user) {
      setClubTheme(null);
      return;
    }
    let cancelled = false;
    api.get('/clubs').then(({ data }) => {
      if (!cancelled) setClubTheme(getClubThemeFromNames(data));
    }).catch(() => {
      if (!cancelled) setClubTheme(null);
    });
    return () => { cancelled = true; };
  }, [user]);

  return (
    <div
      className="uniconnect-bg-layer"
      data-time={timeOfDay}
      data-club={clubTheme || ''}
      aria-hidden="true"
    />
  );
}
