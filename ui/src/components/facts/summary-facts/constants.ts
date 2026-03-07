// Business capability color mapping
export const BUSINESS_CAPABILITY_COLORS = {
    'portfolio-management': 'bg-blue-100 text-blue-800 border-blue-200',
    'customer-insights': 'bg-purple-100 text-purple-800 border-purple-200',
    'risk-assessment': 'bg-red-100 text-red-800 border-red-200',
    'trading-compliance': 'bg-orange-100 text-orange-800 border-orange-200',
    'market-monitoring': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'account-reconciliation': 'bg-green-100 text-green-800 border-green-200',
    'transaction-matching': 'bg-teal-100 text-teal-800 border-teal-200',
    'exception-handling': 'bg-cyan-100 text-cyan-800 border-cyan-200',
    'payment-processing': 'bg-indigo-100 text-indigo-800 border-indigo-200',
    'fraud-detection': 'bg-pink-100 text-pink-800 border-pink-200',
    'multi-channel-payments': 'bg-rose-100 text-rose-800 border-rose-200',
    'loan-origination': 'bg-emerald-100 text-emerald-800 border-emerald-200',
    'credit-assessment': 'bg-lime-100 text-lime-800 border-lime-200',
    'underwriting-automation': 'bg-violet-100 text-violet-800 border-violet-200'
} as const;

// Coverage level thresholds and colors
export const COVERAGE_LEVELS = {
    EXCELLENT: { min: 85, className: 'text-green-600 bg-green-100' },
    GOOD: { min: 70, className: 'text-yellow-600 bg-yellow-100' },
    POOR: { min: 0, className: 'text-red-600 bg-red-100' }
} as const;

export const getCoverageLevel = (percentage: number) => {
    if (percentage >= COVERAGE_LEVELS.EXCELLENT.min) return COVERAGE_LEVELS.EXCELLENT;
    if (percentage >= COVERAGE_LEVELS.GOOD.min) return COVERAGE_LEVELS.GOOD;
    return COVERAGE_LEVELS.POOR;
};
