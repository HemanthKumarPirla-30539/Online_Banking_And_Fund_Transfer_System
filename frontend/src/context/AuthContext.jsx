import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const AuthContext = createContext(null);

const AUTH_STORAGE_KEY = 'fts_auth';

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [authState, setAuthState] = useState({
    token: null,
    accountId: null,
    accountNumber: null,
    name: '',
    email: '',
    phone: '',
    loading: true,
  });

  useEffect(() => {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) {
      setAuthState({ ...JSON.parse(stored), loading: false });
    } else {
      setAuthState({ token: null, accountId: null, accountNumber: null, name: '', email: '', phone: '', loading: false });
    }
  }, []);

  const login = async (credentials) => {
    const response = await authService.login(credentials);
    const state = {
      token: response.token,
      accountId: response.accountId,
      accountNumber: response.accountNumber,
      name: response.name,
      email: response.email,
      phone: response.phone,
      loading: false,
    };
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(state));
    setAuthState(state);
    navigate('/');
  };

  const register = async (data) => {
    const response = await authService.register(data);
    const state = {
      token: response.token,
      accountId: response.accountId,
      accountNumber: response.accountNumber,
      name: response.name,
      email: response.email,
      phone: response.phone,
      loading: false,
    };
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(state));
    setAuthState(state);
    navigate('/');
  };

  const logout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setAuthState({ token: null, accountId: null, accountNumber: null, loading: false });
    navigate('/login');
  };

  const value = useMemo(
    () => ({
      ...authState,
      isAuthenticated: Boolean(authState.token),
      login,
      register,
      logout,
    }),
    [authState]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
