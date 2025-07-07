import React from 'react';
import { Sun, Moon } from 'lucide-react';

/**
 * Theme toggle button component
 */
const ThemeToggle = ({ isDark, onToggle }) => {
    return (
        <button
            onClick={onToggle}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
            title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        >
            {isDark ? (
                <Sun size={20} className="text-yellow-500" />
            ) : (
                <Moon size={20} className="text-gray-700 dark:text-gray-300" />
            )}
        </button>
    );
};

export default ThemeToggle;