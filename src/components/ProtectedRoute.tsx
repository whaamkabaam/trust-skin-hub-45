import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAdminStatus = async (userId: string) => {
      console.log('Checking admin status for user:', userId);
      try {
        const { data, error } = await supabase.rpc('is_admin');
        console.log('Admin status result:', { data, error });
        if (error) {
          console.error('Error checking admin status:', error);
          setIsAdmin(false);
        } else {
          setIsAdmin(data);
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', { event, session: !!session });
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Use setTimeout to defer the admin check and prevent deadlock
          setTimeout(() => {
            checkAdminStatus(session.user.id);
          }, 0);
        } else {
          setIsAdmin(null);
        }
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', { session: !!session });
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        // Use setTimeout to defer the admin check and prevent deadlock
        setTimeout(() => {
          checkAdminStatus(session.user.id);
        }, 0);
      } else {
        setIsAdmin(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!session || !user) {
    return <Navigate to="/auth" replace />;
  }

  if (isAdmin === false) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-4">You don't have admin privileges to access this area.</p>
          <p className="text-sm text-muted-foreground">Contact an administrator for access.</p>
        </div>
      </div>
    );
  }

  if (isAdmin === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <>{children}</>;
}