import { useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { STORAGE_KEYS } from '../utils/constants';
import { importNewsCSV } from '../utils/csvImport';
import { getUniqueNewsValues, groupNewsByWeeks, filterNewsData } from '../utils/tradeCalculations';

/**
 * Custom hook for managing news data
 * @returns {object} - News data state and management functions
 */
export const useNewsData = () => {
    const [newsData, setNewsData, clearNewsData] = useLocalStorage(STORAGE_KEYS.NEWS, []);

    // Get unique currencies and impacts for filters
    const { currencies, impacts } = useMemo(() => 
        getUniqueNewsValues(newsData), [newsData]
    );

    // Import news from CSV
    const importNews = async (file) => {
        try {
            const result = await importNewsCSV(file, newsData);
            setNewsData(prev => [...prev, ...result.imported]);
            return result;
        } catch (error) {
            throw error;
        }
    };

    // Clear all news data
    const clearAllNews = () => {
        if (window.confirm('Are you sure you want to clear all news data?')) {
            clearNewsData();
            return true;
        }
        return false;
    };

    // Get filtered news data
    const getFilteredNews = (filters) => {
        return filterNewsData(newsData, filters);
    };

    // Get weekly data with halving analysis
    const getWeeklyData = (filters) => {
        const filteredNews = getFilteredNews(filters);
        return groupNewsByWeeks(filteredNews);
    };

    // Get unique news events for dropdowns
    const getNewsEvents = () => {
        return [...new Set(newsData.map(n => n.event))].filter(Boolean).sort();
    };

    // Add manual news event
    const addNewsEvent = (eventData) => {
        const newEvent = {
            ...eventData,
            id: Date.now(),
            dateISO: eventData.dateISO || eventData.date
        };
        setNewsData(prev => [...prev, newEvent]);
    };

    // Update news event
    const updateNewsEvent = (eventId, updatedData) => {
        setNewsData(prev => prev.map(event => 
            event.id === eventId ? { ...event, ...updatedData } : event
        ));
    };

    // Delete news event
    const deleteNewsEvent = (eventId) => {
        setNewsData(prev => prev.filter(event => event.id !== eventId));
    };

    return {
        newsData,
        currencies,
        impacts,
        importNews,
        clearAllNews,
        getFilteredNews,
        getWeeklyData,
        getNewsEvents,
        addNewsEvent,
        updateNewsEvent,
        deleteNewsEvent
    };
};