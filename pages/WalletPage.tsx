import React, { useState } from 'react';
import { useAppStore } from '../hooks/useAppStore';
import Modal from '../components/Modal';
import { DollarSign, PlusCircle } from 'lucide-react';
import { MOCK_LOOKUP_COST } from '../constants';

const WalletPage: React.FC = () => {
  const { user, addFunds } = useAppStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addAmount, setAddAmount] = useState('10'); 

  const handleAddFunds = () => {
    const amount = parseFloat(addAmount);
    if (!isNaN(amount) && amount > 0) {
      addFunds(amount);
      setIsModalOpen(false);
      setAddAmount('10'); 
    } else {
      alert('Please enter a valid positive amount.');
    }
  };

  if (!user) {
    return <p className="text-center p-8 text-[var(--kc-text-secondary)]">Please log in to view your wallet.</p>;
  }

  const quickAddAmounts = [5, 10, 20, 50];

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-lg">
      <h2 className="text-3xl font-semibold text-[var(--kc-primary)] mb-8 text-center">My Wallet</h2>

      <div className="bg-[var(--kc-card-background)] border border-[var(--kc-border)] p-8 rounded-xl shadow-2xl text-center mb-8">
        <DollarSign size={48} className="mx-auto text-[var(--kc-success)] mb-4" />
        <p className="text-lg text-[var(--kc-text-secondary)] mb-1">Current Balance</p>
        <p className="text-5xl font-bold text-[var(--kc-success)]">
          ${user.wallet.balance.toFixed(2)}
        </p>
      </div>

      <div className="bg-[var(--kc-card-background)] border border-[var(--kc-border)] p-6 rounded-xl shadow-xl">
        <h3 className="text-xl font-semibold text-[var(--kc-primary)] opacity-90 mb-4">Add Funds (Mock)</h3>
        <p className="text-sm text-[var(--kc-text-secondary)] mb-6">
          This is a demonstration. No real payment is processed.
          A mock cost of ${MOCK_LOOKUP_COST.toFixed(2)} is applied per VIN lookup.
        </p>
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full flex items-center justify-center px-6 py-3 bg-[var(--kc-primary)] text-[var(--kc-text-primary)] font-semibold rounded-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[var(--kc-primary)] focus:ring-offset-2 focus:ring-offset-[var(--kc-card-background)] transition-opacity"
        >
          <PlusCircle size={20} className="mr-2" />
          Add Funds
        </button>
      </div>
      
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Funds to Wallet">
        <div className="space-y-4">
          <p className="text-sm text-[var(--kc-text-secondary)]">Select or enter an amount to add (mock):</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
            {quickAddAmounts.map(amount => (
                <button
                    key={amount}
                    onClick={() => setAddAmount(String(amount))}
                    className={`p-3 rounded-md border text-sm font-medium transition-colors
                                ${addAmount === String(amount) 
                                    ? 'bg-[var(--kc-primary)] text-[var(--kc-text-primary)] border-[var(--kc-primary)]' 
                                    : 'bg-[var(--kc-input-background)] border-[var(--kc-border)] text-[var(--kc-text-secondary)] hover:bg-[var(--kc-surface-light)]'}`}
                >
                    ${amount.toFixed(2)}
                </button>
            ))}
          </div>
          <div>
            <label htmlFor="customAmount" className="block text-sm font-medium text-[var(--kc-text-secondary)] mb-1">
              Custom Amount ($)
            </label>
            <input
              id="customAmount"
              type="number"
              value={addAmount}
              onChange={(e) => setAddAmount(e.target.value)}
              min="1"
              step="0.01"
              className="w-full px-3 py-2 bg-[var(--kc-input-background)] border border-[var(--kc-border)] rounded-md text-[var(--kc-text-primary)] focus:ring-[var(--kc-primary)] focus:border-[var(--kc-primary)]"
              placeholder="e.g., 25.50"
            />
          </div>
          <button
            onClick={handleAddFunds}
            className="w-full mt-2 px-4 py-2 bg-[var(--kc-success)] text-[var(--kc-text-primary)] font-semibold rounded-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[var(--kc-success)] focus:ring-offset-2 focus:ring-offset-[var(--kc-card-background)] transition-opacity"
          >
            Add ${parseFloat(addAmount).toFixed(2) || '0.00'} to Balance
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default WalletPage;