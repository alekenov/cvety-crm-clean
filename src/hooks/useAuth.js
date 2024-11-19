import { useState, createContext, useContext } from 'react';

const AuthContext = createContext({});

const TEST_CREDENTIALS = {
  email: 'admin@cvety-crm.kz',
  password: 'Admin123!'
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const signIn = async (email, password) => {
    try {
      if (email === TEST_CREDENTIALS.email && password === TEST_CREDENTIALS.password) {
        const user = { email, role: 'admin' };
        setUser(user);
        return { data: { user }, error: null };
      }
      throw new Error('Неверный email или пароль');
    } catch (error) {
      return { data: null, error };
    }
  };

  const signOut = async () => {
    try {
      setUser(null);
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const value = {
    user,
    signIn,
    signOut
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
