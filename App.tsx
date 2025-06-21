import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import HistoryPage from './pages/HistoryPage';
import WalletPage from './pages/WalletPage';
// import AdminPage from './pages/AdminPage'; // Removed
import ProfilePage from './pages/ProfilePage'; 
import MorePage from './pages/MorePage'; 
import { useAppStore } from './hooks/useAppStore';
import { FOOTER_TEXT } from './constants';


const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAppStore();
  const location = useLocation();

  if (!user?.isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <>{children}</>;
};

const App: React.FC = () => {
  const { user } = useAppStore();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen bg-[var(--kc-background)] text-[var(--kc-text-primary)]">
      {user?.isLoggedIn && <Header />}
      <main className={`flex-grow ${user?.isLoggedIn ? 'pb-20 pt-4' : ''}`}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route 
            path="/" 
            element={<ProtectedRoute><HomePage /></ProtectedRoute>} 
          />
          <Route 
            path="/history" 
            element={<ProtectedRoute><HistoryPage /></ProtectedRoute>} 
          />
          <Route 
            path="/wallet" 
            element={<ProtectedRoute><WalletPage /></ProtectedRoute>} 
          />
           {/* <Route 
            path="/admin" 
            element={<ProtectedRoute><AdminPage /></ProtectedRoute>} 
          /> */} {/* Removed Admin Route */}
          <Route 
            path="/profile" 
            element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} 
          />
          <Route 
            path="/more" 
            element={<ProtectedRoute><MorePage /></ProtectedRoute>} 
          />
          <Route path="*" element={<Navigate to={user?.isLoggedIn ? "/" : "/login"} replace />} />
        </Routes>
      </main>
      {user?.isLoggedIn && <BottomNav />}
      {user?.isLoggedIn && (
        <footer className="py-4 px-6 text-center text-xs text-[var(--kc-text-secondary)] opacity-70 border-t border-[var(--kc-border)] bg-[var(--kc-surface)]">
            {FOOTER_TEXT}
        </footer>
      )}
    </div>
  );
};

export default App;