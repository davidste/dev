import React, { useState } from 'react';
import { useAppStore } from '../hooks/useAppStore';
import type { VinLookupData, GeminiKeyPinResponse } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import { VIN_PLACEHOLDER, MAKE_PLACEHOLDER, MODEL_PLACEHOLDER, YEAR_PLACEHOLDER } from '../constants';
import { AlertTriangle, CheckCircle, Info, Lightbulb, ScanLine, Bell } from 'lucide-react';
import ApiKeyStatusDisplay from '../components/ApiKeyStatusDisplay';

const HomePage: React.FC = () => {
  const [vin, setVin] = useState('');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GeminiKeyPinResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { performVinLookup, apiKeyStatus } = useAppStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vin.trim()) {
      setError('VIN is required.');
      return;
    }
    if (vin.trim().length !== 17) {
      setError('VIN must be 17 characters long.');
      return;
    }
    setError(null);
    setIsLoading(true);
    setResult(null);

    const lookupData: VinLookupData = { vin: vin.trim(), make: make.trim(), model: model.trim(), year: year.trim() };
    const apiResult = await performVinLookup(lookupData);
    
    if (apiResult.error) {
        setError(apiResult.error);
    } else {
        setResult(apiResult);
    }
    setIsLoading(false);
  };

  const handleMockScanVin = () => {
    // In a real app, this would trigger camera.
    // For web, could use mediaDevices API if desired.
    alert("VIN Scan feature would activate camera on a native mobile app. Web version does not implement camera scanning.");
    // Optionally, set a test VIN
    // setVin("TESTVIN1234567890"); 
  };

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6 max-w-3xl">
      <h2 className="text-3xl font-semibold text-[var(--kc-primary)] mb-6 text-center">VIN Lookup</h2>
      
      {/* Placeholder Announcements Banner */}
      <div className="bg-[var(--kc-info)] bg-opacity-10 border border-[var(--kc-info)] border-opacity-30 text-[var(--kc-info)] p-4 rounded-lg shadow-md flex items-center">
        <Bell size={20} className="mr-3 flex-shrink-0" />
        <div className="text-sm">
            <p className="font-semibold">System Announcement:</p>
            <p className="opacity-90">Welcome to King Codes! API key status is checked below. Remember, all data is illustrative.</p>
        </div>
      </div>
      
      <ApiKeyStatusDisplay />

      <form onSubmit={handleSubmit} className="bg-[var(--kc-card-background)] p-6 rounded-lg shadow-xl space-y-6 border border-[var(--kc-border)]">
        <div className="relative">
          <label htmlFor="vin" className="block text-sm font-medium text-[var(--kc-text-secondary)] mb-1">
            Vehicle Identification Number (VIN) <span className="text-[var(--kc-error)]">*</span>
          </label>
          <div className="flex items-center">
            <input
              id="vin"
              type="text"
              value={vin}
              onChange={(e) => setVin(e.target.value.toUpperCase())}
              placeholder={VIN_PLACEHOLDER}
              maxLength={17}
              className="flex-grow w-full px-4 py-3 bg-[var(--kc-input-background)] border border-[var(--kc-border)] rounded-l-md text-[var(--kc-text-primary)] placeholder-[var(--kc-text-secondary)] placeholder-opacity-70 focus:ring-2 focus:ring-[var(--kc-primary)] focus:border-[var(--kc-primary)] outline-none transition-colors"
              required
            />
            <button 
              type="button" 
              onClick={handleMockScanVin}
              title="Scan VIN (Mock)"
              className="px-4 py-3 bg-[var(--kc-surface-light)] border border-l-0 border-[var(--kc-border)] rounded-r-md text-[var(--kc-primary)] hover:bg-[var(--kc-border)] transition-colors"
            >
              <ScanLine size={20}/>
            </button>
          </div>
        </div>


        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="make" className="block text-sm font-medium text-[var(--kc-text-secondary)] mb-1">Make (Optional)</label>
            <input id="make" type="text" value={make} onChange={(e) => setMake(e.target.value)} placeholder={MAKE_PLACEHOLDER} className="w-full px-4 py-3 bg-[var(--kc-input-background)] border border-[var(--kc-border)] rounded-md text-[var(--kc-text-primary)] placeholder-[var(--kc-text-secondary)] placeholder-opacity-70 focus:ring-2 focus:ring-[var(--kc-primary)] focus:border-[var(--kc-primary)] outline-none transition-colors" />
          </div>
          <div>
            <label htmlFor="model" className="block text-sm font-medium text-[var(--kc-text-secondary)] mb-1">Model (Optional)</label>
            <input id="model" type="text" value={model} onChange={(e) => setModel(e.target.value)} placeholder={MODEL_PLACEHOLDER} className="w-full px-4 py-3 bg-[var(--kc-input-background)] border border-[var(--kc-border)] rounded-md text-[var(--kc-text-primary)] placeholder-[var(--kc-text-secondary)] placeholder-opacity-70 focus:ring-2 focus:ring-[var(--kc-primary)] focus:border-[var(--kc-primary)] outline-none transition-colors" />
          </div>
          <div>
            <label htmlFor="year" className="block text-sm font-medium text-[var(--kc-text-secondary)] mb-1">Year (Optional)</label>
            <input id="year" type="text" value={year} onChange={(e) => setYear(e.target.value)} placeholder={YEAR_PLACEHOLDER} className="w-full px-4 py-3 bg-[var(--kc-input-background)] border border-[var(--kc-border)] rounded-md text-[var(--kc-text-primary)] placeholder-[var(--kc-text-secondary)] placeholder-opacity-70 focus:ring-2 focus:ring-[var(--kc-primary)] focus:border-[var(--kc-primary)] outline-none transition-colors" />
          </div>
        </div>
        
        <button
          type="submit"
          disabled={isLoading || apiKeyStatus !== 'VALID'}
          className="w-full flex justify-center items-center px-6 py-3 bg-[var(--kc-primary)] text-[var(--kc-text-primary)] font-semibold rounded-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[var(--kc-primary)] focus:ring-offset-2 focus:ring-offset-[var(--kc-card-background)] transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? <LoadingSpinner size="sm" /> : 'Get Illustrative Info'}
        </button>
      </form>

      {error && (
        <div className="mt-6 p-4 bg-[var(--kc-error)] bg-opacity-10 border border-[var(--kc-error)] border-opacity-30 text-[var(--kc-error)] rounded-md shadow-md flex items-start">
          <AlertTriangle size={24} className="mr-3 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold">Lookup Error</h3>
            <p className="text-sm opacity-90">{error}</p>
          </div>
        </div>
      )}

      {result && !result.error && (
        <div className="mt-8 bg-[var(--kc-card-background)] p-6 rounded-lg shadow-xl space-y-4 border border-[var(--kc-border)]">
          <h3 className="text-2xl font-semibold text-[var(--kc-primary)] mb-3 border-b border-[var(--kc-border)] pb-2 flex items-center">
            <Info size={24} className="mr-2" /> Illustrative Vehicle Information
          </h3>
          
          {result.vehicleDescription && (
            <div>
              <h4 className="font-semibold text-[var(--kc-text-secondary)]">General Description:</h4>
              <p className="text-[var(--kc-text-primary)] opacity-90 text-sm leading-relaxed">{result.vehicleDescription}</p>
            </div>
          )}

          {result.illustrativeKeyTypes && result.illustrativeKeyTypes.length > 0 && (
            <div>
              <h4 className="font-semibold text-[var(--kc-text-secondary)]">Illustrative Key Types:</h4>
              <ul className="list-disc list-inside text-[var(--kc-text-primary)] opacity-90 text-sm space-y-1 pl-2">
                {result.illustrativeKeyTypes.map((type, index) => <li key={index}>{type}</li>)}
              </ul>
            </div>
          )}

          {result.illustrativePinFormat && (
            <div>
              <h4 className="font-semibold text-[var(--kc-text-secondary)]">Illustrative PIN Format:</h4>
              <p className="text-[var(--kc-text-primary)] opacity-90 text-sm leading-relaxed">{result.illustrativePinFormat}</p>
            </div>
          )}
          
          {result.importantNotice && (
            <div className="mt-4 p-4 bg-[var(--kc-warning)] bg-opacity-10 border border-[var(--kc-warning)] border-opacity-30 text-[var(--kc-warning)] rounded-md text-sm flex items-start">
              <Lightbulb size={20} className="mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <strong className="font-semibold">Important Notice:</strong> <span className="opacity-90">{result.importantNotice}</span>
              </div>
            </div>
          )}
        </div>
      )}
       {result && result.error && !error && ( 
            <div className="mt-6 p-4 bg-[var(--kc-error)] bg-opacity-10 border border-[var(--kc-error)] border-opacity-30 text-[var(--kc-error)] rounded-md shadow-md flex items-start">
                <AlertTriangle size={24} className="mr-3 flex-shrink-0 mt-1" />
                <div>
                    <h3 className="font-semibold">AI Assistant Error</h3>
                    <p className="text-sm opacity-90">{result.error}</p>
                    {result.importantNotice && <p className="text-xs mt-2 opacity-80">{result.importantNotice}</p>}
                </div>
            </div>
        )}
    </div>
  );
};

export default HomePage;