import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import * as api from '../api/client';

interface AuthState {
  token: string | null;
  residentId: number | null;
  name: string | null;
  pointsBalance: number | null;
  loading: boolean;
}

const AuthContext = createContext<{
  auth: AuthState;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshBalance: () => Promise<void>;
} | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<AuthState>({
    token: null,
    residentId: null,
    name: null,
    pointsBalance: null,
    loading: true,
  });

  const refreshBalance = useCallback(async () => {
    const token = localStorage.getItem('access_token');
    const residentIdStr = localStorage.getItem('resident_id');
    if (!token || !residentIdStr) return;
    const residentId = parseInt(residentIdStr, 10);
    try {
      const b = await api.getBalance(residentId);
      setAuth((prev) => ({
        ...prev,
        name: b.name,
        pointsBalance: b.pointsBalance,
      }));
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const residentIdStr = localStorage.getItem('resident_id');
    if (!token || !residentIdStr) {
      setAuth((prev) => ({ ...prev, loading: false }));
      return;
    }
    const residentId = parseInt(residentIdStr, 10);
    setAuth((prev) => ({ ...prev, token, residentId }));
    api
      .getBalance(residentId)
      .then((b) => {
        setAuth((prev) => ({
          ...prev,
          name: b.name,
          pointsBalance: b.pointsBalance,
          loading: false,
        }));
      })
      .catch(() => setAuth((prev) => ({ ...prev, loading: false })));
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const { access_token } = await api.login(email, password);
      localStorage.setItem('access_token', access_token);
      const payload = JSON.parse(
        atob(access_token.split('.')[1] ?? '{}'),
      ) as { sub?: number };
      const residentId = payload.sub ?? 1;
      localStorage.setItem('resident_id', String(residentId));
      const b = await api.getBalance(residentId);
      setAuth({
        token: access_token,
        residentId,
        name: b.name,
        pointsBalance: b.pointsBalance,
        loading: false,
      });
    },
    [],
  );

  const logout = useCallback(() => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('resident_id');
    setAuth({
      token: null,
      residentId: null,
      name: null,
      pointsBalance: null,
      loading: false,
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{ auth, login, logout, refreshBalance }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
