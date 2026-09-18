import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { usePetStore } from './store/petStore';
import { CustomCursor } from './components/CustomCursor';

// Lazy loaded routes for chunk splitting
const LandingPage = lazy(() => import('./pages/LandingPage'));
const SetupProfile = lazy(() => import('./pages/SetupProfile').then(module => ({ default: module.SetupProfile })));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const NewPet = lazy(() => import('./pages/pets/NewPet'));
const PetDetail = lazy(() => import('./pages/pets/PetDetail'));
const PublicPetProfile = lazy(() => import('./pages/pets/PublicPetProfile'));
const Scan = lazy(() => import('./pages/Scan'));
const Alerts = lazy(() => import('./pages/Alerts'));
const Community = lazy(() => import('./pages/Community'));
const NotFound = lazy(() => import('./pages/NotFound'));



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

// A fallback loader for Suspense boundaries
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#FAF6F0]">
    <div className="w-8 h-8 border-4 border-[#DE6828] border-t-transparent rounded-full animate-spin"></div>
  </div>
);

export default function App() {
  const hydrate = usePetStore(state => state.hydrate);
  const { isInitializing, checkSession } = useAuthStore();
  
  React.useEffect(() => {
    hydrate();
  }, [hydrate]);

  React.useEffect(() => {
    checkSession();
  }, [checkSession]);

  if (isInitializing) {
    return <PageLoader />;
  }

  return (
    <BrowserRouter>
      <CustomCursor />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public / Marketing */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Public Finders / Tools */}
          <Route path="/public/pets/:petId" element={<PublicPetProfile />} />
          <Route path="/scan" element={<Scan />} />

          {/* Onboarding */}
          <Route path="/setup-profile" element={<SetupProfileRoute><SetupProfile /></SetupProfileRoute>} />
          
          {/* Authenticated App Shell */}
          <Route path="/dashboard" element={<DashboardRoute><Dashboard /></DashboardRoute>} />
          <Route path="/pets/new" element={<DashboardRoute><NewPet /></DashboardRoute>} />
          <Route path="/pets/:petId" element={<DashboardRoute><PetDetail /></DashboardRoute>} />
          <Route path="/alerts" element={<DashboardRoute><Alerts /></DashboardRoute>} />
          <Route path="/community" element={<DashboardRoute><Community /></DashboardRoute>} />

          {/* Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
