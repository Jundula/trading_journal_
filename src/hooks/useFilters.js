import { useState } from 'react';

/**
 * Custom hook for managing filter state
 * @param {object} initialFilters - Initial filter values
 * @returns {object} - Filter state and management functions
 */
export const useFilters = (initialFilters = {}) => {
    const [filters, setFilters] = useState({
        currency: 'ALL',
        impact: [],
        dateRange: 'current_week',
        ...initialFilters
    });

    // Update a specific filter
    const updateFilter = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
    };

    // Update multiple filters at once
    const updateFilters = (newFilters) => {
        setFilters(prev => ({
            ...prev,
            ...newFilters
        }));
    };

    // Reset filters to initial state
    const resetFilters = () => {
        setFilters({
            currency: 'ALL',
            impact: [],
            dateRange: 'current_week',
            ...initialFilters
        });
    };

    // Currency filter functions
    const setCurrency = (currency) => updateFilter('currency', currency);

    // Impact filter functions
    const toggleImpact = (impact) => {
        setFilters(prev => ({
            ...prev,
            impact: prev.impact.includes(impact)
                ? prev.impact.filter(i => i !== impact)
                : [...prev.impact, impact]
        }));
    };

    const selectAllImpacts = (impacts) => {
        updateFilter('impact', impacts);
    };

    const clearAllImpacts = () => {
        updateFilter('impact', []);
    };

    // Date range filter functions
    const setDateRange = (dateRange) => updateFilter('dateRange', dateRange);

    // Check if filters are active (not in default state)
    const hasActiveFilters = () => {
        return filters.currency !== 'ALL' || 
               filters.impact.length > 0 || 
               filters.dateRange !== 'current_week';
    };

    // Get filter summary for display
    const getFilterSummary = () => {
        const summary = [];
        
        if (filters.currency !== 'ALL') {
            summary.push(`Currency: ${filters.currency}`);
        }
        
        if (filters.impact.length > 0) {
            summary.push(`Impact: ${filters.impact.length} selected`);
        }
        
        if (filters.dateRange !== 'current_week') {
            summary.push(`Range: ${filters.dateRange}`);
        }
        
        return summary.join(', ') || 'No filters applied';
    };

    return {
        filters,
        updateFilter,
        updateFilters,
        resetFilters,
        setCurrency,
        toggleImpact,
        selectAllImpacts,
        clearAllImpacts,
        setDateRange,
        hasActiveFilters,
        getFilterSummary
    };
};