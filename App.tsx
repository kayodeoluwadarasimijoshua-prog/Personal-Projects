import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { SignUp } from '@/components/SignUp';
import { Login } from '@/components/Login';
import { EmailVerification } from '@/components/EmailVerification';
import { Dashboard } from '@/components/Dashboard';
import { SetupGuide } from '@/components/SetupGuide';

function AppContent() {
  const { user, isLoading, isConfigured, signOut } = useAuth();
  const [view, setView] = useState<'login' | 'signup' | 'verify'>('login');
  const [pendingEmail, setPendingEmail] = useState('');

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  // If Supabase is not set up, show the guide
  if (!isConfigured) return <SetupGuide onSkipToDemo={() => {}} />;

  // If logged in, show dashboard
  if (user) return <Dashboard onLogout={signOut} />;

  return (
    <AnimatePresence mode="wait">
      {view === 'login' && (
        <motion.div key="login" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <Login onSwitchToSignUp={() => setView('signup')} onLoginSuccess={() => {}} />
        </motion.div>
      )}
      {view === 'signup' && (
        <motion.div key="signup" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <SignUp 
            onSwitchToLogin={() => setView('login')} 
            onVerificationNeeded={(email) => { setPendingEmail(email); setView('verify'); }} 
          />
        </motion.div>
      )}
      {view === 'verify' && (
        <motion.div key="verify" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <EmailVerification 
            email={pendingEmail} 
            onVerified={() => setView('login')} 
            onBack={() => setView('signup')} 
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}