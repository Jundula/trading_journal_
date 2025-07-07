// Trading assets list
export const ASSETS = [
    'EURUSD', 'GBPUSD', 'USDJPY', 'GBPJPY', 'AUDUSD', 
    'USDCAD', 'NZDUSD', 'EURGBP', 'EURJPY', 'EURCHF', 
    'NQ', 'ES', 'YM', 'RTY'
];

// Trading directions
export const DIRECTIONS = [
    { value: 'LONG', label: 'LONG' },
    { value: 'SHORT', label: 'SHORT' },
    { value: 'BUY', label: 'BUY' },
    { value: 'SELL', label: 'SELL' }
];

// Cycle timeframes
export const CYCLE_TIMEFRAMES = [
    { value: 'Monthly/Weekly', label: 'Monthly/Weekly' },
    { value: 'Weekly/Daily', label: 'Weekly/Daily' },
    { value: '90-min/Micro', label: '90-min/Micro' }
];

// Session before options for London behaviour
export const SESSION_BEFORE_OPTIONS = [
    'London Retracement',
    'London Consolidation',
    'London Expansion'
];

// Days of the week
export const WEEK_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

// Jacob's news event classification
export const HIGH_PROBABILITY_RED_EVENTS = [
    'Unemployment Claims', 'Initial Jobless Claims', 'Continuing Claims',
    'Retail Sales', 'Core Retail Sales', 'Advance Retail Sales',
    'PPI', 'Producer Price Index', 'Core PPI',
    'PCE Price Index', 'Core PCE Price Index', 'Personal Spending'
];

export const LOW_PROBABILITY_RED_EVENTS = [
    'Non Farm Payrolls', 'NFP', 'Non-Farm Payrolls', 'Nonfarm Payrolls',
    'CPI', 'Core CPI', 'Consumer Price Index', 'Core Consumer Price Index',
    'FOMC', 'Fed Fund Rate', 'Federal Fund Rate', 'Interest Rate Decision',
    'Fed Chair', 'Fed Speaks', 'FOMC Meeting', 'FOMC Statement',
    'Consumer Confidence', 'Michigan Consumer Sentiment'
];

export const ORANGE_FOLDER_EVENTS = [
    'Flash Manufacturing PMI', 'Manufacturing PMI', 'ISM Manufacturing',
    'Flash Services PMI', 'Services PMI', 'ISM Services',
    'Unemployment Rate', 'U6 Unemployment Rate',
    'GDP', 'Preliminary GDP', 'Final GDP', 'GDP Annualized',
    'Industrial Production', 'Capacity Utilization',
    'Housing Starts', 'Building Permits', 'New Home Sales',
    'Trade Balance', 'Goods Trade Balance', 'Current Account'
];

// Weekly plan field configurations
export const WEEKLY_PLAN_FIELDS = [
    {
        key: 'expectedbias',
        label: 'Expected Bias',
        placeholder: 'Bearish',
        type: 'input'
    },
    {
        key: 'sessionbefore',
        label: 'Session Before',
        placeholder: 'London Behaviour',
        type: 'select',
        options: SESSION_BEFORE_OPTIONS
    },
    {
        key: 'target',
        label: 'Target',
        placeholder: 'Old Lows',
        type: 'input'
    },
    {
        key: 'outcome',
        label: 'Outcome',
        placeholder: 'Target hit',
        type: 'input'
    },
    {
        key: 'notes',
        label: 'Notes',
        placeholder: 'Await liquidity',
        type: 'input'
    }
];

// Event type configurations for calendar display
export const EVENT_TYPES = [
    {
        key: 'highProbabilityRed',
        label: 'High Probability Red Events',
        bgColor: 'bg-red-100',
        textColor: 'text-red-900'
    },
    {
        key: 'lowProbabilityRed',
        label: 'Low Probability Red Events',
        bgColor: 'bg-red-50',
        textColor: 'text-red-700'
    },
    {
        key: 'orangeFolder',
        label: 'Orange Folder Event',
        bgColor: 'bg-orange-50',
        textColor: 'text-orange-800'
    },
    {
        key: 'yellow',
        label: 'Yellow Impact Events',
        bgColor: 'bg-yellow-50',
        textColor: 'text-yellow-800'
    },
    {
        key: 'gray',
        label: 'Gray Impact Events',
        bgColor: 'bg-gray-50',
        textColor: 'text-gray-700'
    }
];

// Local storage keys
export const STORAGE_KEYS = {
    NEWS: 'trading-journal-news',
    TRADES: 'trading-journal-trades',
    PLANS: 'trading-journal-plans'
};

// Application tabs
export const TABS = [
    { id: 'calendar', label: 'Calendar', icon: 'Calendar' },
    { id: 'trades', label: 'Trades', icon: 'TrendingUp' },
    { id: 'analysis', label: 'Analysis', icon: 'BarChart3' }
];