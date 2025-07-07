import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import DayDetailModal from './DayDetailModal';

const TradesCalendarView = ({ trades, newsData = [], onEditTrade, onDeleteTrade, onAddTrade }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDay, setSelectedDay] = useState(null);
    const [showDayModal, setShowDayModal] = useState(false);
    const [newsFilters, setNewsFilters] = useState({
        currency: 'ALL',
        impact: 'ALL'
    });

    // Get current month/year
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    // Handle day click
    const handleDayClick = (day) => {
        if (!day.isCurrentMonth) return; // Don't open modal for days from other months
        
        setSelectedDay(day);
        setShowDayModal(true);
    };

    // Handle modal close
    const handleCloseModal = () => {
        setShowDayModal(false);
        setSelectedDay(null);
    };

    // Handle add trade from modal
    const handleAddTradeFromModal = (date) => {
        const formattedDate = date.toISOString().split('T')[0];
        onAddTrade(formattedDate);
        handleCloseModal();
    };

    // Get news for selected day
    const getNewsForDay = (date) => {
        if (!newsData || !date) return [];
        
        const dateStr = date.toISOString().split('T')[0];
        return newsData.filter(news => {
            const newsDateStr = news.dateISO || news.date;
            if (!newsDateStr) return false;
            
            // Handle different date formats
            let newsFormattedDate;
            if (newsDateStr.includes('/')) {
                const parts = newsDateStr.split('/');
                if (parts.length === 3) {
                    // Assume DD/MM/YYYY format
                    newsFormattedDate = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
                }
            } else if (newsDateStr.includes('-') && newsDateStr.split('-')[0].length === 4) {
                newsFormattedDate = newsDateStr;
            } else {
                // Handle "July 1 2025" format
                const newsDateObj = new Date(newsDateStr);
                if (!isNaN(newsDateObj.getTime())) {
                    newsFormattedDate = newsDateObj.toISOString().split('T')[0];
                }
            }
            
            return newsFormattedDate === dateStr;
        });
    };

    // Calculate calendar data
    const calendarData = useMemo(() => {
        // Get first day of month and number of days
        const firstDay = new Date(currentYear, currentMonth, 1);
        const lastDay = new Date(currentYear, currentMonth + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay()); // Start from Sunday

        // Generate calendar grid (6 weeks)
        const calendar = [];
        const currentDay = new Date(startDate);

        for (let week = 0; week < 6; week++) {
            const weekDays = [];
            for (let day = 0; day < 7; day++) {
                const dateStr = currentDay.toISOString().split('T')[0];
                
                // Filter trades for this day
                const dayTrades = trades.filter(trade => {
                    const tradeDate = trade.entryDate || trade.date;
                    if (!tradeDate) return false;
                    
                    // Parse different date formats to get YYYY-MM-DD format
                    let tradeDateFormatted;
                    
                    if (tradeDate.includes('/')) {
                        // Handle DD/MM/YYYY or MM/DD/YYYY format
                        const parts = tradeDate.split('/');
                        if (parts.length === 3) {
                            // Assume DD/MM/YYYY format
                            tradeDateFormatted = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
                        }
                    } else if (tradeDate.includes('-') && tradeDate.split('-')[0].length === 4) {
                        // Already in YYYY-MM-DD format
                        tradeDateFormatted = tradeDate;
                    } else {
                        // Handle "July 1 2025", "June 27 2025" format
                        const dateObj = new Date(tradeDate);
                        if (!isNaN(dateObj.getTime())) {
                            tradeDateFormatted = dateObj.toISOString().split('T')[0];
                        }
                    }
                    
                    return tradeDateFormatted === dateStr;
                });

                // Calculate daily P&L
                const dailyPnL = dayTrades.reduce((sum, trade) => {
                    return sum + parseFloat(trade.pnl || 0);
                }, 0);

                weekDays.push({
                    date: new Date(currentDay),
                    dateStr,
                    dayNumber: currentDay.getDate(),
                    isCurrentMonth: currentDay.getMonth() === currentMonth,
                    isToday: currentDay.toDateString() === new Date().toDateString(),
                    trades: dayTrades,
                    tradeCount: dayTrades.length,
                    dailyPnL
                });

                currentDay.setDate(currentDay.getDate() + 1);
            }
            calendar.push(weekDays);
        }

        // Calculate weekly summaries with proper week numbering
        const weekSummaries = calendar.map((week, index) => {
            // Get all trades for this week (including days from other months)
            const allWeekTrades = week.reduce((acc, day) => acc.concat(day.trades), []);
            
            // Count days that belong to current month
            const currentMonthDays = week.filter(day => day.isCurrentMonth).length;
            
            // Calculate total P&L for all trades in this week
            const weekPnL = allWeekTrades.reduce((sum, trade) => {
                return sum + parseFloat(trade.pnl || 0);
            }, 0);

            // Determine if week should have reduced opacity
            // If less than 4 days belong to current month, reduce opacity
            const shouldReduceOpacity = currentMonthDays < 4;

            return {
                weekNumber: index + 1,
                tradeCount: allWeekTrades.length,
                weekPnL,
                currentMonthDays,
                shouldReduceOpacity
            };
        });

        // Filter and renumber weeks to only show primary weeks
        const filteredWeekSummaries = weekSummaries
            .map((week, index) => ({
                ...week,
                originalIndex: index,
                shouldShow: week.currentMonthDays >= 4 // Only show weeks with 4+ days from current month
            }))
            .filter(week => week.shouldShow)
            .map((week, newIndex) => ({
                ...week,
                weekNumber: newIndex + 1 // Renumber starting from 1
            }));

        // Calculate monthly total
        const monthlyTrades = trades.filter(trade => {
            const tradeDate = trade.entryDate || trade.date;
            if (!tradeDate) return false;
            
            // Parse different date formats
            let tradeDateObj;
            
            if (tradeDate.includes('/')) {
                // Handle DD/MM/YYYY or MM/DD/YYYY format
                const parts = tradeDate.split('/');
                if (parts.length === 3) {
                    // Assume DD/MM/YYYY format
                    tradeDateObj = new Date(`${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`);
                }
            } else if (tradeDate.includes('-') && tradeDate.split('-')[0].length === 4) {
                // Already in YYYY-MM-DD format
                tradeDateObj = new Date(tradeDate);
            } else {
                // Handle "July 1 2025", "June 27 2025" format
                tradeDateObj = new Date(tradeDate);
            }
            
            return tradeDateObj && !isNaN(tradeDateObj.getTime()) && 
                   tradeDateObj.getMonth() === currentMonth && 
                   tradeDateObj.getFullYear() === currentYear;
        });

        const monthlyPnL = monthlyTrades.reduce((sum, trade) => {
            return sum + parseFloat(trade.pnl || 0);
        }, 0);

        return { calendar, weekSummaries: filteredWeekSummaries, monthlyPnL, allWeekSummaries: weekSummaries };
    }, [trades, currentMonth, currentYear]);

    // Navigation functions
    const goToPreviousMonth = () => {
        setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
    };

    const goToNextMonth = () => {
        setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
    };

    const goToToday = () => {
        setCurrentDate(new Date());
    };

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        }).format(amount);
    };

    // Get cell background color based on P&L
    const getCellStyle = (dailyPnL, tradeCount) => {
        if (tradeCount === 0) return 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700';
        if (dailyPnL > 0) return 'bg-green-200 dark:bg-green-600 border-green-300 dark:border-green-500';
        if (dailyPnL < 0) return 'bg-red-200 dark:bg-red-600 border-red-300 dark:border-red-500';
        return 'bg-gray-200 dark:bg-gray-600 border-gray-300 dark:border-gray-500';
    };

    const monthNames = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    const dayHeaders = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

    return (
        <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-6 rounded-lg border border-gray-200 dark:border-gray-700">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                    <button
                        onClick={goToPreviousMonth}
                        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <h2 className="text-xl font-semibold">
                        {monthNames[currentMonth]} {currentYear}
                    </h2>
                    <button
                        onClick={goToNextMonth}
                        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
                
                <div className="absolute left-1/2 transform -translate-x-1/2 text-lg">
                    Monthly P/L: 
                    <span className={`ml-2 font-bold ${
                        calendarData.monthlyPnL >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                        {formatCurrency(calendarData.monthlyPnL)}
                    </span>
                </div>
                
                <button
                    onClick={goToToday}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded transition-colors"
                >
                    Today
                </button>
            </div>

            <div className="grid grid-cols-8 gap-1">
                {/* Day headers */}
                {dayHeaders.map(day => (
                    <div key={day} className="text-center p-3 text-gray-600 dark:text-gray-400 font-medium bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600">
                        {day}
                    </div>
                ))}
                
                {/* Week summary header */}
                <div className="text-center p-3 text-gray-600 dark:text-gray-400 font-medium bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600">
                    Week
                </div>

                {/* Calendar grid */}
                {calendarData.calendar.map((week, weekIndex) => (
                    <React.Fragment key={weekIndex}>
                        {/* Week days */}
                        {week.map((day, dayIndex) => (
                            <div
                                key={`${weekIndex}-${dayIndex}`}
                                onClick={() => handleDayClick(day)}
                                className={`
                                    h-20 p-2 border transition-colors cursor-pointer
                                    ${getCellStyle(day.dailyPnL, day.tradeCount)}
                                    ${!day.isCurrentMonth ? 'opacity-30 cursor-not-allowed' : 'hover:opacity-80'}
                                    ${day.isToday ? 'ring-2 ring-blue-500 dark:ring-blue-400' : ''}
                                `}
                            >
                                <div className="flex flex-col h-full">
                                    <div className="text-sm font-medium text-gray-900 dark:text-white">{day.dayNumber}</div>
                                    {day.tradeCount > 0 && (
                                        <div className="flex-1 flex flex-col justify-center items-center">
                                            <div className={`text-xs font-bold ${
                                                day.dailyPnL > 0 ? 'text-green-900 dark:text-green-100' : 
                                                day.dailyPnL < 0 ? 'text-red-900 dark:text-red-100' : 
                                                'text-gray-800 dark:text-gray-100'
                                            }`}>
                                                {day.dailyPnL >= 0 ? '+' : ''}{formatCurrency(day.dailyPnL)}
                                            </div>
                                            <div className="text-xs opacity-75 text-gray-700 dark:text-gray-200">
                                                {day.tradeCount} trade{day.tradeCount !== 1 ? 's' : ''}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {/* Week summary - only show for primary weeks */}
                        {calendarData.allWeekSummaries[weekIndex].currentMonthDays >= 4 && (
                            <div className="flex flex-col justify-center items-center p-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700">
                                {(() => {
                                    // Find the renumbered week
                                    const renumberedWeek = calendarData.weekSummaries.find(w => w.originalIndex === weekIndex);
                                    return (
                                        <>
                                            <div className="text-xs text-gray-600 dark:text-gray-400">Week {renumberedWeek?.weekNumber}</div>
                                            <div className={`text-sm font-bold ${
                                                calendarData.allWeekSummaries[weekIndex].weekPnL > 0 ? 'text-green-700 dark:text-green-300' : 
                                                calendarData.allWeekSummaries[weekIndex].weekPnL < 0 ? 'text-red-700 dark:text-red-300' :
                                                'text-gray-600 dark:text-gray-400'
                                            }`}>
                                                {formatCurrency(calendarData.allWeekSummaries[weekIndex].weekPnL)}
                                            </div>
                                            <div className="text-xs text-gray-600 dark:text-gray-400">
                                                {calendarData.allWeekSummaries[weekIndex].tradeCount} trades
                                            </div>
                                        </>
                                    );
                                })()}
                            </div>
                        )}

                        {/* Empty cell for weeks that don't belong to current month */}
                        {calendarData.allWeekSummaries[weekIndex].currentMonthDays < 4 && (
                            <div className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 opacity-30"></div>
                        )}
                    </React.Fragment>
                ))}
            </div>

            {/* Legend */}
            <div className="mt-4 flex items-center justify-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-200 dark:bg-green-600 border border-green-300 dark:border-green-500 rounded"></div>
                    <span>Profitable Day</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-200 dark:bg-red-600 border border-red-300 dark:border-red-500 rounded"></div>
                    <span>Loss Day</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-200 dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded"></div>
                    <span>Break Even</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded"></div>
                    <span>No Trades</span>
                </div>
            </div>

            {/* Day Detail Modal */}
            {selectedDay && (
                <DayDetailModal
                    isOpen={showDayModal}
                    onClose={handleCloseModal}
                    selectedDate={selectedDay.date}
                    dayTrades={selectedDay.trades}
                    dayNews={getNewsForDay(selectedDay.date)}
                    newsFilters={newsFilters}
                    onNewsFiltersChange={setNewsFilters}
                    onAddTrade={handleAddTradeFromModal}
                    onEditTrade={onEditTrade}
                    onDeleteTrade={onDeleteTrade}
                />
            )}
        </div>
    );
};

export default TradesCalendarView;