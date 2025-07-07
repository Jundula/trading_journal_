import { HIGH_PROBABILITY_RED_EVENTS, WEEK_DAYS } from './constants';
import { isDayMatch } from './dateUtils';

/**
 * Calculate comprehensive trade statistics
 * @param {Array} trades - Array of trade objects
 * @returns {object} - Trade statistics
 */
export const calculateTradeStats = (trades) => {
    const totalTrades = trades.length;
    
    if (totalTrades === 0) {
        return {
            totalTrades: 0,
            winningTrades: 0,
            losingTrades: 0,
            breakEvenTrades: 0,
            grossPnL: 0,
            totalCommission: 0,
            totalFees: 0,
            netPnL: 0,
            winRate: 0,
            avgWin: 0,
            avgLoss: 0,
            profitFactor: 'N/A'
        };
    }

    const winningTrades = trades.filter(t => parseFloat(t.pnl || 0) > 0).length;
    const losingTrades = trades.filter(t => parseFloat(t.pnl || 0) < 0).length;
    const breakEvenTrades = trades.filter(t => parseFloat(t.pnl || 0) === 0).length;

    const grossPnL = trades.reduce((sum, t) => sum + parseFloat(t.pnl || 0), 0);
    const totalCommission = trades.reduce((sum, t) => sum + parseFloat(t.commission || 0), 0);
    const totalFees = trades.reduce((sum, t) => sum + parseFloat(t.fees || 0), 0);
    const netPnL = grossPnL - totalCommission - totalFees;

    const winRate = totalTrades > 0 ? ((winningTrades / totalTrades) * 100).toFixed(1) : 0;

    const avgWin = winningTrades > 0 ?
        trades.filter(t => parseFloat(t.pnl || 0) > 0)
            .reduce((sum, t) => sum + parseFloat(t.pnl || 0), 0) / winningTrades : 0;

    const avgLoss = losingTrades > 0 ?
        trades.filter(t => parseFloat(t.pnl || 0) < 0)
            .reduce((sum, t) => sum + parseFloat(t.pnl || 0), 0) / losingTrades : 0;

    const profitFactor = avgLoss !== 0 ? Math.abs(avgWin / avgLoss).toFixed(2) : 'N/A';

    return {
        totalTrades,
        winningTrades,
        losingTrades,
        breakEvenTrades,
        grossPnL,
        totalCommission,
        totalFees,
        netPnL,
        winRate,
        avgWin,
        avgLoss,
        profitFactor
    };
};

/**
 * Analyze weekly halving based on high probability red events
 * @param {Array} weekData - News events for a specific week
 * @returns {string} - Halving result ('3|2' or '2|3')
 */
export const analyzeWeeklyHalving = (weekData) => {
    const highProbRedEvents = weekData.filter(news => {
        if (news.impact !== 'red') return false;
        const eventUpper = news.event.toUpperCase();
        return HIGH_PROBABILITY_RED_EVENTS.some(red => eventUpper.includes(red.toUpperCase()));
    });

    const eventsByDay = {};

    WEEK_DAYS.forEach(day => {
        eventsByDay[day] = highProbRedEvents.filter(event =>
            isDayMatch(event.day, day)
        );
    });

    const firstHalf = (eventsByDay['Monday']?.length || 0) +
        (eventsByDay['Tuesday']?.length || 0) +
        (eventsByDay['Wednesday']?.length || 0);
    const secondHalf = (eventsByDay['Thursday']?.length || 0) +
        (eventsByDay['Friday']?.length || 0);

    if (firstHalf === secondHalf) {
        const orangeEvents = weekData.filter(news => news.impact === 'orange');
        const orangeFirst = orangeEvents.filter(event =>
            ['Mon', 'Tue', 'Wed', 'Monday', 'Tuesday', 'Wednesday'].includes(event.day)
        ).length;
        const orangeSecond = orangeEvents.filter(event =>
            ['Thu', 'Fri', 'Thursday', 'Friday'].includes(event.day)
        ).length;

        return orangeFirst > orangeSecond ? '3|2' : '2|3';
    }

    return firstHalf > secondHalf ? '3|2' : '2|3';
};

/**
 * Categorize events by day for calendar display
 * @param {Array} weekData - News events for a specific week
 * @returns {Array} - Events categorized by day
 */
export const categorizeEventsByDay = (weekData) => {
    return WEEK_DAYS.map(dayName => {
        const dayEvents = weekData.filter(event =>
            isDayMatch(event.day, dayName)
        );

        const csvRedEvents = dayEvents.filter(e => e.impact === 'red');

        const highRedEvents = csvRedEvents.filter(e => {
            const eventUpper = e.event.toUpperCase();
            return HIGH_PROBABILITY_RED_EVENTS.some(red => eventUpper.includes(red.toUpperCase()));
        });

        const lowRedEvents = csvRedEvents.filter(e => {
            const eventUpper = e.event.toUpperCase();
            return !HIGH_PROBABILITY_RED_EVENTS.some(red => eventUpper.includes(red.toUpperCase()));
        });

        const orangeEvents = dayEvents.filter(e => e.impact === 'orange');
        const yellowEvents = dayEvents.filter(e => e.impact === 'yellow');
        const grayEvents = dayEvents.filter(e => e.impact === 'gray');

        return {
            dayName,
            dayAbbr: dayName.slice(0, 3),
            events: dayEvents,
            highRedEvents,
            lowRedEvents,
            orangeEvents,
            yellowEvents,
            grayEvents
        };
    });
};

/**
 * Filter news data based on filter criteria
 * @param {Array} newsData - All news data
 * @param {object} filters - Filter criteria
 * @returns {Array} - Filtered news data
 */
export const filterNewsData = (newsData, filters) => {
    return newsData.filter(news => {
        if (filters.currency !== 'ALL' && news.currency !== filters.currency) return false;
        if (filters.impact.length === 0) return false;
        if (!filters.impact.includes(news.impact)) return false;
        return true;
    });
};

/**
 * Get unique values from news data for filters
 * @param {Array} newsData - All news data
 * @returns {object} - Unique currencies and impacts
 */
export const getUniqueNewsValues = (newsData) => {
    const currencies = [...new Set(newsData.map(n => n.currency))].filter(Boolean).sort();
    const impacts = [...new Set(newsData.map(n => n.impact))].filter(Boolean).sort();
    
    return { currencies, impacts };
};

/**
 * Group news data by weeks
 * @param {Array} filteredNews - Filtered news data
 * @returns {Array} - News data grouped by weeks with halving analysis
 */
export const groupNewsByWeeks = (filteredNews) => {
    const weeks = {};
    
    filteredNews.forEach(news => {
        const date = new Date(news.dateISO || news.date);
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay() + 1);
        const weekKey = weekStart.toISOString().split('T')[0];

        if (!weeks[weekKey]) {
            weeks[weekKey] = [];
        }
        weeks[weekKey].push(news);
    });

    return Object.entries(weeks)
        .sort(([weekA], [weekB]) => new Date(weekA) - new Date(weekB))
        .map(([week, data]) => ({
            week,
            data: data.sort((a, b) => new Date(a.dateISO || a.date) - new Date(b.dateISO || b.date)),
            halving: analyzeWeeklyHalving(data)
        }));
};