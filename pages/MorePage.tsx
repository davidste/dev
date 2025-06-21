import React from 'react';
import { ChevronRight, Settings, HelpCircle, Info, ShieldQuestion } from 'lucide-react';

const MorePage: React.FC = () => {

  const moreOptions = [
    { name: "App Settings", icon: Settings, path: "/settings/app", description: "Configure application preferences." }, // Placeholder path
    { name: "Support Center", icon: HelpCircle, path: "/support", description: "Get help and find FAQs." },
    { name: "Privacy Policy", icon: ShieldQuestion, path: "/privacy", description: "Read our privacy policy." },
    { name: "About King Codes", icon: Info, path: "/about", description: "Learn more about the app." },
  ];

  return (
    <div className="container mx-auto p-4 md:p-6">
      <h2 className="text-3xl font-semibold text-[var(--kc-primary)] mb-6">More Options</h2>
      
      <div className="space-y-3">
        {moreOptions.map((option) => (
          <div 
            key={option.name}
            // onClick={() => alert(`Navigate to ${option.path} (not implemented)`)}
            className="bg-[var(--kc-card-background)] p-4 rounded-lg shadow-md border border-[var(--kc-border)] flex items-center justify-between cursor-pointer hover:border-[var(--kc-primary)] transition-colors"
          >
            <div className="flex items-center">
              <option.icon size={22} className="mr-4 text-[var(--kc-primary)]" />
              <div>
                <h3 className="text-md font-medium text-[var(--kc-text-primary)]">{option.name}</h3>
                <p className="text-xs text-[var(--kc-text-secondary)]">{option.description}</p>
              </div>
            </div>
            <ChevronRight size={20} className="text-[var(--kc-text-secondary)]" />
          </div>
        ))}
      </div>

      <div className="mt-8 text-center text-sm text-[var(--kc-text-secondary)] opacity-70">
        <p>King Codes - Illustrative Locksmith Assistant</p>
        <p>Version 1.0.0 (Web Demo)</p>
      </div>
    </div>
  );
};

export default MorePage;