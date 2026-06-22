/* eslint-disable react-refresh/only-export-components */
import PropTypes from 'prop-types';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { adminLogin as adminLoginRequest } from '../api/adminService';
import { getMe, login as loginRequest, register as registerRequest } from '../api/authService';

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('audioaura_token');

    if (!token) {
      setAuthLoading(false);
      return;
    }

    getMe()
      .then((response) => setUser(response.data))
      .catch(() => {
        localStorage.removeItem('audioaura_token');
        setUser(null);
      })
      .finally(() => setAuthLoading(false));
  }, []);

  const persistSession = (response) => {
    localStorage.setItem('audioaura_token', response.token);
    setUser(response.data);
  };

  const login = useCallback(async (payload) => {
    const response = await loginRequest(payload);
    persistSession(response);
  }, []);

  const adminLogin = useCallback(async (payload) => {
    const response = await adminLoginRequest(payload);
    persistSession(response);
  }, []);

  const register = useCallback(async (payload) => {
    const response = await registerRequest(payload);
    persistSession(response);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('audioaura_token');
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      authLoading,
      adminLogin,
      isAdmin: user?.role === 'admin',
      isAuthenticated: Boolean(user),
      login,
      logout,
      register,
      user,
    }),
    [adminLogin, authLoading, login, logout, register, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
