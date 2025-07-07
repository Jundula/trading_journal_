import React from 'react';
import { FileText, Upload, X, Plus } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

/**
 * Header component with title and action buttons
 */
const Header = ({
    onImportNews,
    onImportTrades,
    onClearNews,
    onNewTrade,
    newsCount = 0,
    isDark,
    onThemeToggle
}) => {
    return (
        <div className="border-b border-gray-200 dark:border-gray-700 p-6 bg-white dark:bg-gray-800">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Advanced Trading Journal</h1>
                    <p className="text-gray-600 dark:text-gray-300">Economic Calendar Integration & Cycle Analysis</p>
                </div>
                <div className="flex gap-2 items-center">
                    <ThemeToggle isDark={isDark} onToggle={onThemeToggle} />
                    <label className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors">
                        <FileText size={16} className="inline mr-2" />
                        Import News CSV
                        <input
                            type="file"
                            accept=".csv"
                            onChange={onImportNews}
                            className="hidden"
                        />
                    </label>
                    <label className="bg-purple-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-700 transition-colors">
                        <Upload size={16} className="inline mr-2" />
                        Import Trades CSV
                        <input
                            type="file"
                            accept=".csv"
                            onChange={onImportTrades}
                            className="hidden"
                        />
                    </label>
                    <button
                        onClick={onClearNews}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 transition-colors"
                        title={`Clear all news data (${newsCount} events)`}
                    >
                        <X size={16} className="inline mr-2" />
                        Clear News
                    </button>
                    <button
                        onClick={onNewTrade}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 transition-colors"
                    >
                        <Plus size={16} className="inline mr-2" />
                        New Trade
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Header;