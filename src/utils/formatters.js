// Small shared utilities for consistent UI formatting

/**
 * Format a number as Indian Rupees (INR).
 * Falls back gracefully if input is not a finite number.
 */
export const formatCurrency = (value) => {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return 'N/A';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2
  }).format(amount);
};

/**
 * Shorten long text for compact display while keeping readability.
 */
export const truncateText = (text, max = 500) => {
  if (!text) return '';
  if (text.length <= max) return text;
  return text.substring(0, max) + '…';
};


