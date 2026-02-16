import React, { createContext, useContext, useState, useCallback } from 'react';

export interface DemoUser {
  name: string;
  email: string;
  password: string;
}

export interface DemoPendingUser {
  name: string;
  email: string;
  password: string;
  verificationCode: string;
}

interface DemoAuthContextType {
  users: DemoUser[];
  currentUser: DemoUser | null;
  pendingUser: DemoPendingUser | null;
  startRegistration: (user: Omit<DemoUser, 'verified'>) => { success: boolean; message: string; code?: string };
  completeRegistration: () => { success: boolean; message: string };
  regenerateCode: () => string;
  clearPending: () => void;
  loginUser: (email: string, password: string) => { success: boolean; message: string };
  logoutUser: () => void;
}

const generateCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const DemoAuthContext = createContext<DemoAuthContextType | undefined>(undefined);

export const DemoAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<DemoUser[]>([]);
  const [currentUser, setCurrentUser] = useState<DemoUser | null>(null);
  const [pendingUser, setPendingUser] = useState<DemoPendingUser | null>(null);

  const startRegistration = useCallback((user: Omit<DemoUser, 'verified'>) => {
    const exists = users.find(u => u.email.toLowerCase() === user.email.toLowerCase());
    if (exists) {
      return { success: false, message: 'An account with this email already exists.' };
    }
    const code = generateCode();
    setPendingUser({
      name: user.name,
      email: user.email,
      password: user.password,
      verificationCode: code,
    });
    return { success: true, message: 'Verification code sent!', code };
  }, [users]);

  const completeRegistration = useCallback(() => {
    if (!pendingUser) {
      return { success: false, message: 'No pending registration found.' };
    }
    const newUser: DemoUser = {
      name: pendingUser.name,
      email: pendingUser.email,
      password: pendingUser.password,
    };
    setUsers(prev => [...prev, newUser]);
    setPendingUser(null);
    return { success: true, message: 'Account created successfully!' };
  }, [pendingUser]);

  const regenerateCode = useCallback(() => {
    const newCode = generateCode();
    setPendingUser(prev => prev ? { ...prev, verificationCode: newCode } : null);
    return newCode;
  }, []);

  const clearPending = useCallback(() => {
    setPendingUser(null);
  }, []);

  const loginUser = useCallback((email: string, password: string) => {
    const user = users.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (user) {
      setCurrentUser(user);
      return { success: true, message: `Welcome back, ${user.name}!` };
    }
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, message: 'Incorrect password. Please try again.' };
    }
    return { success: false, message: 'No account found with this email. Please sign up first.' };
  }, [users]);

  const logoutUser = useCallback(() => {
    setCurrentUser(null);
  }, []);

  return (
    <DemoAuthContext.Provider
      value={{
        users,
        currentUser,
        pendingUser,
        startRegistration,
        completeRegistration,
        regenerateCode,
        clearPending,
        loginUser,
        logoutUser,
      }}
    >
      {children}
    </DemoAuthContext.Provider>
  );
};

export const useDemoAuth = () => {
  const context = useContext(DemoAuthContext);
  if (!context) throw new Error('useDemoAuth must be used within DemoAuthProvider');
  return context;
};
