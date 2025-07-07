import React, { useState, useMemo } from 'react';
import { X, Plus, Edit, Trash2, TrendingUp, TrendingDown, Calendar, Clock, DollarSign, Filter } from 'lucide-react';

const DayDetailModal = ({ 
    isOpen, 
    onClose, 
    selectedDate, 
    dayTrades, 
    dayNews, 
    newsFilters,
    onNewsFiltersChange,
    onAddTrade, 
    onEditTrade, 
    onDeleteTrade 
}) => {
    // Get unique currencies and impacts from day news
    const { currencies, impacts } = useMemo(() => {
        if (!dayNews || dayNews.length === 0) {
            return { currencies: [], impacts: [] };
        }
        const uniqueCurrencies = [...new Set(dayNews.map(news => news.currency))].filter(Boolean).sort();
        const uniqueImpacts = [...new Set(dayNews.map(news => news.impact))].filter(Boolean).sort();
        return { currencies: uniqueCurrencies, impacts: uniqueImpacts };
    }, [dayNews]);

    // Only reset invalid filter selections when day changes
    React.useEffect(() => {
        if (isOpen && dayNews && dayNews.length > 0) {
            const newFilters = { ...newsFilters };
            let hasChanges = false;
            
            // Reset currency if it doesn't exist in this day's data
            if (newsFilters.currency !== 'ALL' && !currencies.includes(newsFilters.currency)) {
                newFilters.currency = 'ALL';
                hasChanges = true;
            }
            
            // Reset impact if it doesn't exist in this day's data
            if (newsFilters.impact !== 'ALL' && !impacts.includes(newsFilters.impact)) {
                newFilters.impact = 'ALL';
                hasChanges = true;
            }
            
            if (hasChanges) {
                onNewsFiltersChange(newFilters);
            }
        }
    }, [isOpen, currencies, impacts, dayNews, newsFilters, onNewsFiltersChange]);

    // Filter news based on selected filters
    const filteredNews = useMemo(() => {
        if (!dayNews || dayNews.length === 0) {
            return [];
        }
        return dayNews.filter(news => {
            if (newsFilters.currency !== 'ALL' && news.currency !== newsFilters.currency) {
                return false;
            }
            if (newsFilters.impact !== 'ALL' && news.impact !== newsFilters.impact) {
                return false;
            }
            return true;
        });
    }, [dayNews, newsFilters]);

    if (!isOpen || !selectedDate) return null;

    // Calculate day statistics
    const totalPnL = dayTrades.reduce((sum, trade) => sum + parseFloat(trade.pnl || 0), 0);
    const totalTrades = dayTrades.length;
    const winningTrades = dayTrades.filter(trade => parseFloat(trade.pnl || 0) > 0).length;
    const losingTrades = dayTrades.filter(trade => parseFloat(trade.pnl || 0) < 0).length;
    const winRate = totalTrades > 0 ? ((winningTrades / totalTrades) * 100).toFixed(1) : 0;

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        }).format(amount);
    };

    // Format date
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Get impact badge style
    const getImpactBadgeStyle = (impact) => {
        const styles = {
            red: 'bg-red-100 text-red-800 border-red-200',
            orange: 'bg-orange-100 text-orange-800 border-orange-200',
            yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            gray: 'bg-gray-100 text-gray-800 border-gray-200'
        };
        return styles[impact] || 'bg-gray-100 text-gray-800 border-gray-200';
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto transition-colors">
                {/* Header */}
                <div className="flex justify-between items-center mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {formatDate(selectedDate)}
                        </h2>
                        <div className="flex items-center gap-4 mt-2">
                            <div className={`text-lg font-semibold ${
                                totalPnL >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                                Day P&L: {formatCurrency(totalPnL)}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                {totalTrades} trade{totalTrades !== 1 ? 's' : ''} • {winRate}% win rate
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Day Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border dark:border-blue-800">
                        <div className="flex items-center gap-2">
                            <TrendingUp size={16} className="text-blue-600 dark:text-blue-400" />
                            <span className="text-sm font-medium text-blue-800 dark:text-blue-200">Total Trades</span>
                        </div>
                        <p className="text-xl font-bold text-blue-600 dark:text-blue-400 mt-1">{totalTrades}</p>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border dark:border-green-800">
                        <div className="flex items-center gap-2">
                            <TrendingUp size={16} className="text-green-600 dark:text-green-400" />
                            <span className="text-sm font-medium text-green-800 dark:text-green-200">Winning Trades</span>
                        </div>
                        <p className="text-xl font-bold text-green-600 dark:text-green-400 mt-1">{winningTrades}</p>
                    </div>
                    <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border dark:border-red-800">
                        <div className="flex items-center gap-2">
                            <TrendingDown size={16} className="text-red-600 dark:text-red-400" />
                            <span className="text-sm font-medium text-red-800 dark:text-red-200">Losing Trades</span>
                        </div>
                        <p className="text-xl font-bold text-red-600 dark:text-red-400 mt-1">{losingTrades}</p>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border dark:border-purple-800">
                        <div className="flex items-center gap-2">
                            <DollarSign size={16} className="text-purple-600 dark:text-purple-400" />
                            <span className="text-sm font-medium text-purple-800 dark:text-purple-200">Win Rate</span>
                        </div>
                        <p className="text-xl font-bold text-purple-600 dark:text-purple-400 mt-1">{winRate}%</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Trades Section */}
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Trades ({totalTrades})
                            </h3>
                            <button
                                onClick={() => onAddTrade(selectedDate)}
                                className="flex items-center gap-2 bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 text-sm transition-colors"
                            >
                                <Plus size={16} />
                                Add Trade
                            </button>
                        </div>

                        {dayTrades.length === 0 ? (
                            <div className="text-center py-8 text-gray-500 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                <p>No trades on this day</p>
                                <p className="text-sm mt-1">Click "Add Trade" to record a trade</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {dayTrades.map((trade, index) => (
                                    <div
                                        key={trade.id || index}
                                        className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="font-semibold text-gray-900 dark:text-white">
                                                        {trade.symbol || trade.asset}
                                                    </span>
                                                    <span className={`px-2 py-1 rounded text-xs ${
                                                        (trade.direction === 'LONG' || trade.direction === 'BUY') 
                                                            ? 'bg-green-100 text-green-800' 
                                                            : 'bg-red-100 text-red-800'
                                                    }`}>
                                                        {trade.direction}
                                                    </span>
                                                    {trade.entryTime && (
                                                        <span className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1">
                                                            <Clock size={12} />
                                                            {trade.entryTime}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="grid grid-cols-2 gap-2 text-sm">
                                                    <div>
                                                        <span className="text-gray-600 dark:text-gray-400">Quantity: </span>
                                                        <span className="text-gray-900 dark:text-white">{trade.quantity || trade.size}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-600 dark:text-gray-400">Entry: </span>
                                                        <span className="text-gray-900 dark:text-white">{trade.entryPrice || trade.entry}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-600 dark:text-gray-400">Exit: </span>
                                                        <span className="text-gray-900 dark:text-white">{trade.exitPrice || trade.exit || 'Open'}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-600 dark:text-gray-400">P&L: </span>
                                                        <span className={`font-semibold ${
                                                            parseFloat(trade.pnl || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                                                        }`}>
                                                            {trade.pnl ? formatCurrency(parseFloat(trade.pnl)) : 'Pending'}
                                                        </span>
                                                    </div>
                                                </div>
                                                {trade.notes && (
                                                    <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                                        <strong>Notes:</strong> {trade.notes}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex gap-2 ml-4">
                                                <button
                                                    onClick={() => onEditTrade(trade)}
                                                    className="text-blue-500 hover:text-blue-700 p-1"
                                                    title="Edit Trade"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    onClick={() => onDeleteTrade(trade.id)}
                                                    className="text-red-500 hover:text-red-700 p-1"
                                                    title="Delete Trade"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* News Events Section */}
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Economic News ({filteredNews.length}/{dayNews.length})
                            </h3>
                        </div>

                        {/* News Filters */}
                        {dayNews.length > 0 && (
                            <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                                <div className="flex items-center gap-2 mb-2">
                                    <Filter size={16} className="text-gray-600 dark:text-gray-300" />
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter News:</span>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    {/* Currency Filter */}
                                    <div className="flex items-center gap-2">
                                        <label className="text-xs text-gray-600 dark:text-gray-400">Currency:</label>
                                        <select
                                            value={newsFilters.currency}
                                            onChange={(e) => onNewsFiltersChange({ ...newsFilters, currency: e.target.value })}
                                            className="text-xs px-2 py-1 border rounded focus:outline-none focus:border-blue-500 bg-white dark:bg-gray-600 border-gray-300 dark:border-gray-500 text-gray-900 dark:text-white"
                                        >
                                            <option value="ALL">All Currencies</option>
                                            {currencies.map(currency => (
                                                <option key={currency} value={currency}>{currency}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Impact Filter */}
                                    <div className="flex items-center gap-2">
                                        <label className="text-xs text-gray-600 dark:text-gray-400">Impact:</label>
                                        <select
                                            value={newsFilters.impact}
                                            onChange={(e) => onNewsFiltersChange({ ...newsFilters, impact: e.target.value })}
                                            className="text-xs px-2 py-1 border rounded focus:outline-none focus:border-blue-500 bg-white dark:bg-gray-600 border-gray-300 dark:border-gray-500 text-gray-900 dark:text-white"
                                        >
                                            <option value="ALL">All Impact</option>
                                            {impacts.map(impact => (
                                                <option key={impact} value={impact}>{impact.charAt(0).toUpperCase() + impact.slice(1)}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Clear Filters */}
                                    {(newsFilters.currency !== 'ALL' || newsFilters.impact !== 'ALL') && (
                                        <button
                                            onClick={() => onNewsFiltersChange({ currency: 'ALL', impact: 'ALL' })}
                                            className="text-xs px-2 py-1 bg-gray-500 dark:bg-gray-600 text-white rounded hover:bg-gray-600 dark:hover:bg-gray-700 transition-colors"
                                        >
                                            Clear
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}

                        {dayNews.length === 0 ? (
                            <div className="text-center py-8 text-gray-500 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                <Calendar size={32} className="mx-auto mb-2 text-gray-400" />
                                <p>No economic events on this day</p>
                            </div>
                        ) : filteredNews.length === 0 ? (
                            <div className="text-center py-8 text-gray-500 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                <Filter size={32} className="mx-auto mb-2 text-gray-400" />
                                <p>No events match the selected filters</p>
                                <p className="text-sm mt-1">Try adjusting your currency or impact filters</p>
                            </div>
                        ) : (
                            <div className="space-y-3 max-h-96 overflow-y-auto">
                                {filteredNews.map((news, index) => (
                                    <div
                                        key={index}
                                        className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600"
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className={`px-2 py-1 rounded text-xs border ${getImpactBadgeStyle(news.impact)}`}>
                                                        {news.impact?.toUpperCase()}
                                                    </span>
                                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {news.currency}
                                                    </span>
                                                    {news.time && (
                                                        <span className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1">
                                                            <Clock size={12} />
                                                            {news.time}
                                                        </span>
                                                    )}
                                                </div>
                                                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                                                    {news.event}
                                                </h4>
                                                {(news.forecast || news.previous || news.actual) && (
                                                    <div className="grid grid-cols-3 gap-2 text-xs mt-2">
                                                        {news.forecast && (
                                                            <div>
                                                                <span className="text-gray-600 dark:text-gray-400">Forecast: </span>
                                                                <span className="text-gray-900 dark:text-white">{news.forecast}</span>
                                                            </div>
                                                        )}
                                                        {news.previous && (
                                                            <div>
                                                                <span className="text-gray-600 dark:text-gray-400">Previous: </span>
                                                                <span className="text-gray-900 dark:text-white">{news.previous}</span>
                                                            </div>
                                                        )}
                                                        {news.actual && (
                                                            <div>
                                                                <span className="text-gray-600 dark:text-gray-400">Actual: </span>
                                                                <span className="text-gray-900 dark:text-white">{news.actual}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DayDetailModal;