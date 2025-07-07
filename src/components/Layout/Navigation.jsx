import React from 'react';
import { Calendar, TrendingUp, BarChart3 } from 'lucide-react';

const iconMap = {
    Calendar,
    TrendingUp,
    BarChart3
};

/**
 * Navigation tabs component
 */
const Navigation = ({ activeTab, onTabChange, tabs }) => {
    return (
        <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <nav className="flex space-x-8 px-6">
                {tabs.map(tab => {
                    const IconComponent = iconMap[tab.icon];
                    return (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                                activeTab === tab.id
                                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                            }`}
                        >
                            {IconComponent && <IconComponent size={16} className="inline mr-2" />}
                            {tab.label}
                        </button>
                    );
                })}
            </nav>
        </div>
    );
};

export default Navigation;