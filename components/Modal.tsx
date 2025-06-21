import React from 'react';
import { X } from 'lucide-react';
import type { ModalProps } from '../types';

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-[100]"
      onClick={onClose} // Close on overlay click
    >
      <div
        className="bg-[var(--kc-card-background)] p-6 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto relative border border-[var(--kc-border)]"
        onClick={(e) => e.stopPropagation()} // Prevent click through to overlay
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-[var(--kc-primary)]">{title}</h2>
          <button
            onClick={onClose}
            className="text-[var(--kc-text-secondary)] hover:text-[var(--kc-primary)] p-1 rounded-full hover:bg-[var(--kc-surface-light)] transition-colors"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;