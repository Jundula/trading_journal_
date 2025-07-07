import React, { useState, useEffect } from 'react';
import Header from './components/Layout/Header';
import Navigation from './components/Layout/Navigation';
import Modal from './components/Layout/Modal';
import CalendarView from './components/Calendar/CalendarView';
import TradeForm from './components/Trades/TradeForm';
import TradesCalendarView from './components/Trades/TradesCalendarView';
import { useTrades, useNewsData, useFilters, useWeeklyPlan, useTheme } from './hooks';
import { TABS } from './utils/constants';

const App = () => {
    const [activeTab, setActiveTab] = useState('calendar');
    const [showTradeForm, setShowTradeForm] = useState(false);
    const [editingTrade, setEditingTrade] = useState(null);
    const [tradesView, setTradesView] = useState('calendar'); // 'calendar' or 'table'

    // Custom hooks
    const { trades, tradeStats, saveTrade, deleteTrade, importTrades, clearAllTrades, getSortedTrades } = useTrades();
    const { newsData, currencies, impacts, importNews, clearAllNews, getFilteredNews, getWeeklyData, getNewsEvents } = useNewsData();
    const { filters, setCurrency, toggleImpact, selectAllImpacts, clearAllImpacts } = useFilters();
    const { weeklyPlan, updatePlan } = useWeeklyPlan();
    const { isDark, toggleTheme } = useTheme();

    // Set document title
    useEffect(() => {
        document.title = 'BOT TOX';
    }, []);

    // Get filtered data for display
    const filteredNews = getFilteredNews(filters);
    const weeklyData = getWeeklyData(filters);
    const sortedTrades = getSortedTrades();
    const newsEvents = getNewsEvents();

    // Event handlers
    const handleImportNews = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        try {
            const result = await importNews(file);
            alert(`Successfully imported ${result.imported.length} news events!`);
        } catch (error) {
            alert(error.message);
        }
        event.target.value = '';
    };

    const handleImportTrades = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        try {
            const result = await importTrades(file);
            alert(`Successfully imported ${result.imported.length} trades!`);
        } catch (error) {
            alert(error.message);
        }
        event.target.value = '';
    };

    const handleClearNews = () => {
        if (clearAllNews()) {
            alert('All news data cleared');
        }
    };

    const handleNewTrade = (prefilledDate = null) => {
        setEditingTrade(prefilledDate ? { entryDate: prefilledDate } : null);
        setShowTradeForm(true);
    };

    const handleSaveTrade = (tradeData) => {
        saveTrade(tradeData, !!editingTrade);
        setShowTradeForm(false);
        setEditingTrade(null);
    };

    const handleEditTrade = (trade) => {
        setEditingTrade(trade);
        setShowTradeForm(true);
    };

    const handleCloseTradeForm = () => {
        setShowTradeForm(false);
        setEditingTrade(null);
    };

    return (
        <div className="max-w-7xl mx-auto p-6 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg transition-colors">
                <Header
                    onImportNews={handleImportNews}
                    onImportTrades={handleImportTrades}
                    onClearNews={handleClearNews}
                    onNewTrade={handleNewTrade}
                    newsCount={newsData.length}
                    isDark={isDark}
                    onThemeToggle={toggleTheme}
                />

                <Navigation
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    tabs={TABS}
                />

                <div className="p-6 bg-white dark:bg-gray-800 transition-colors">
                    {activeTab === 'calendar' && (
                        <CalendarView
                            newsData={newsData}
                            weeklyData={weeklyData}
                            filters={filters}
                            currencies={currencies}
                            impacts={impacts}
                            filteredCount={filteredNews.length}
                            weeklyPlan={weeklyPlan}
                            setWeeklyPlan={updatePlan}
                            onCurrencyChange={setCurrency}
                            onToggleImpact={toggleImpact}
                            onSelectAllImpacts={selectAllImpacts}
                            onClearAllImpacts={clearAllImpacts}
                        />
                    )}

                    {activeTab === 'trades' && (
                        <div className="space-y-6">
                            {/* View Toggle */}
                            <div className="flex justify-between items-center">
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setTradesView('calendar')}
                                        className={`px-4 py-2 rounded transition-colors ${
                                            tradesView === 'calendar'
                                                ? 'bg-blue-500 text-white'
                                                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                                        }`}
                                    >
                                        Calendar View
                                    </button>
                                    <button
                                        onClick={() => setTradesView('table')}
                                        className={`px-4 py-2 rounded transition-colors ${
                                            tradesView === 'table'
                                                ? 'bg-blue-500 text-white'
                                                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                                        }`}
                                    >
                                        Table View
                                    </button>
                                </div>
                                <button
                                    onClick={clearAllTrades}
                                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-sm"
                                >
                                    Clear All Trades
                                </button>
                            </div>

                            {/* Calendar View */}
                            {tradesView === 'calendar' && (
                                <TradesCalendarView 
                                    trades={trades} 
                                    newsData={newsData}
                                    onEditTrade={handleEditTrade}
                                    onDeleteTrade={deleteTrade}
                                    onAddTrade={handleNewTrade}
                                />
                            )}

                            {/* Table View */}
                            {tradesView === 'table' && (
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <h2 className="text-xl font-semibold dark:text-white">Trade History</h2>
                                    </div>

                                    {trades.length === 0 ? (
                                        <div className="text-center py-8 text-gray-500">
                                            <p>No trades recorded yet.</p>
                                            <p className="text-sm mt-2">Click "New Trade" or "Import Trades CSV" to get started.</p>
                                        </div>
                                    ) : (
                                        <div className="overflow-x-auto dark:text-gray-300">
                                            <table className="w-full border-collapse border dark:border-gray-300">
                                                <thead>
                                                    <tr className="bg-gray-100 dark:bg-gray-700">
                                                        <th className="border border-gray-300 dark:border-gray-500 p-2 text-left">Date</th>
                                                        <th className="border border-gray-300 dark:border-gray-500 p-2 text-left">Symbol</th>
                                                        <th className="border border-gray-300 dark:border-gray-500 p-2 text-left">Direction</th>
                                                        <th className="border border-gray-300 dark:border-gray-500 p-2 text-left">Quantity</th>
                                                        <th className="border border-gray-300 dark:border-gray-500 p-2 text-left">Entry</th>
                                                        <th className="border border-gray-300 dark:border-gray-500 p-2 text-left">Exit</th>
                                                        <th className="border border-gray-300 dark:border-gray-500 p-2 text-left">P&L</th>
                                                        <th className="border border-gray-300 dark:border-gray-500 p-2 text-left">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {sortedTrades.map(trade => (
                                                        <tr key={trade.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                                                            <td className="border border-gray-300 dark:border-gray-500 p-2">{trade.entryDate || trade.date}</td>
                                                            <td className="border border-gray-300 dark:border-gray-500 p-2 font-medium">{trade.symbol || trade.asset}</td>
                                                            <td className="border border-gray-300 dark:border-gray-500 p-2">
                                                                <span className={`px-2 py-1 rounded text-xs ${
                                                                    (trade.direction === 'LONG' || trade.direction === 'BUY') 
                                                                        ? 'bg-green-100 text-green-800' 
                                                                        : 'bg-red-100 text-red-800'
                                                                }`}>
                                                                    {trade.direction}
                                                                </span>
                                                            </td>
                                                            <td className="border border-gray-300 dark:border-gray-500 p-2">{trade.quantity || trade.size}</td>
                                                            <td className="border border-gray-300 dark:border-gray-500 p-2">{trade.entryPrice || trade.entry}</td>
                                                            <td className="border border-gray-300 dark:border-gray-500 p-2">{trade.exitPrice || trade.exit || '-'}</td>
                                                            <td className="border border-gray-300 dark:border-gray-500 p-2">
                                                                <span className={`font-medium ${
                                                                    parseFloat(trade.pnl) > 0 ? 'text-green-600' :
                                                                    parseFloat(trade.pnl) < 0 ? 'text-red-600' : 'text-gray-600'
                                                                }`}>
                                                                    {trade.pnl ? `${trade.pnl}` : '-'}
                                                                </span>
                                                            </td>
                                                            <td className="border border-gray-300 dark:border-gray-500 p-2">
                                                                <div className="flex gap-2">
                                                                    <button
                                                                        onClick={() => handleEditTrade(trade)}
                                                                        className="text-blue-500 hover:text-blue-700"
                                                                    >
                                                                        Edit
                                                                    </button>
                                                                    <button
                                                                        onClick={() => deleteTrade(trade.id)}
                                                                        className="text-red-500 hover:text-red-700"
                                                                    >
                                                                        Delete
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'analysis' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border dark:border-blue-800">
                                    <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Total Trades</h3>
                                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{tradeStats.totalTrades}</p>
                                </div>
                                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border dark:border-green-800">
                                    <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">Win Rate</h3>
                                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">{tradeStats.winRate}%</p>
                                </div>
                                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border dark:border-purple-800">
                                    <h3 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">Gross P&L</h3>
                                    <p className={`text-2xl font-bold ${tradeStats.grossPnL >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                        ${tradeStats.grossPnL.toFixed(2)}
                                    </p>
                                </div>
                                <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border dark:border-orange-800">
                                    <h3 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">Net P&L</h3>
                                    <p className={`text-2xl font-bold ${tradeStats.netPnL >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                        ${tradeStats.netPnL.toFixed(2)}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border dark:border-gray-600">
                                    <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">Trade Breakdown</h3>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-gray-700 dark:text-gray-300">Winning Trades:</span>
                                            <span className="text-green-600 dark:text-green-400 font-medium">{tradeStats.winningTrades}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-700 dark:text-gray-300">Losing Trades:</span>
                                            <span className="text-red-600 dark:text-red-400 font-medium">{tradeStats.losingTrades}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-700 dark:text-gray-300">Average Win:</span>
                                            <span className="text-green-600 dark:text-green-400 font-medium">${tradeStats.avgWin.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-700 dark:text-gray-300">Average Loss:</span>
                                            <span className="text-red-600 dark:text-red-400 font-medium">${tradeStats.avgLoss.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-700 dark:text-gray-300">Profit Factor:</span>
                                            <span className="text-blue-600 dark:text-blue-400 font-medium">{tradeStats.profitFactor}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border dark:border-gray-600">
                                    <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">Cost Analysis</h3>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-gray-700 dark:text-gray-300">Total Commission:</span>
                                            <span className="text-red-600 dark:text-red-400 font-medium">-${tradeStats.totalCommission.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-700 dark:text-gray-300">Total Fees:</span>
                                            <span className="text-red-600 dark:text-red-400 font-medium">-${tradeStats.totalFees.toFixed(2)}</span>
                                        </div>
                                        <hr className="my-2 border-gray-300 dark:border-gray-600" />
                                        <div className="flex justify-between font-semibold">
                                            <span className="text-gray-700 dark:text-gray-300">Net Profit:</span>
                                            <span className={`${tradeStats.netPnL >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                                ${tradeStats.netPnL.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <Modal
                isOpen={showTradeForm}
                onClose={handleCloseTradeForm}
                title={editingTrade ? 'Edit Trade' : 'New Trade'}
                maxWidth="max-w-2xl"
            >
                <TradeForm
                    trade={editingTrade}
                    onSave={handleSaveTrade}
                    onCancel={handleCloseTradeForm}
                    newsEvents={newsEvents}
                />
            </Modal>
        </div>
    );
};

export default App;