import { convertDateFormat } from './dateUtils';

/**
 * Parse CSV content with proper handling of quoted fields
 * @param {string} csvContent - Raw CSV content
 * @returns {Array} - Array of parsed rows
 */
const parseCSVContent = (csvContent) => {
    const lines = csvContent.split('\n').filter(line => line.trim());
    
    if (lines.length === 0) {
        throw new Error('CSV file appears to be empty');
    }

    const parsedLines = [];
    
    for (const line of lines) {
        const values = [];
        let current = '';
        let inQuotes = false;
        let quoteChar = null;

        for (let j = 0; j < line.length; j++) {
            const char = line[j];
            const nextChar = line[j + 1];

            if ((char === '"' || char === "'") && !inQuotes) {
                inQuotes = true;
                quoteChar = char;
            } else if (char === quoteChar && inQuotes) {
                if (nextChar === quoteChar) {
                    current += char;
                    j++;
                } else {
                    inQuotes = false;
                    quoteChar = null;
                }
            } else if (char === ',' && !inQuotes) {
                values.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        values.push(current.trim());
        parsedLines.push(values);
    }

    return parsedLines;
};

/**
 * Import news CSV data
 * @param {File} file - CSV file
 * @param {Array} existingNews - Existing news data
 * @returns {Promise<Array>} - New unique news events
 */
export const importNewsCSV = async (file, existingNews = []) => {
    try {
        const text = await file.text();
        const lines = parseCSVContent(text);
        
        const headers = lines[0].map(h => h.trim().replace(/"/g, ''));
        const dataLines = lines.slice(1);

        const newData = [];
        
        for (const values of dataLines) {
            if (values.length === 0 || !values.join('').trim()) continue;

            const row = {};
            headers.forEach((header, index) => {
                let value = values[index] || '';
                value = value.replace(/^["']|["']$/g, '');
                row[header] = value;
            });

            if (row.date && row.event) {
                row.dateISO = convertDateFormat(row.date);
                newData.push(row);
            }
        }

        // Remove duplicates
        const existingKeys = new Set(
            existingNews.map(item => `${item.date}-${item.time}-${item.currency}-${item.event}`)
        );

        const uniqueNewData = newData.filter(item => {
            const key = `${item.date}-${item.time}-${item.currency}-${item.event}`;
            return !existingKeys.has(key);
        });

        return {
            imported: uniqueNewData,
            duplicates: newData.length - uniqueNewData.length,
            total: newData.length
        };

    } catch (error) {
        console.error('Error importing news CSV:', error);
        throw new Error('Error importing CSV file. Please check the file format.');
    }
};

/**
 * Map CSV header to trade field
 * @param {string} header - CSV header
 * @param {string} value - Field value
 * @returns {object} - Mapped trade fields
 */
const mapTradeField = (header, value) => {
    const fields = {};
    
    switch (header.toLowerCase()) {
        case 'trade id':
            fields.tradeId = value;
            break;
        case 'symbol':
            fields.symbol = value;
            fields.asset = value; // For backward compatibility
            break;
        case 'quantity':
            fields.quantity = value;
            fields.size = value; // For backward compatibility
            break;
        case 'entry date':
            fields.entryDate = convertDateFormat(value);
            fields.date = convertDateFormat(value); // For backward compatibility
            break;
        case 'entry time':
            fields.entryTime = value;
            break;
        case 'exit date':
            fields.exitDate = convertDateFormat(value);
            break;
        case 'exit time':
            fields.exitTime = value;
            break;
        case 'duration':
            fields.duration = value;
            break;
        case 'entry price':
            fields.entryPrice = value;
            fields.entry = value; // For backward compatibility
            break;
        case 'exit price':
            fields.exitPrice = value;
            fields.exit = value; // For backward compatibility
            break;
        case 'p&l':
            fields.pnl = value;
            break;
        case 'commission':
            fields.commission = value;
            break;
        case 'fees':
            fields.fees = value;
            break;
        case 'direction':
            fields.direction = value.toUpperCase();
            break;
        default:
            // For any other fields, use as-is
            fields[header.toLowerCase().replace(/[^a-z0-9]/g, '')] = value;
    }
    
    return fields;
};

/**
 * Import trades CSV data
 * @param {File} file - CSV file
 * @param {Array} existingTrades - Existing trades data
 * @returns {Promise<Array>} - New unique trades
 */
export const importTradesCSV = async (file, existingTrades = []) => {
    try {
        const text = await file.text();
        const lines = text.split('\n').filter(line => line.trim());

        if (lines.length === 0) {
            throw new Error('CSV file appears to be empty');
        }

        // Parse headers - handle the case where all headers might be in one cell
        let headers = [];
        let dataLines = [];

        const firstLine = lines[0].trim();

        if (firstLine.includes('Trade ID') && firstLine.includes('Symbol')) {
            // All headers in one line, split by comma
            headers = firstLine.split(',').map(h => h.trim().replace(/"/g, '').toLowerCase());
            dataLines = lines.slice(1);
        } else {
            // Normal CSV format
            headers = firstLine.split(',').map(h => h.trim().replace(/"/g, '').toLowerCase());
            dataLines = lines.slice(1);
        }

        const newTrades = [];

        for (let i = 0; i < dataLines.length; i++) {
            const line = dataLines[i].trim();
            if (!line) continue;

            // Parse CSV line with proper comma handling
            const values = line.split(',').map(v => v.trim().replace(/"/g, ''));

            if (values.length !== headers.length) {
                console.warn(`Line ${i + 1}: Expected ${headers.length} columns, got ${values.length}`);
                continue;
            }

            // Create trade object with exact field mapping
            const trade = {
                id: Date.now() + Math.random(),
                cycleTimeframe: 'Weekly/Daily',
                newsEvent: '',
                strategy: '',
                notes: ''
            };

            headers.forEach((header, index) => {
                const value = values[index] || '';
                const mappedFields = mapTradeField(header, value);
                Object.assign(trade, mappedFields);
            });

            // Validate required fields
            if (trade.entryDate && trade.symbol && trade.entryPrice && trade.quantity) {
                newTrades.push(trade);
            } else {
                console.log('Skipping invalid trade:', trade);
            }
        }

        if (newTrades.length === 0) {
            throw new Error('No valid trades found. Please check your CSV format and ensure it has the required columns: Trade ID, Symbol, Quantity, Entry Date, Entry Price, etc.');
        }

        // Remove duplicates
        const existingKeys = new Set(
            existingTrades.map(item => `${item.entryDate || item.date}-${item.symbol || item.asset}-${item.entryPrice || item.entry}`)
        );

        const uniqueNewTrades = newTrades.filter(item => {
            const key = `${item.entryDate}-${item.symbol}-${item.entryPrice}`;
            return !existingKeys.has(key);
        });

        return {
            imported: uniqueNewTrades,
            duplicates: newTrades.length - uniqueNewTrades.length,
            total: newTrades.length
        };

    } catch (error) {
        console.error('Error importing trades CSV:', error);
        throw new Error('Error importing trades CSV file. Please check the file format.');
    }
};