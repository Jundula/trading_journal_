import React, { useState } from 'react';

/**
 * Multi-select dropdown for impact filters
 */
const ImpactMultiSelect = ({ filters, onToggleImpact, onSelectAllImpacts, onClearAllImpacts, impacts }) => {
    const [isOpen, setIsOpen] = useState(false);

    const getDisplayText = () => {
        if (filters.impact.length === 0) {
            return 'No Impact Selected';
        }
        if (filters.impact.length === impacts.length) {
            return 'All Impact';
        }
        return `${filters.impact.length} selected`;
    };

    const getImpactBadgeStyle = (impact) => {
        const styles = {
            red: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200',
            orange: 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-200',
            yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200'
        };
        return styles[impact] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="px-3 py-2 border rounded bg-white dark:bg-gray-600 flex items-center justify-between min-w-[150px] focus:outline-none focus:border-blue-500 hover:border-gray-400 transition-colors border-gray-300 dark:border-gray-500 text-gray-900 dark:text-white"
            >
                <span className="text-sm">
                    {getDisplayText()}
                </span>
                <span className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                    ▼
                </span>
            </button>

            {isOpen && (
                <>
                    {/* Backdrop to close dropdown */}
                    <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded shadow-lg z-20 min-w-[200px]">
                        <div className="p-2 border-b border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-600 flex gap-2">
                            <button
                                onClick={() => {
                                    onSelectAllImpacts(impacts);
                                    setIsOpen(false);
                                }}
                                className="text-xs px-2 py-1 bg-blue-500 dark:bg-blue-600 text-white rounded hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
                            >
                                Select All
                            </button>
                            <button
                                onClick={() => {
                                    onClearAllImpacts();
                                    setIsOpen(false);
                                }}
                                className="text-xs px-2 py-1 bg-gray-500 dark:bg-gray-600 text-white rounded hover:bg-gray-600 dark:hover:bg-gray-700 transition-colors"
                            >
                                Clear All
                            </button>
                        </div>
                        <div className="max-h-48 overflow-y-auto">
                            {impacts.map(impact => (
                                <label 
                                    key={impact} 
                                    className="flex items-center p-2 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer transition-colors"
                                >
                                    <input
                                        type="checkbox"
                                        checked={filters.impact.includes(impact)}
                                        onChange={() => onToggleImpact(impact)}
                                        className="mr-2"
                                    />
                                    <span className={`text-sm px-2 py-1 rounded ${getImpactBadgeStyle(impact)}`}>
                                        {impact}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default ImpactMultiSelect;