import React from 'react';
import { X } from 'lucide-react';

/**
 * Reusable modal component
 */
const Modal = ({ 
    isOpen, 
    onClose, 
    title, 
    children, 
    maxWidth = 'max-w-md',
    maxHeight = 'max-h-[90vh]' 
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className={`bg-white dark:bg-gray-800 rounded-lg p-6 ${maxWidth} w-full ${maxHeight} overflow-y-auto transition-colors`}>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {title}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
};

export default Modal;