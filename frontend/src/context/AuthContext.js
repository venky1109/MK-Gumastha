import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // declared and will be used

  useEffect(() => {
    const token = localStorage.getItem('pos_token');
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        setUser({ ...decoded, token });
      } catch (err) {
        console.error('Invalid token format:', err);
        localStorage.removeItem('pos_token');
      }
    }
    setLoading(false); // ✅ resolve the warning here
  }, []);

  const login = (token) => {
    localStorage.setItem('pos_token', token);
    const decoded = JSON.parse(atob(token.split('.')[1]));
    setUser({ ...decoded, token });
  };

  const logout = () => {
    localStorage.removeItem('pos_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
