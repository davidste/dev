import React from 'react';
import { useAppStore } from '../hooks/useAppStore';
import { UserCircle, Edit3, ShieldCheck, Bell, LogOut } from 'lucide-react';

const ProfilePage: React.FC = () => {
  const { user, dispatch } = useAppStore();

  if (!user) {
    return <p className="text-center p-8 text-[var(--kc-text-secondary)]">Loading user profile...</p>;
  }

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
    // App.tsx will handle redirection to /login
  };
  
  // Sections based on PDF page 15 - Profile Page Sections
  const profileSections = [
    { name: "Personal Information", desc: "View and update your personal details.", icon: UserCircle },
    { name: "Business Information", desc: "Manage your locksmith business details.", icon: Edit3 },
    { name: "Verification Status", desc: `Current status: ${user.verification.status}`, icon: ShieldCheck },
    { name: "Documents", desc: "Upload and manage your verification documents.", icon: Edit3 }, // Re-using icon
    { name: "Security Settings", desc: "Manage your account security options.", icon: ShieldCheck }, // Re-using icon
    { name: "Notification Preferences", desc: "Configure your app notifications.", icon: Bell },
  ];

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex flex-col items-center mb-8">
        <div className="relative mb-4">
          <img 
            src={user.profile.photoUrl || `https://ui-avatars.com/api/?name=${user.email || 'User'}&background=0F0F0F&color=3B82F6&size=128&bold=true`}
            alt="Profile"
            className="w-32 h-32 rounded-full border-4 border-[var(--kc-primary)] object-cover shadow-lg"
          />
           {/* Placeholder for photo upload icon
           <button className="absolute bottom-0 right-0 bg-[var(--kc-primary)] p-2 rounded-full text-[var(--kc-text-primary)] hover:opacity-90">
            <Edit3 size={16}/>
           </button> 
           */}
        </div>
        <h2 className="text-3xl font-semibold text-[var(--kc-primary)]">
          {user.profile.firstName || user.profile.businessName || user.email || 'User Profile'}
        </h2>
        <p className="text-[var(--kc-text-secondary)]">{user.email}</p>
        <span className={`mt-2 px-3 py-1 text-xs font-semibold rounded-full ${
          user.verification.status === 'verified' ? 'bg-[var(--kc-success)]/20 text-[var(--kc-success)]' :
          user.verification.status === 'pending' ? 'bg-[var(--kc-warning)]/20 text-[var(--kc-warning)]' :
          'bg-[var(--kc-error)]/20 text-[var(--kc-error)]'
        }`}>
          {user.verification.status.charAt(0).toUpperCase() + user.verification.status.slice(1)}
        </span>
      </div>

      <div className="space-y-4">
        {profileSections.map(section => (
            <div key={section.name} className="bg-[var(--kc-card-background)] p-4 rounded-lg shadow-md border border-[var(--kc-border)] cursor-pointer hover:border-[var(--kc-primary)] transition-colors">
                <div className="flex items-center">
                    <section.icon size={20} className="mr-3 text-[var(--kc-primary)]"/>
                    <div>
                        <h3 className="text-md font-medium text-[var(--kc-text-primary)]">{section.name}</h3>
                        <p className="text-xs text-[var(--kc-text-secondary)]">{section.desc}</p>
                    </div>
                </div>
                 {/* Add forms or details inside each section as features are built */}
            </div>
        ))}
      </div>
       <div className="mt-10 text-center">
            <button
                onClick={handleLogout}
                className="flex items-center justify-center mx-auto px-6 py-3 bg-[var(--kc-error)] text-[var(--kc-text-primary)] font-semibold rounded-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[var(--kc-error)] focus:ring-offset-2 focus:ring-offset-[var(--kc-background)] transition-opacity"
            >
                <LogOut size={18} className="mr-2"/>
                Log Out
            </button>
        </div>
    </div>
  );
};

export default ProfilePage;