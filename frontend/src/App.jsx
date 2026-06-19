import { useEffect } from 'react';
import { Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import HistoryPage from './pages/HistoryPage';
import SafeUsePage from './pages/SafeUsePage';
import OutreachPage from './pages/OutreachPage';

function Loader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-navy-50 dark:bg-[#0a1628]">
      <div className="w-10 h-10 rounded-full border-4 border-navy-200 border-t-navy-600 animate-spin" />
    </div>
  );
}

function RootLayout() {
  const location = useLocation();
  return (
    <div className="min-h-screen flex flex-col bg-navy-50 dark:bg-[#0a1628] relative overflow-x-hidden">
      <div className="breath-bg" aria-hidden="true" />
      <Navbar />
      {/* key by pathname so each tab change re-triggers the liquid-glass reveal */}
      <main key={location.pathname} className="flex-1 flex flex-col relative z-10 route-glass-enter">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

function ProtectedRoute({ children }) {
  const { user, authLoading } = useApp();
  if (authLoading || user === undefined) return <Loader />;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  const { user, authLoading } = useApp();

  // Dark mode restore
  useEffect(() => {
    if (localStorage.getItem('bb-dark') === '1') {
      document.documentElement.classList.add('dark');
    }
  }, []);

  if (authLoading || user === undefined) return <Loader />;

  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/safe-use" element={<SafeUsePage />} />
        <Route path="/outreach" element={<OutreachPage />} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/history" element={<ProtectedRoute><HistoryPage /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
