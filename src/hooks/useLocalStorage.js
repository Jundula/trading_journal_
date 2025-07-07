import { useState, useEffect } from 'react';

/**
 * Custom hook for managing localStorage with automatic serialization
 * @param {string} key - localStorage key
 * @param {*} initialValue - initial value if nothing in localStorage
 * @returns {[value, setValue, clearValue]} - state value, setter, and clear function
 */
export const useLocalStorage = (key, initialValue) => {
    // Get initial value from localStorage or use provided initial value
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(`Error reading localStorage key "${key}":`, error);
            return initialValue;
        }
    });

    // Set value and update localStorage
    const setValue = (value) => {
        try {
            // Allow value to be a function so we have the same API as useState
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            
            // Only save to localStorage if there's actual data
            if (valueToStore && 
                ((Array.isArray(valueToStore) && valueToStore.length > 0) ||
                 (typeof valueToStore === 'object' && Object.keys(valueToStore).length > 0) ||
                 (typeof valueToStore !== 'object' && valueToStore !== ''))) {
                window.localStorage.setItem(key, JSON.stringify(valueToStore));
            }
        } catch (error) {
            console.error(`Error setting localStorage key "${key}":`, error);
        }
    };

    // Clear value from state and localStorage
    const clearValue = () => {
        try {
            setStoredValue(initialValue);
            window.localStorage.removeItem(key);
        } catch (error) {
            console.error(`Error clearing localStorage key "${key}":`, error);
        }
    };

    return [storedValue, setValue, clearValue];
};