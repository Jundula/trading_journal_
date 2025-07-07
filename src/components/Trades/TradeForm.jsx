import React, { useState } from 'react';
import { Save } from 'lucide-react';
import { ASSETS, DIRECTIONS, CYCLE_TIMEFRAMES } from '../../utils/constants';
import { getTodayISO } from '../../utils/dateUtils';

const TradeForm = ({ trade, onSave, onCancel, newsEvents = [] }) => {
    const [formData, setFormData] = useState({
        tradeId: trade?.tradeId || '',
        symbol: trade?.symbol || 'EURUSD',
        quantity: trade?.quantity || '',
        entryDate: trade?.entryDate || getTodayISO(),
        entryTime: trade?.entryTime || '',
        exitDate: trade?.exitDate || '',
        exitTime: trade?.exitTime || '',
        duration: trade?.duration || '',
        entryPrice: trade?.entryPrice || '',
        exitPrice: trade?.exitPrice || '',
        pnl: trade?.pnl || '',
        commission: trade?.commission || '',
        fees: trade?.fees || '',
        direction: trade?.direction || 'LONG',
        newsEvent: trade?.newsEvent || '',
        strategy: trade?.strategy || '',
        notes: trade?.notes || '',
        cycleTimeframe: trade?.cycleTimeframe || 'Weekly/Daily'
    });

    const handleSubmit = () => {
        if (!formData.entryDate || !formData.entryPrice || !formData.quantity) {
            alert('Please fill in required fields: Entry Date, Entry Price, and Quantity');
            return;
        }
        onSave({
            ...formData,
            id: trade?.id || Date.now(),
            date: formData.entryDate,
            asset: formData.symbol,
            entry: formData.entryPrice,
            exit: formData.exitPrice,
            size: formData.quantity
        });
    };

    const inputClassName = "w-full p-2 border rounded focus:outline-none focus:border-blue-500 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white transition-colors";
    const labelClassName = "block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300";

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className={labelClassName}>Trade ID</label>
                    <input
                        type="text"
                        value={formData.tradeId}
                        onChange={(e) => setFormData({ ...formData, tradeId: e.target.value })}
                        className={inputClassName}
                        placeholder="Auto-generated if empty"
                    />
                </div>
                <div>
                    <label className={labelClassName}>Symbol *</label>
                    <select
                        value={formData.symbol}
                        onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
                        className={inputClassName}
                    >
                        {ASSETS.map(asset => (
                            <option key={asset} value={asset}>{asset}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className={labelClassName}>Entry Date *</label>
                    <input
                        type="date"
                        value={formData.entryDate}
                        onChange={(e) => setFormData({ ...formData, entryDate: e.target.value })}
                        className={inputClassName}
                        required
                    />
                </div>
                <div>
                    <label className={labelClassName}>Entry Time</label>
                    <input
                        type="time"
                        value={formData.entryTime}
                        onChange={(e) => setFormData({ ...formData, entryTime: e.target.value })}
                        className={inputClassName}
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className={labelClassName}>Direction</label>
                    <select
                        value={formData.direction}
                        onChange={(e) => setFormData({ ...formData, direction: e.target.value })}
                        className={inputClassName}
                    >
                        {DIRECTIONS.map(dir => (
                            <option key={dir.value} value={dir.value}>{dir.label}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className={labelClassName}>Quantity *</label>
                    <input
                        type="number"
                        step="0.01"
                        value={formData.quantity}
                        onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                        className={inputClassName}
                        placeholder="1.00"
                        required
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className={labelClassName}>Entry Price *</label>
                    <input
                        type="number"
                        step="0.00001"
                        value={formData.entryPrice}
                        onChange={(e) => setFormData({ ...formData, entryPrice: e.target.value })}
                        className={inputClassName}
                        placeholder="1.0500"
                        required
                    />
                </div>
                <div>
                    <label className={labelClassName}>Exit Price</label>
                    <input
                        type="number"
                        step="0.00001"
                        value={formData.exitPrice}
                        onChange={(e) => setFormData({ ...formData, exitPrice: e.target.value })}
                        className={inputClassName}
                        placeholder="1.0550"
                    />
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
                <div>
                    <label className={labelClassName}>P&L</label>
                    <input
                        type="number"
                        step="0.01"
                        value={formData.pnl}
                        onChange={(e) => setFormData({ ...formData, pnl: e.target.value })}
                        className={inputClassName}
                        placeholder="150.00"
                    />
                </div>
                <div>
                    <label className={labelClassName}>Commission</label>
                    <input
                        type="number"
                        step="0.01"
                        value={formData.commission}
                        onChange={(e) => setFormData({ ...formData, commission: e.target.value })}
                        className={inputClassName}
                        placeholder="5.00"
                    />
                </div>
                <div>
                    <label className={labelClassName}>Fees</label>
                    <input
                        type="number"
                        step="0.01"
                        value={formData.fees}
                        onChange={(e) => setFormData({ ...formData, fees: e.target.value })}
                        className={inputClassName}
                        placeholder="2.50"
                    />
                </div>
            </div>

            <div>
                <label className={labelClassName}>News Event</label>
                <select
                    value={formData.newsEvent}
                    onChange={(e) => setFormData({ ...formData, newsEvent: e.target.value })}
                    className={inputClassName}
                >
                    <option value="">Select News Event</option>
                    {newsEvents.map(event => (
                        <option key={event} value={event}>{event}</option>
                    ))}
                </select>
            </div>

            <div>
                <label className={labelClassName}>Strategy</label>
                <input
                    type="text"
                    value={formData.strategy}
                    onChange={(e) => setFormData({ ...formData, strategy: e.target.value })}
                    className={inputClassName}
                    placeholder="e.g., News correlation, SMT, Red folder setup"
                />
            </div>

            <div>
                <label className={labelClassName}>Cycle Timeframe</label>
                <select
                    value={formData.cycleTimeframe}
                    onChange={(e) => setFormData({ ...formData, cycleTimeframe: e.target.value })}
                    className={inputClassName}
                >
                    {CYCLE_TIMEFRAMES.map(tf => (
                        <option key={tf.value} value={tf.value}>{tf.label}</option>
                    ))}
                </select>
            </div>

            <div>
                <label className={labelClassName}>Notes</label>
                <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className={inputClassName}
                    rows="3"
                    placeholder="Trade analysis, market conditions, lessons learned..."
                />
            </div>

            <div className="flex gap-2 pt-4">
                <button
                    onClick={handleSubmit}
                    className="flex-1 bg-blue-500 dark:bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-600 dark:hover:bg-blue-700 flex items-center justify-center transition-colors"
                >
                    <Save size={16} className="mr-2" />
                    Save Trade
                </button>
                <button
                    onClick={onCancel}
                    className="flex-1 bg-gray-500 dark:bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-600 dark:hover:bg-gray-700 transition-colors"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default TradeForm;