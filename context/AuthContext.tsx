import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '../types';
import { USERS } from '../data';

interface AuthContextType {
  user: User | null;
  allUsers: User[]; // Exposed for Admin
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  addUser: (user: User) => void; // Admin function
  deleteUser: (id: string) => void; // Admin function
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children?: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userList, setUserList] = useState<User[]>(USERS);

  const login = async (email: string, password: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const foundUser = userList.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (foundUser) {
      setUser(foundUser);
      return true;
    }
    return false;
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
     await new Promise(resolve => setTimeout(resolve, 800));
     const exists = userList.find(u => u.email.toLowerCase() === email.toLowerCase());
     if (exists) return false;

     const newUser: User = {
         id: Math.random().toString(36).substr(2, 9),
         name,
         email,
         role: 'Customer',
         status: 'Active',
         lastLogin: 'Just now',
         avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=135bec&color=fff`
     };

     setUserList([...userList, newUser]);
     setUser(newUser);
     return true;
  };

  const logout = () => {
    setUser(null);
  };

  // Admin functions
  const addUser = (newUser: User) => {
    setUserList(prev => [...prev, newUser]);
  };

  const deleteUser = (id: string) => {
    setUserList(prev => prev.filter(u => u.id !== id));
  };

  return (
    <AuthContext.Provider value={{ user, allUsers: userList, isAuthenticated: !!user, login, register, logout, addUser, deleteUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};