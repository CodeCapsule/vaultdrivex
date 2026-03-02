import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  hideHeader?: boolean;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, footer, hideHeader = false }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100">
        
        {!hideHeader && (
          <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
              <X size={20} />
            </button>
          </div>
        )}

        {hideHeader && (
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10 p-1 hover:bg-gray-100 rounded-full"
          >
            <X size={20} />
          </button>
        )}

        <div className={hideHeader ? "px-8 pt-8 pb-6" : "px-6 py-6"}>
          {children}
        </div>
        
        {footer && (
          <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3 border-t border-gray-100">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};