import React from 'react';
import { NavLink } from 'react-router-dom';
import { NAVIGATION_ITEMS } from '../constants';
import { useAppStore } from '../hooks/useAppStore';

const BottomNav: React.FC = () => {
  const { user } = useAppStore();

  if (!user?.isLoggedIn) {
    return null; 
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[var(--kc-surface)] border-t border-[var(--kc-border)] shadow-t-md z-40">
      <div className="container mx-auto flex justify-around items-center h-16">
        {NAVIGATION_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center space-y-1 p-2 rounded-lg transition-all duration-150 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[var(--kc-primary)] focus:ring-opacity-50 
              ${isActive ? 'text-[var(--kc-primary)] scale-105' : 'text-[var(--kc-text-secondary)] hover:text-[var(--kc-primary)]'}`
            }
          >
            <item.icon size={24} strokeWidth={2} />
            <span className="text-xs font-medium">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;