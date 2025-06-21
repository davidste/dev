import React from 'react';
import { useAppStore } from '../hooks/useAppStore';
import type { HistoryEntry } from '../types';
import { Trash2, FileText, AlertTriangle } from 'lucide-react';

const HistoryItemCard: React.FC<{ entry: HistoryEntry }> = ({ entry }) => {
  return (
    <div className="bg-[var(--kc-card-background)] p-4 rounded-lg shadow-lg hover:shadow-[var(--kc-primary)]/20 transition-shadow duration-200 border border-[var(--kc-border)]">
      <div className="flex justify-between items-start mb-2">
        <span className="text-sm font-semibold text-[var(--kc-primary)]">VIN: {entry.lookupData.vin}</span>
        <span className="text-xs text-[var(--kc-text-secondary)] opacity-80">{entry.timestamp}</span>
      </div>
      {(entry.lookupData.make || entry.lookupData.model || entry.lookupData.year) && (
        <p className="text-xs text-[var(--kc-text-secondary)] mb-2">
            Context: {entry.lookupData.make} {entry.lookupData.model} {entry.lookupData.year}
        </p>
      )}
      
      {entry.apiResponse.error ? (
        <div className="mt-2 p-2 bg-[var(--kc-error)] bg-opacity-10 border border-[var(--kc-error)] border-opacity-30 text-[var(--kc-error)] rounded-md text-xs flex items-start">
            <AlertTriangle size={16} className="mr-2 mt-0.5 flex-shrink-0" />
            <div>
                <p className="font-semibold">Error during lookup:</p>
                <p className="opacity-90">{entry.apiResponse.error}</p>
            </div>
        </div>
      ) : (
        <>
            <p className="text-xs text-[var(--kc-text-secondary)] mb-1">
                <strong className="text-[var(--kc-text-primary)] opacity-90">Vehicle:</strong> {entry.apiResponse.vehicleDescription?.substring(0,100) || 'N/A'}...
            </p>
            <p className="text-xs text-[var(--kc-text-secondary)]">
                <strong className="text-[var(--kc-text-primary)] opacity-90">Key Types:</strong> {entry.apiResponse.illustrativeKeyTypes?.join(', ') || 'N/A'}
            </p>
        </>
      )}
      {entry.apiResponse.importantNotice && (
        <p className="text-xs text-[var(--kc-warning)] opacity-90 mt-2 bg-[var(--kc-warning)] bg-opacity-10 p-1 rounded">
            Notice: {entry.apiResponse.importantNotice.substring(0,100)}...
        </p>
      )}
      {entry.costDeducted && (
         <p className="text-xs text-[var(--kc-text-secondary)] mt-1 text-right">Cost: ${entry.costDeducted.toFixed(2)}</p>
      )}
    </div>
  );
};


const HistoryPage: React.FC = () => {
  const { history, dispatch } = useAppStore();

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear all lookup history? This action cannot be undone.')) {
      dispatch({ type: 'CLEAR_HISTORY' });
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold text-[var(--kc-primary)]">Lookup History</h2>
        {history.length > 0 && (
          <button
            onClick={handleClearHistory}
            className="flex items-center px-4 py-2 bg-[var(--kc-error)] text-[var(--kc-text-primary)] text-sm font-medium rounded-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[var(--kc-error)] focus:ring-offset-2 focus:ring-offset-[var(--kc-background)] transition-opacity"
          >
            <Trash2 size={16} className="mr-2" />
            Clear History
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="text-center py-10 bg-[var(--kc-card-background)] rounded-lg shadow-md border border-[var(--kc-border)]">
          <FileText size={48} className="mx-auto text-[var(--kc-text-secondary)] opacity-70 mb-4" />
          <p className="text-[var(--kc-text-secondary)] text-lg">No lookup history yet.</p>
          <p className="text-[var(--kc-text-secondary)] opacity-80 text-sm">Perform a VIN lookup on the Home page to see results here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((entry) => (
            <HistoryItemCard key={entry.id} entry={entry} />
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryPage;