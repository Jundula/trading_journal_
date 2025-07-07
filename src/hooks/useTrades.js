import { useLocalStorage } from './useLocalStorage';
import { STORAGE_KEYS } from '../utils/constants';
import { calculateTradeStats } from '../utils/tradeCalculations';
import { importTradesCSV } from '../utils/csvImport';

/**
 * Custom hook for managing trades data
 * @returns {object} - Trades state and management functions
 */
export const useTrades = () => {
    const [trades, setTrades, clearTrades] = useLocalStorage(STORAGE_KEYS.TRADES, []);

    // Calculate trade statistics
    const tradeStats = calculateTradeStats(trades);

    // Add a new trade
    const addTrade = (tradeData) => {
        const newTrade = {
            ...tradeData,
            id: tradeData.id || Date.now(),
            // Backward compatibility fields
            date: tradeData.entryDate || tradeData.date,
            asset: tradeData.symbol || tradeData.asset,
            entry: tradeData.entryPrice || tradeData.entry,
            exit: tradeData.exitPrice || tradeData.exit,
            size: tradeData.quantity || tradeData.size
        };
        
        setTrades(prev => [...prev, newTrade]);
    };

    // Update an existing trade
    const updateTrade = (tradeId, updatedData) => {
        setTrades(prev => prev.map(trade => 
            trade.id === tradeId 
                ? { 
                    ...trade, 
                    ...updatedData,
                    // Maintain backward compatibility
                    date: updatedData.entryDate || updatedData.date || trade.date,
                    asset: updatedData.symbol || updatedData.asset || trade.asset,
                    entry: updatedData.entryPrice || updatedData.entry || trade.entry,
                    exit: updatedData.exitPrice || updatedData.exit || trade.exit,
                    size: updatedData.quantity || updatedData.size || trade.size
                }
                : trade
        ));
    };

    // Delete a trade
    const deleteTrade = (tradeId) => {
        setTrades(prev => prev.filter(trade => trade.id !== tradeId));
    };

    // Save trade (add or update)
    const saveTrade = (tradeData, isEditing = false) => {
        if (isEditing) {
            updateTrade(tradeData.id, tradeData);
        } else {
            addTrade(tradeData);
        }
    };

    // Import trades from CSV
    const importTrades = async (file) => {
        try {
            const result = await importTradesCSV(file, trades);
            setTrades(prev => [...prev, ...result.imported]);
            return result;
        } catch (error) {
            throw error;
        }
    };

    // Clear all trades
    const clearAllTrades = () => {
        if (window.confirm('Are you sure you want to clear all trades data?')) {
            clearTrades();
            return true;
        }
        return false;
    };

    // Get sorted trades (most recent first)
    const getSortedTrades = () => {
        return [...trades].sort((a, b) => 
            new Date(b.entryDate || b.date) - new Date(a.entryDate || a.date)
        );
    };

    // Filter trades by various criteria
    const filterTrades = (criteria) => {
        return trades.filter(trade => {
            if (criteria.symbol && trade.symbol !== criteria.symbol) return false;
            if (criteria.direction && trade.direction !== criteria.direction) return false;
            if (criteria.dateFrom && (trade.entryDate || trade.date) < criteria.dateFrom) return false;
            if (criteria.dateTo && (trade.entryDate || trade.date) > criteria.dateTo) return false;
            if (criteria.profitableOnly && parseFloat(trade.pnl || 0) <= 0) return false;
            return true;
        });
    };

    return {
        trades,
        tradeStats,
        addTrade,
        updateTrade,
        deleteTrade,
        saveTrade,
        importTrades,
        clearAllTrades,
        getSortedTrades,
        filterTrades
    };
};