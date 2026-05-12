import React, { createContext, useContext, type ReactNode } from 'react';
import { useSession, signIn, signOut } from '@/lib/auth-client';

interface AuthContextValue {
  session: ReturnType<typeof useSession>['data'];
  isLoading: boolean;
  error: ReturnType<typeof useSession>['error'];
  signIn: typeof signIn;
  signOut: typeof signOut;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, isPending: isLoading, error } = useSession();

  return (
    <AuthContext.Provider value={{ session, isLoading, error, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
