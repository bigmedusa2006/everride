
export function formatCurrency(amount: number | null | undefined, currency: string = 'USD') {
    if (amount === null || amount === undefined) {
        return '$--.--';
    }
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
    }).format(amount);
}
