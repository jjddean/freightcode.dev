import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import SimpleLayout from './components/SimpleLayout';
import NotificationSystem, { useNotifications } from './components/NotificationSystem';
import Dashboard from './pages/Dashboard';
import UsersPage from './pages/UsersPage';
import ShipmentsPage from './pages/ShipmentsPage';
import CompliancePage from './pages/CompliancePage';
import PaymentsPage from './pages/PaymentsPage';
import LogsPage from './pages/LogsPage';
import ManualPage from './pages/ManualPage';
import SupportPage from './pages/SupportPage';
import SettingsPage from './pages/SettingsPage';

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

function App() {
  // Temporarily remove notifications to test
  // const { notifications, removeNotification } = useNotifications();

  // For demo purposes, show the dashboard even with placeholder key
  if (!clerkPubKey || clerkPubKey === 'pk_test_placeholder_key') {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SimpleLayout><Dashboard /></SimpleLayout>} />
          <Route path="/dashboard" element={<SimpleLayout><Dashboard /></SimpleLayout>} />
          <Route path="/users" element={<SimpleLayout><UsersPage /></SimpleLayout>} />
          <Route path="/shipments" element={<SimpleLayout><ShipmentsPage /></SimpleLayout>} />
          <Route path="/compliance" element={<SimpleLayout><CompliancePage /></SimpleLayout>} />
          <Route path="/payments" element={<SimpleLayout><PaymentsPage /></SimpleLayout>} />
          <Route path="/support" element={<SimpleLayout><SupportPage /></SimpleLayout>} />
          <Route path="/logs" element={<SimpleLayout><LogsPage /></SimpleLayout>} />
          <Route path="/manual" element={<SimpleLayout><ManualPage /></SimpleLayout>} />
          <Route path="/settings" element={<SimpleLayout><SettingsPage /></SimpleLayout>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    );
  }

  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <BrowserRouter>
        <SignedIn>
          <Routes>
            {/* Main dashboard - homepage */}
            <Route path="/" element={<SimpleLayout><Dashboard /></SimpleLayout>} />
            <Route path="/dashboard" element={<SimpleLayout><Dashboard /></SimpleLayout>} />
            <Route path="/users" element={<SimpleLayout><UsersPage /></SimpleLayout>} />
            <Route path="/shipments" element={<SimpleLayout><ShipmentsPage /></SimpleLayout>} />
            <Route path="/compliance" element={<SimpleLayout><CompliancePage /></SimpleLayout>} />
            <Route path="/payments" element={<SimpleLayout><PaymentsPage /></SimpleLayout>} />
            <Route path="/support" element={<SimpleLayout><SupportPage /></SimpleLayout>} />
            <Route path="/logs" element={<SimpleLayout><LogsPage /></SimpleLayout>} />
            <Route path="/manual" element={<SimpleLayout><ManualPage /></SimpleLayout>} />
            <Route path="/settings" element={<SimpleLayout><SettingsPage /></SimpleLayout>} />

            {/* Fallback to dashboard */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </SignedIn>

        <SignedOut>
          <RedirectToSignIn />
        </SignedOut>

        {/* Global Notification System */}
        <NotificationSystem
          notifications={notifications}
          onRemove={removeNotification}
        />
      </BrowserRouter>
    </ClerkProvider>
  );
}

export default App;
