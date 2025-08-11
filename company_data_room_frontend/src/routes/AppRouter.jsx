import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { AuthProvider } from '../modules/auth/AuthContext';
import { InvestorDashboard } from '../modules/dashboard/InvestorDashboard';
import { FounderDashboard } from '../modules/dashboard/FounderDashboard';
import { DocumentList } from '../modules/documents/DocumentList';
import { DocumentViewer } from '../modules/documents/DocumentViewer';
import { NDAPage } from '../modules/nda/NDAPage';
import { NotificationsCenter } from '../modules/notifications/NotificationsCenter';
import { AdminPanel } from '../modules/admin/AdminPanel';
import { TierGuard } from '../modules/common/TierGuard';
import { SignInMagicLink } from '../modules/auth/SignInMagicLink';
import { RoleLogin } from '../modules/auth/RoleLogin';
import { AdminLogin } from '../modules/auth/AdminLogin';
import { Signup } from '../modules/auth/Signup';
import AuthCallback from '../modules/auth/AuthCallback';
import AuthError from '../modules/auth/AuthError';

/**
 * PUBLIC_INTERFACE
 * AppRouter defines all application routes and composes providers and layout.
 */
export function AppRouter({ onToggleTheme }) {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Layout onToggleTheme={onToggleTheme}>
          <Routes>
            <Route path="/" element={<InvestorDashboard />} />
            <Route path="/dashboard" element={
              <TierGuard minTier="qualified">
                <FounderDashboard />
              </TierGuard>
            } />
            <Route path="/documents" element={<DocumentList />} />
            <Route path="/documents/:id" element={<DocumentViewer />} />
            <Route path="/nda" element={<NDAPage />} />
            <Route path="/notifications" element={
              <TierGuard minTier="qualified">
                <NotificationsCenter />
              </TierGuard>
            } />
            <Route path="/admin" element={
              <TierGuard minTier="qualified">
                <AdminPanel />
              </TierGuard>
            } />
            <Route path="/auth" element={<RoleLogin />} />
            <Route path="/auth/login" element={<RoleLogin />} />
            <Route path="/auth/admin" element={<AdminLogin />} />
            <Route path="/auth/signup" element={<Signup />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/auth/error" element={<AuthError />} />
            <Route path="*" element={<div className="card">Not Found</div>} />
          </Routes>
        </Layout>
      </AuthProvider>
    </BrowserRouter>
  );
}
