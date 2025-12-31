import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { UserData, UserRole } from '../types';

interface AuthContextType {
  user: UserData | null;
  userRole: UserRole;
  loading: boolean;
  signIn: (email: string, password?: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, name: string, phone: string, additionalData?: any) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  logout: () => Promise<void>;
  updateRole: (role: UserRole) => void;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [userRole, setUserRole] = useState<UserRole>('customer'); // Default role
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const fetchUserRole = async (email: string) => {
    if (email.toLowerCase() === 'breganation2@gmail.com') return 'owner';

    try {
      const { data } = await supabase
        .from('team_members')
        .select('role')
        .eq('email', email)
        .single();

      if (data?.role) return data.role as UserRole;
    } catch (e) {
      // ignore error
    }

    // Fallback to local storage or customer
    const stored = localStorage.getItem('userRole') as UserRole;
    if (stored && ['moderator', 'admin', 'owner'].includes(stored)) return stored;

    return 'customer';
  };

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata?.name,
          phone: session.user.user_metadata?.phone
        });

        const email = session.user.email?.toLowerCase();
        if (email) {
          const role = await fetchUserRole(email);
          setUserRole(role);
          if (role === 'owner') localStorage.setItem('userRole', 'owner');
        }
      }
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata?.name,
          phone: session.user.user_metadata?.phone
        });

        const email = session.user.email?.toLowerCase();
        if (email) {
          const role = await fetchUserRole(email);
          setUserRole(role);
          if (role === 'owner') localStorage.setItem('userRole', 'owner');
        }
      } else {
        setUser(null);
        setUserRole('customer');
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password?: string) => {
    if (password) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return { error };
    } else {
      const { error } = await supabase.auth.signInWithOtp({ email });
      return { error };
    }
  };

  const signUp = async (email: string, password: string, name: string, phone: string, additionalData: any = {}) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          phone,
          ...additionalData
        },
      },
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUserRole('customer');
    localStorage.removeItem('userRole');
  };

  const updateRole = (role: UserRole) => {
    setUserRole(role);
    localStorage.setItem('userRole', role);
  };

  return (
    <AuthContext.Provider value={{
      user,
      userRole,
      loading,
      signIn,
      signUp,
      signOut,
      logout: signOut,
      updateRole,
      isAuthModalOpen,
      openAuthModal: () => setIsAuthModalOpen(true),
      closeAuthModal: () => setIsAuthModalOpen(false)
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
