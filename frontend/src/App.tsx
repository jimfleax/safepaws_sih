import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import { SetupProfile } from './pages/SetupProfile';
import { CustomCursor } from './components/CustomCursor';
import { useAuthStore } from './store/authStore';

const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user } = useAuthStore();
  
  if (isAuthenticated && user?.profileCompleted) {
    return <Navigate to="/dashboard" replace />;
  }
  if (isAuthenticated && !user?.profileCompleted) {
    return <Navigate to="/setup-profile" replace />;
  }
  return <>{children}</>;
};

const SetupProfileRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user } = useAuthStore();
  
  if (!isAuthenticated || user?.profileCompleted) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

const DashboardRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  if (isAuthenticated && !user?.profileCompleted) {
    return <Navigate to="/setup-profile" replace />;
  }
  return <>{children}</>;
};

export default function App() {
  return (
    <BrowserRouter>
      <CustomCursor />
      <Routes>
        <Route path="/" element={<AuthRoute><LandingPage /></AuthRoute>} />
        <Route path="/setup-profile" element={<SetupProfileRoute><SetupProfile /></SetupProfileRoute>} />
        <Route path="/dashboard" element={<DashboardRoute><Dashboard /></DashboardRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
