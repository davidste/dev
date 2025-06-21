import React from 'react';
import { useAppStore } from '../hooks/useAppStore';
import { ApiKeyStatus } from '../types';
import { API_KEY_CHECK_MESSAGE, API_KEY_MISSING_MESSAGE, API_KEY_VALID_MESSAGE } from '../constants';
import { CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';


const ApiKeyStatusDisplay: React.FC = () => {
  const { apiKeyStatus } = useAppStore();

  if (apiKeyStatus === ApiKeyStatus.VALID) {
    return (
      <div className="mb-4 p-3 bg-[var(--kc-success)] bg-opacity-10 border border-[var(--kc-success)] border-opacity-30 text-[var(--kc-success)] rounded-md text-sm flex items-center">
        <CheckCircle2 size={18} className="mr-2" />
        {API_KEY_VALID_MESSAGE}
      </div>
    );
  }

  if (apiKeyStatus === ApiKeyStatus.MISSING) {
    return (
      <div className="mb-6 p-4 bg-[var(--kc-error)] bg-opacity-10 border border-[var(--kc-error)] border-opacity-30 text-[var(--kc-error)] rounded-md text-sm flex items-start">
        <AlertTriangle size={20} className="mr-3 mt-0.5 flex-shrink-0" />
        <div>
            <p className="font-semibold mb-1">API Key Issue</p>
            <p>{API_KEY_MISSING_MESSAGE}</p>
            <p className="mt-1 text-xs opacity-80">The application's AI features will not function correctly.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="mb-4 p-3 bg-[var(--kc-info)] bg-opacity-10 border border-[var(--kc-info)] border-opacity-30 text-[var(--kc-info)] rounded-md text-sm flex items-center">
        <Loader2 size={18} className="mr-2 animate-spin" />
        {API_KEY_CHECK_MESSAGE}
    </div>
  );
};

export default ApiKeyStatusDisplay;