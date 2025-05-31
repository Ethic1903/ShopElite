import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  user: string | null;
  login: (email: string, password: string) => boolean;
  register: (email: string, password: string) => boolean;
  logout: () => void;
}

interface UserRecord {
  email: string;
  password: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_KEY = 'users';

function getUsers(): UserRecord[] {
  return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
}

function setUsers(users: UserRecord[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('userEmail');
    if (savedUser) setUser(savedUser);
  }, []);

  const login = (email: string, password: string) => {
    const users = getUsers();
    const found = users.find(u => u.email === email && u.password === password);
    if (found) {
      setUser(email);
      localStorage.setItem('userEmail', email);
      return true;
    }
    return false;
  };

  const register = (email: string, password: string) => {
    let users = getUsers();
    if (users.find(u => u.email === email)) {
      return false; // already registered
    }
    users.push({ email, password });
    setUsers(users);
    setUser(email);
    localStorage.setItem('userEmail', email);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userEmail');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
