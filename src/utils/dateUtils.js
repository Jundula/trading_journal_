/**
 * Convert DD/MM/YYYY to YYYY-MM-DD format
 * @param {string} dateStr - Date string in various formats
 * @returns {string} - Date string in YYYY-MM-DD format
 */
export const convertDateFormat = (dateStr) => {
    if (!dateStr) return '';

    // Handle different date formats
    if (dateStr.includes('/')) {
        const parts = dateStr.split('/');
        if (parts.length === 3) {
            // Check if it's DD/MM/YYYY or MM/DD/YYYY or YYYY/MM/DD
            if (parts[2].length === 4) {
                // DD/MM/YYYY or MM/DD/YYYY
                const [first, second, year] = parts;
                // Assume DD/MM/YYYY format
                return `${year}-${second.padStart(2, '0')}-${first.padStart(2, '0')}`;
            } else if (parts[0].length === 4) {
                // YYYY/MM/DD
                return `${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(2, '0')}`;
            }
        }
    }

    // Handle YYYY-MM-DD format (already correct)
    if (dateStr.includes('-') && dateStr.split('-')[0].length === 4) {
        return dateStr;
    }

    return dateStr;
};

/**
 * Get the start of the week (Monday) for a given date
 * @param {Date} date - The date to get week start for
 * @returns {Date} - The Monday of that week
 */
export const getWeekStart = (date) => {
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay() + 1);
    return weekStart;
};

/**
 * Get week key (YYYY-MM-DD format of Monday) for a given date
 * @param {Date|string} date - Date object or ISO string
 * @returns {string} - Week key in YYYY-MM-DD format
 */
export const getWeekKey = (date) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const weekStart = getWeekStart(dateObj);
    return weekStart.toISOString().split('T')[0];
};

/**
 * Format date for display
 * @param {Date|string} date - Date to format
 * @param {object} options - Intl.DateTimeFormat options
 * @returns {string} - Formatted date string
 */
export const formatDate = (date, options = { month: 'long', day: 'numeric', year: 'numeric' }) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', options);
};

/**
 * Get today's date in YYYY-MM-DD format
 * @returns {string} - Today's date
 */
export const getTodayISO = () => {
    return new Date().toISOString().split('T')[0];
};

/**
 * Check if a date is today
 * @param {Date|string} date - Date to check
 * @returns {boolean} - True if date is today
 */
export const isToday = (date) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const today = new Date();
    return dateObj.toDateString() === today.toDateString();
};

/**
 * Get day abbreviation from full day name
 * @param {string} dayName - Full day name (e.g., 'Monday')
 * @returns {string} - Day abbreviation (e.g., 'Mon')
 */
export const getDayAbbr = (dayName) => {
    return dayName.slice(0, 3);
};

/**
 * Check if a day matches (handles both full names and abbreviations)
 * @param {string} eventDay - Day from event data
 * @param {string} targetDay - Target day to match
 * @returns {boolean} - True if days match
 */
export const isDayMatch = (eventDay, targetDay) => {
    return eventDay === targetDay || eventDay === getDayAbbr(targetDay);
};