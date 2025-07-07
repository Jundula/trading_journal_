import React from 'react';
import { WEEK_DAYS, SESSION_BEFORE_OPTIONS } from '../../utils/constants';

const WeeklyPlanRow = ({ label, weekKey, field, placeholder, halving, weeklyPlan, setWeeklyPlan }) => {
    const updatePlan = (day, value) => {
        // Use the updatePlan function passed from useWeeklyPlan hook
        setWeeklyPlan(weekKey, field, day, value);
    };

    const currentPlan = weeklyPlan[`${weekKey}-${field}`] || {};

    // Enhanced input styles with better focus states and responsiveness
    const inputClassName = "w-full p-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200";
    const selectClassName = "w-full p-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white cursor-pointer transition-all duration-200";

    return (
        <tr className="border-b border-gray-200 dark:border-gray-600">
            <td className="p-4 font-semibold bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-r border-gray-300 dark:border-gray-600">{label}</td>
            {WEEK_DAYS.map((day, index) => (
                <td key={day} className={`p-4 border-r border-gray-300 dark:border-gray-600 relative ${(halving === '3|2' && index === 2) || (halving === '2|3' && index === 1) ? 'halving-split' : ''}`}>
                    {field === 'sessionbefore' ? (
                        <select
                            value={currentPlan[day] || ''}
                            onChange={(e) => updatePlan(day, e.target.value)}
                            className={selectClassName}
                        >
                            <option value="">London Behaviour</option>
                            {SESSION_BEFORE_OPTIONS.map(option => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                    ) : field === 'notes' ? (
                        <textarea
                            value={currentPlan[day] || ''}
                            onChange={(e) => updatePlan(day, e.target.value)}
                            placeholder={placeholder}
                            className={inputClassName}
                            rows={2}
                            style={{ resize: 'none' }}
                        />
                    ) : (
                        <input
                            type="text"
                            value={currentPlan[day] || ''}
                            onChange={(e) => updatePlan(day, e.target.value)}
                            placeholder={placeholder}
                            className={inputClassName}
                            autoComplete="off"
                            spellCheck="false"
                        />
                    )}
                </td>
            ))}
        </tr>
    );
};

export default WeeklyPlanRow;