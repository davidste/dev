import React from 'react';
import { Link } from 'react-router-dom';
import { useAppStore } from '../hooks/useAppStore';
import { APP_NAME, LogoIcon } from '../constants';

const Header: React.FC = () => {
  const { user } = useAppStore();

  return (
    <header className="bg-[var(--kc-surface)] p-4 shadow-md sticky top-0 z-50 border-b border-[var(--kc-border)]">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 text-[var(--kc-primary)] hover:opacity-80">
          <LogoIcon size={32} />
          <h1 className="text-2xl font-bold">{APP_NAME}</h1>
        </Link>
        <div className="flex items-center space-x-4">
          {user?.isLoggedIn && (
            <>
              <span className="text-sm text-[var(--kc-text-secondary)]">
                Balance: <span className="font-semibold text-[var(--kc-success)]">${user.wallet.balance.toFixed(2)}</span>
              </span>
              {/* Admin link removed from here */}
            </>
          )}
          {!user?.isLoggedIn && (
             <Link
                to="/login"
                className="px-4 py-2 bg-[var(--kc-primary)] text-[var(--kc-text-primary)] rounded-md hover:opacity-90 transition-opacity text-sm font-medium"
              >
                Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;