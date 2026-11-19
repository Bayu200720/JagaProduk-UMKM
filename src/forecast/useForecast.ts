import type { Product, SalesLog, AppState } from '../config';

export interface ForecastResult {
  avgPerDay: number;
  estimateTomorrow: number;
  daysUsed: number;
  note: string;
}

/**
 * Calculates 7-day forecast per product.
 * Accepts state and returns map of productId -> ForecastResult
 */
export function calculateForecasts(state: AppState): Record<string, ForecastResult> {
  const now = new Date();
  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(now.getDate() - 30);

  const recentLogs = state.salesLogs.filter(log => {
    const logDate = new Date(log.date);
    return logDate >= thirtyDaysAgo && logDate <= now;
  });

  // Group by productId
  const salesByProduct: Record<string, number[]> = recentLogs.reduce((acc, log) => {
    if (!acc[log.productId]) acc[log.productId] = [];
    acc[log.productId].push(log.qty);
    return acc;
  }, {} as Record<string, number[]>);

  const results: Record<string, ForecastResult> = {};

  // For each product in state
  state.products.forEach(product => {
    const quantities = salesByProduct[product.id] || [];
    const daysWithSales = new Set(quantities.map(() => true)).size; // simplified: count unique days
    // Actually we need to count unique dates, not quantities. Let me reconsider.

    // Count unique dates with sales for this product
    const datesWithSales = new Set(recentLogs
      .filter(log => log.productId === product.id)
      .map(log => log.date));

    const daysUsed = datesWithSales.size;
    let avgPerDay = 0;

    if (daysUsed >= 3) {
      // Sum all quantities for this product in the period
      const totalQty = recentLogs
        .filter(log => log.productId === product.id)
        .reduce((sum, log) => sum + log.qty, 0);
      avgPerDay = Math.round(totalQty / daysUsed);
    }

    const estimateTomorrow = avgPerDay; // same as avg per day
    const note = daysUsed < 3 ? 'Data kurang (buteh minimal 3 hari penjualan)' : '';

    results[product.id] = { avgPerDay, estimateTomorrow, daysUsed, note };
  });

  return results;
}
