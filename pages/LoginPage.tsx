import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../hooks/useAppStore';
import { APP_NAME, MOCK_LOGIN_OPTIONS, LogoIcon, KING_CODES_API_BASE_URL } from '../constants';
import type { LoginPayload, UserRole } from '../types';

interface BackendLoginResponse {
  success: boolean;
  token?: string;
  userId?: string;
  email?: string;
  role?: UserRole;
  balance?: number; // Assuming backend might send initial balance
  error?: string;
}

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { dispatch } = useAppStore();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    if (!email.includes('@')) {
        setError('Please enter a valid email address.');
        return;
    }
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch(`${KING_CODES_API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json() as BackendLoginResponse;

      if (data.success && data.token && data.userId && data.email && data.role) {
        const loginPayload: LoginPayload = {
          email: data.email,
          id: data.userId,
          token: data.token,
          role: data.role,
          balance: data.balance // Pass balance if backend provides it
        };
        dispatch({ type: 'LOGIN', payload: loginPayload });
        navigate('/');
      } else {
        setError(data.error || 'Login failed. Please try again.');
      }
    } catch (err) {
      console.error("Login API error:", err);
      setError('Failed to connect to the login service. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthLogin = (provider: string) => {
    // This remains a mock for OAuth as backend OAuth isn't fully implemented here
    setError('');
    setIsLoading(true);
    console.log(`Simulating login with ${provider}`);
    // Simulate a successful OAuth-like login for demo
    const mockEmail = `user@${provider.toLowerCase().replace(/ /g, '')}.com`;
    const mockPayload: LoginPayload = { 
        email: mockEmail, 
        id: mockEmail, // use email as mock ID for this path
        token: 'mock-oauth-token-' + Date.now(), // Generate a mock token
        role: 'user',
        balance: 100.00 // Default balance for mock OAuth
    };
    dispatch({ type: 'LOGIN', payload: mockPayload });
    navigate('/');
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--kc-background)] p-4">
      <div className="w-full max-w-md bg-[var(--kc-card-background)] p-8 rounded-xl shadow-2xl border border-[var(--kc-border)]">
        <div className="flex flex-col items-center mb-8">
          <LogoIcon size={64} className="text-[var(--kc-primary)] mb-3" />
          <h2 className="text-3xl font-bold text-center text-[var(--kc-primary)]">{APP_NAME}</h2>
          <p className="text-[var(--kc-text-secondary)] text-center mt-1">Locksmith Companion</p>
        </div>

        {error && <p className="mb-4 text-sm text-[var(--kc-error)] bg-[var(--kc-error)] bg-opacity-10 p-3 rounded-md text-center border border-[var(--kc-error)] border-opacity-30">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[var(--kc-text-secondary)] mb-1">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-[var(--kc-input-background)] border border-[var(--kc-border)] rounded-md text-[var(--kc-text-primary)] placeholder-[var(--kc-text-secondary)] placeholder-opacity-70 focus:ring-2 focus:ring-[var(--kc-primary)] focus:border-[var(--kc-primary)] outline-none transition-colors"
              placeholder="you@example.com"
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[var(--kc-text-secondary)] mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-[var(--kc-input-background)] border border-[var(--kc-border)] rounded-md text-[var(--kc-text-primary)] placeholder-[var(--kc-text-secondary)] placeholder-opacity-70 focus:ring-2 focus:ring-[var(--kc-primary)] focus:border-[var(--kc-primary)] outline-none transition-colors"
              placeholder="••••••••"
              disabled={isLoading}
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-[var(--kc-text-primary)] bg-[var(--kc-primary)] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--kc-card-background)] focus:ring-[var(--kc-primary)] transition-opacity disabled:opacity-50"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[var(--kc-border)]" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[var(--kc-card-background)] text-[var(--kc-text-secondary)]">Or continue with</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3">
            {MOCK_LOGIN_OPTIONS.map((option) => (
              <button
                key={option.id}
                onClick={() => handleOAuthLogin(option.name)}
                disabled={isLoading}
                className="w-full inline-flex justify-center py-3 px-4 border border-[var(--kc-border)] rounded-md shadow-sm bg-[var(--kc-surface-light)] text-sm font-medium text-[var(--kc-text-secondary)] hover:bg-[var(--kc-border)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--kc-card-background)] focus:ring-[var(--kc-primary)] transition-colors disabled:opacity-50"
              >
                <span className="sr-only">{option.name}</span>
                {option.name}
              </button>
            ))}
          </div>
        </div>
         <p className="mt-8 text-center text-xs text-[var(--kc-text-secondary)] opacity-70">
          Email/Password login connects to backend. OAuth is mock.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;