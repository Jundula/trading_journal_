import { useState, useEffect } from 'react';

/**
 * Custom hook for managing theme (light/dark mode)
 * @returns {object} - Theme state and toggle function
 */
export const useTheme = () => {
    const [isDark, setIsDark] = useState(false);

    // Initialize theme from localStorage or system preference
    useEffect(() => {
        const savedTheme = localStorage.getItem('trading-journal-theme');
        
        if (savedTheme) {
            const isThemeDark = savedTheme === 'dark';
            setIsDark(isThemeDark);
            applyTheme(isThemeDark);
        } else {
            // Check system preference
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            setIsDark(prefersDark);
            applyTheme(prefersDark);
        }
    }, []);

    // Apply theme to document
    const applyTheme = (dark) => {
        if (dark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    // Toggle theme
    const toggleTheme = () => {
        const newTheme = !isDark;
        setIsDark(newTheme);
        applyTheme(newTheme);
        localStorage.setItem('trading-journal-theme', newTheme ? 'dark' : 'light');
    };

    // Set specific theme
    const setTheme = (theme) => {
        const isThemeDark = theme === 'dark';
        setIsDark(isThemeDark);
        applyTheme(isThemeDark);
        localStorage.setItem('trading-journal-theme', theme);
    };

    return {
        isDark,
        theme: isDark ? 'dark' : 'light',
        toggleTheme,
        setTheme
    };
};