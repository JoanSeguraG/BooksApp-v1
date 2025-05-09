import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { Session } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
  session: Session | null;
  initializing: boolean;
  loading: boolean;
  error: string | null;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (username: string, telefono: string) => Promise<void>;  // Agregar esta línea
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      console.log('Checking session...');
      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Error fetching session:', error.message);
          setError(error.message);
        }

        if (session) {
          console.log('Session from Supabase:', session);
          setSession(session);
          await AsyncStorage.setItem('session', JSON.stringify(session));
        } else {
          const savedSession = await AsyncStorage.getItem('session');
          if (savedSession) {
            console.log('Session loaded from AsyncStorage:', savedSession);
            setSession(JSON.parse(savedSession));
          } else {
            console.log('No session found in AsyncStorage');
          }
        }
      } catch (err) {
        console.error('Unexpected error in checkSession:', err);
        setError('Error desconocido al verificar la sesión');
      } finally {
        setInitializing(false);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('Auth state changed:', session);
      setSession(session);
      if (session) {
        AsyncStorage.setItem('session', JSON.stringify(session));
        console.log('Session saved to AsyncStorage');
      } else {
        AsyncStorage.removeItem('session');
        console.log('Session removed from AsyncStorage');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, username: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { username } },
      });

      if (error) throw error;

      console.log('User signed up:', data);
      if (data?.session) {
        console.log('Saving session after sign-up...');
        await AsyncStorage.setItem('session', JSON.stringify(data.session));
        setSession(data.session);
      }
    } catch (error) {
      console.error('Sign-up error:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido durante el registro');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) throw error;

      setSession(data?.session ?? null);
      if (data?.session) {
        console.log('Session saved to AsyncStorage after login');
        await AsyncStorage.setItem('session', JSON.stringify(data.session));
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido durante el inicio de sesión');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setSession(null);
      await AsyncStorage.removeItem('session');
      console.log('Session removed from AsyncStorage after logout');
    } catch (error) {
      console.error('Logout error:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido al cerrar sesión');
    }
  };
  
  const updateUserProfile = async (username: string, telefono: string) => {
    if (!session?.user || !session.user.id) {
      setError('No se pudo actualizar el perfil, el id de usuario no está disponible.');
      return;
    }
  
    setLoading(true);
    setError(null);
  
    try {
      // Asegúrate de que los datos sean válidos y los campos estén definidos
      const { data, error } = await supabase
        .from('users') // Asumiendo que tienes una tabla 'users' donde guardas los datos
        .update({
          username,
          telefono
        })
        .eq('id', session.user.id); // Actualizamos solo al usuario correspondiente
  
      if (error) {
        throw error;
      }
  
      // Si la actualización fue exitosa, actualiza la sesión con los nuevos datos
      setSession((prevSession) => {
        if (prevSession) {
          return {
            ...prevSession,
            user: {
              ...prevSession.user,
              user_metadata: {
                ...prevSession.user.user_metadata,
                username,
                telefono,
              },
            },
          };
        }
        return prevSession;
      });
  
      console.log('Perfil actualizado con éxito');
    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido al actualizar el perfil');
    } finally {
      setLoading(false);
    }
  };
  
  

  return (
    <AuthContext.Provider
      value={{
        session,
        initializing,
        loading,
        error,
        signUp,
        login,
        logout,
        updateUserProfile 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
  
};
