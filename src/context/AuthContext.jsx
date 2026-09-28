import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('halo_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [pendingRegistration, setPendingRegistration] = useState(() => {
    const saved = localStorage.getItem('halo_pending_reg');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('halo_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('halo_user');
  };

  const savePendingReg = (regData) => {
    setPendingRegistration(regData);
    if (regData) {
      localStorage.setItem('halo_pending_reg', JSON.stringify(regData));
    } else {
      localStorage.removeItem('halo_pending_reg');
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, pendingRegistration, savePendingReg }}>
      {children}
    </AuthContext.Provider>
  );
};
