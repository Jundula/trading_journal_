import React from 'react';
import { Filter } from 'lucide-react';
import ImpactMultiSelect from './ImpactMultiSelect';

/**
 * Filter bar component for calendar view
 */
const FilterBar = ({ 
    filters, 
    currencies, 
    impacts, 
    filteredCount, 
    totalCount,
    onCurrencyChange,
    onToggleImpact,
    onSelectAllImpacts,
    onClearAllImpacts
}) => {
    return (
        <div className="p-4 border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors">
            <div className="flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2">
                    <Filter size={16} className="text-gray-600 dark:text-gray-300" />
                    <span className="font-medium text-gray-700 dark:text-gray-300">Filters:</span>
                </div>
                
                <select
                    value={filters.currency}
                    onChange={(e) => onCurrencyChange(e.target.value)}
                    className="px-3 py-2 border rounded focus:outline-none focus:border-blue-500 hover:border-gray-400 transition-colors bg-white dark:bg-gray-600 border-gray-300 dark:border-gray-500 text-gray-900 dark:text-white"
                >
                    <option value="ALL">All Currencies</option>
                    {currencies.map(curr => (
                        <option key={curr} value={curr}>{curr}</option>
                    ))}
                </select>
                
                <ImpactMultiSelect
                    filters={filters}
                    impacts={impacts}
                    onToggleImpact={onToggleImpact}
                    onSelectAllImpacts={onSelectAllImpacts}
                    onClearAllImpacts={onClearAllImpacts}
                />
                
                <div className="text-sm text-gray-600 dark:text-gray-300">
                    Showing {filteredCount} events
                    {totalCount > 0 && (
                        <span className="ml-2 text-green-600 dark:text-green-400">
                            (✓ {totalCount} total imported)
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FilterBar;