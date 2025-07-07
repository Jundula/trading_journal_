import React from 'react';
import { Calendar } from 'lucide-react';
import FilterBar from '../Filters/FilterBar';
import WeeklyPlanRow from './WeeklyPlanRow';
import { categorizeEventsByDay } from '../../utils/tradeCalculations';
import { formatDate } from '../../utils/dateUtils';
import { WEEK_DAYS, WEEKLY_PLAN_FIELDS, EVENT_TYPES } from '../../utils/constants';

const CalendarView = ({ 
    newsData, 
    weeklyData, 
    filters, 
    currencies, 
    impacts, 
    filteredCount,
    weeklyPlan,
    setWeeklyPlan,
    onCurrencyChange,
    onToggleImpact,
    onSelectAllImpacts,
    onClearAllImpacts
}) => {
    // Get proper dark mode styles for event type cells
    const getEventTypeDarkStyles = (eventType) => {
        const baseStyles = `${eventType.bgColor} ${eventType.textColor}`;
        
        switch(eventType.key) {
            case 'highProbabilityRed':
                return `${baseStyles} dark:bg-red-800 dark:text-red-100`;
            case 'lowProbabilityRed':
                return `${baseStyles} dark:bg-red-700 dark:text-red-100`;
            case 'orangeFolder':
                return `${baseStyles} dark:bg-orange-800 dark:text-orange-100`;
            case 'yellow':
                return `${baseStyles} dark:bg-yellow-800 dark:text-yellow-100`;
            case 'gray':
                return `${baseStyles} dark:bg-gray-600 dark:text-gray-100`;
            default:
                return baseStyles;
        }
    };

    if (newsData.length === 0) {
        return (
            <div className="space-y-8">
                <FilterBar
                    filters={filters}
                    currencies={currencies}
                    impacts={impacts}
                    filteredCount={filteredCount}
                    totalCount={newsData.length}
                    onCurrencyChange={onCurrencyChange}
                    onToggleImpact={onToggleImpact}
                    onSelectAllImpacts={onSelectAllImpacts}
                    onClearAllImpacts={onClearAllImpacts}
                />
                <div className="text-center py-12 text-gray-500">
                    <Calendar size={64} className="mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium mb-2">No Calendar Data</h3>
                    <p>Import your CSV file to see the weekly calendar layout</p>
                </div>
            </div>
        );
    }

    if (weeklyData.length === 0) {
        return (
            <div className="space-y-8">
                <FilterBar
                    filters={filters}
                    currencies={currencies}
                    impacts={impacts}
                    filteredCount={filteredCount}
                    totalCount={newsData.length}
                    onCurrencyChange={onCurrencyChange}
                    onToggleImpact={onToggleImpact}
                    onSelectAllImpacts={onSelectAllImpacts}
                    onClearAllImpacts={onClearAllImpacts}
                />
                <div className="text-center py-12 text-gray-500">
                    <Calendar size={64} className="mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium mb-2">No Events Match Filter</h3>
                    <p>Adjust your filters to see calendar data</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <FilterBar
                filters={filters}
                currencies={currencies}
                impacts={impacts}
                filteredCount={filteredCount}
                totalCount={newsData.length}
                onCurrencyChange={onCurrencyChange}
                onToggleImpact={onToggleImpact}
                onSelectAllImpacts={onSelectAllImpacts}
                onClearAllImpacts={onClearAllImpacts}
            />

            {weeklyData.map(({ week, data, halving }) => {
                const weekStart = new Date(week);
                const eventsByDay = categorizeEventsByDay(data);

                return (
                    <div key={week} className="bg-white dark:bg-gray-800 border rounded-lg overflow-hidden shadow-lg transition-colors">
                        <div className="bg-gray-800 text-white p-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-semibold">
                                    Week of {formatDate(weekStart)}
                                </h3>
                                <span className="text-sm bg-blue-600 px-3 py-1 rounded">
                                    Weekly Halving: {halving}
                                </span>
                            </div>
                        </div>

                        <div className="overflow-x-auto relative">
                            <table className="w-full border-collapse bg-white dark:bg-gray-800 transition-colors">
                                <thead>
                                    <tr className="bg-gray-100 dark:bg-gray-700">
                                        <th className="text-left p-4 font-semibold text-gray-800 dark:text-gray-200 w-48 border-r border-gray-300 dark:border-gray-600">Field</th>
                                        {WEEK_DAYS.map((day, index) => (
                                            <th key={day} className={`text-center p-4 font-semibold text-gray-800 dark:text-gray-200 border-r border-gray-300 dark:border-gray-600 relative ${(halving === '3|2' && index === 2) || (halving === '2|3' && index === 1) ? 'halving-split' : ''}`}>
                                                {day}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {EVENT_TYPES.map((eventType, typeIndex) => (
                                        <tr key={eventType.key} className="border-b border-gray-200 dark:border-gray-600">
                                            <td className={`p-4 font-semibold border-r border-gray-300 dark:border-gray-600 ${getEventTypeDarkStyles(eventType)}`}>
                                                {eventType.label}
                                            </td>
                                            {eventsByDay.map(({ dayName, highRedEvents, lowRedEvents, orangeEvents, yellowEvents, grayEvents }, index) => {
                                                const events = typeIndex === 0 ? highRedEvents :
                                                    typeIndex === 1 ? lowRedEvents :
                                                        typeIndex === 2 ? orangeEvents :
                                                            typeIndex === 3 ? yellowEvents : grayEvents;

                                                return (
                                                    <td key={`${eventType.key}-${dayName}`} className={`p-4 text-center border-r border-gray-300 dark:border-gray-600 relative bg-white dark:bg-gray-800 ${(halving === '3|2' && index === 2) || (halving === '2|3' && index === 1) ? 'halving-split' : ''}`}>
                                                        {events.length > 0 ? (
                                                            <div className="space-y-1">
                                                                <span className={`text-lg ${typeIndex === 1 ? 'text-yellow-600 dark:text-yellow-400' : 'text-green-600 dark:text-green-400'}`}>
                                                                    {typeIndex === 1 ? '⚠' : '✓'}
                                                                </span>
                                                                <div className="text-xs font-medium space-y-1 text-gray-900 dark:text-gray-100">
                                                                    {events.map((event, eventIndex) => (
                                                                        <div key={eventIndex}>{event.event}</div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <span className={`text-xl ${typeIndex <= 2 ? 'text-red-500 dark:text-red-400' : 'text-gray-400 dark:text-gray-500'}`}>
                                                                {typeIndex <= 2 ? '✗' : '-'}
                                                            </span>
                                                        )}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}

                                    <tr className="border-b border-gray-300 dark:border-gray-600 bg-blue-50 dark:bg-blue-900/20">
                                        <td className="p-4 font-bold text-blue-900 dark:text-blue-200 border-r border-gray-300 dark:border-gray-600">Day Assessment</td>
                                        {eventsByDay.map(({ dayName, highRedEvents }, index) => (
                                            <td key={`assessment-${dayName}`} className={`p-4 text-center border-r border-gray-300 dark:border-gray-600 relative bg-blue-50 dark:bg-blue-900/20 ${(halving === '3|2' && index === 2) || (halving === '2|3' && index === 1) ? 'halving-split' : ''}`}>
                                                {highRedEvents.length > 0 ? (
                                                    <div className="space-y-1">
                                                        <span className="text-green-700 dark:text-green-400 text-lg font-bold">🟢</span>
                                                        <div className="text-xs font-bold text-green-700 dark:text-green-400">TRADEABLE DAY</div>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-1">
                                                        <span className="text-orange-600 dark:text-orange-400 text-lg font-bold">🟡</span>
                                                        <div className="text-xs font-bold text-orange-600 dark:text-orange-400">LOW PROBABILITY</div>
                                                    </div>
                                                )}
                                            </td>
                                        ))}
                                    </tr>

                                    {WEEKLY_PLAN_FIELDS.map(planField => (
                                        <WeeklyPlanRow
                                            key={planField.key}
                                            label={planField.label}
                                            weekKey={week}
                                            field={planField.key}
                                            placeholder={planField.placeholder}
                                            halving={halving}
                                            weeklyPlan={weeklyPlan}
                                            setWeeklyPlan={setWeeklyPlan}
                                        />
                                    ))}
                                </tbody>
                            </table>
                            <style jsx>{`
                                .halving-split::after {
                                    content: '';
                                    position: absolute;
                                    top: 0;
                                    right: 0;
                                    bottom: 0;
                                    width: 3px;
                                    background-color: #ef4444;
                                    z-index: 10;
                                }
                            `}</style>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default CalendarView;