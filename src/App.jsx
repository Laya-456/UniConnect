import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import Layout from './components/Layout';
import BackgroundController from './components/BackgroundController';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Mood from './pages/Mood';
import MoodMeter from './pages/MoodMeter';
import Match from './pages/Match';
import Chat from './pages/Chat';
import Kindness from './pages/Kindness';
import Wellness from './pages/Wellness';
import Clubs from './pages/Clubs';
import Profile from './pages/Profile';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function PublicOnly({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  if (user) return <Navigate to="/" replace />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<PublicOnly><Login /></PublicOnly>} />
      <Route path="/signup" element={<PublicOnly><Signup /></PublicOnly>} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route index element={<Home />} />
        <Route path="mood" element={<Mood />} />
        <Route path="mood-meter" element={<MoodMeter />} />
        <Route path="match" element={<Match />} />
        <Route path="chat" element={<Chat />} />
        <Route path="chat/:userId" element={<Chat />} />
        <Route path="kindness" element={<Kindness />} />
        <Route path="wellness" element={<Wellness />} />
        <Route path="clubs" element={<Clubs />} />
        <Route path="profile" element={<Profile />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function ThemeWrapper() {
  const { theme } = useTheme();
  return (
    <div data-week-theme={theme}>
      <BackgroundController />
      <div className="relative z-10 min-h-screen">
        <AppRoutes />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ThemeWrapper />
      </AuthProvider>
    </ThemeProvider>
  );
}
