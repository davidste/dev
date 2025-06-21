import React from 'react';
import { Cog, Users, DollarSign, BarChart2, ShieldCheck } from 'lucide-react';
import { useAppStore } from '../hooks/useAppStore';

const AdminPage: React.FC = () => {
    const { user, dispatch } = useAppStore();

    const handleLogout = () => {
        dispatch({ type: 'LOGOUT' });
    };

  return (
    <div className="container mx-auto p-4 md:p-6">
      <h2 className="text-3xl font-semibold text-[var(--kc-primary)] mb-6 flex items-center">
        <Cog size={32} className="mr-3" /> Admin Dashboard (Placeholder)
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { title: "User Management", icon: Users, desc: "View and manage users (feature not implemented)." },
          { title: "Pricing & Plans", icon: DollarSign, desc: "Configure pricing and subscription plans (feature not implemented)." },
          { title: "Analytics", icon: BarChart2, desc: "View application analytics (feature not implemented)." },
          { title: "Verification", icon: ShieldCheck, desc: "Manage user verification requests (feature not implemented)." }
        ].map(card => (
          <div key={card.title} className="bg-[var(--kc-card-background)] p-6 rounded-lg shadow-xl hover:shadow-[var(--kc-primary)]/20 transition-shadow border border-[var(--kc-border)]">
            <div className="flex items-center text-[var(--kc-primary)] mb-3">
              <card.icon size={24} className="mr-2" />
              <h3 className="text-xl font-semibold">{card.title}</h3>
            </div>
            <p className="text-[var(--kc-text-secondary)] text-sm">{card.desc}</p>
          </div>
        ))}
      </div>
      
      {user?.isLoggedIn && (
        <div className="mt-12 text-center">
            <button
                onClick={handleLogout}
                className="px-6 py-3 bg-[var(--kc-error)] text-[var(--kc-text-primary)] font-semibold rounded-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[var(--kc-error)] focus:ring-offset-2 focus:ring-offset-[var(--kc-background)] transition-opacity"
            >
                Log Out
            </button>
        </div>
      )}
    </div>
  );
};

export default AdminPage;