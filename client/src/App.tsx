import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { LockScreenModal } from './components/LockScreenModal';

import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProtectedAppsPage } from './pages/ProtectedAppsPage';
import { AddAppPage } from './pages/AddAppPage';
import { SecurityLogsPage } from './pages/SecurityLogsPage';
import { AISecurityAdvisorPage } from './pages/AISecurityAdvisorPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { AccountPage } from './pages/AccountPage';
import { PrivacyCenterPage } from './pages/PrivacyCenterPage';
import { TrustCenterPage } from './pages/TrustCenterPage';
import { NotFoundPage } from './pages/NotFoundPage';

const AuthenticatedLayout: React.FC = () => {
  const { activeLockModalApp, closeLockModal } = useAuth();

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col">
      <Navbar />
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto max-w-full">
          <Outlet />
        </main>
      </div>

      {activeLockModalApp && (
        <LockScreenModal
          app={activeLockModalApp}
          onClose={closeLockModal}
        />
      )}
    </div>
  );
};

export const AppContent: React.FC = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* App Workspace Routes */}
      <Route element={<AuthenticatedLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/protected-apps" element={<ProtectedAppsPage />} />
        <Route path="/add-app" element={<AddAppPage />} />
        <Route path="/security-logs" element={<SecurityLogsPage />} />
        <Route path="/ai-advisor" element={<AISecurityAdvisorPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/privacy-center" element={<PrivacyCenterPage />} />
        <Route path="/trust-center" element={<TrustCenterPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
