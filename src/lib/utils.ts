/**
 * Formats a number to Pakistani Rupees (PKR) format
 */
export function formatPKR(amount: number): string {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Formats a number to standard weight format (kg)
 */
export function formatWeight(weight: number): string {
  return `${weight.toFixed(2)} kg`;
}

/**
 * Generates a random tracking number for mock shipments
 */
export function generateTrackingNumber(): string {
  const prefix = 'NX';
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${prefix}${timestamp}${random}PK`;
}
