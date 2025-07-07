import { useLocalStorage } from './useLocalStorage';
import { STORAGE_KEYS } from '../utils/constants';

/**
 * Custom hook for managing weekly plan data
 * @returns {object} - Weekly plan state and management functions
 */
export const useWeeklyPlan = () => {
    const [weeklyPlan, setWeeklyPlan, clearWeeklyPlan] = useLocalStorage(STORAGE_KEYS.PLANS, {});

    // Update a specific plan entry
    const updatePlan = (weekKey, field, day, value) => {
        const planKey = `${weekKey}-${field}`;
        setWeeklyPlan(prev => ({
            ...prev,
            [planKey]: {
                ...prev[planKey],
                [day]: value
            }
        }));
    };

    // Get plan data for a specific week and field
    const getPlan = (weekKey, field) => {
        const planKey = `${weekKey}-${field}`;
        return weeklyPlan[planKey] || {};
    };

    // Update entire week plan
    const updateWeekPlan = (weekKey, planData) => {
        setWeeklyPlan(prev => {
            const updated = { ...prev };
            Object.entries(planData).forEach(([field, dayData]) => {
                const planKey = `${weekKey}-${field}`;
                updated[planKey] = { ...updated[planKey], ...dayData };
            });
            return updated;
        });
    };

    // Clear plan for a specific week
    const clearWeekPlan = (weekKey) => {
        setWeeklyPlan(prev => {
            const updated = { ...prev };
            Object.keys(updated).forEach(key => {
                if (key.startsWith(weekKey)) {
                    delete updated[key];
                }
            });
            return updated;
        });
    };

    // Clear all weekly plans
    const clearAllPlans = () => {
        if (window.confirm('Are you sure you want to clear all weekly plans?')) {
            clearWeeklyPlan();
            return true;
        }
        return false;
    };

    // Export weekly plan data
    const exportWeeklyPlan = (weekKey) => {
        const weekPlan = {};
        Object.entries(weeklyPlan).forEach(([key, value]) => {
            if (key.startsWith(weekKey)) {
                const field = key.replace(`${weekKey}-`, '');
                weekPlan[field] = value;
            }
        });
        return weekPlan;
    };

    // Get all weeks that have plan data
    const getPlannedWeeks = () => {
        const weeks = new Set();
        Object.keys(weeklyPlan).forEach(key => {
            const weekKey = key.split('-')[0];
            if (weekKey && weekKey.match(/^\d{4}-\d{2}-\d{2}$/)) {
                weeks.add(weekKey);
            }
        });
        return Array.from(weeks).sort();
    };

    // Check if a week has any plan data
    const hasWeekPlan = (weekKey) => {
        return Object.keys(weeklyPlan).some(key => key.startsWith(weekKey));
    };

    return {
        weeklyPlan,
        updatePlan,
        getPlan,
        updateWeekPlan,
        clearWeekPlan,
        clearAllPlans,
        exportWeeklyPlan,
        getPlannedWeeks,
        hasWeekPlan
    };
};