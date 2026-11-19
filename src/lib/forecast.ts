// Forecast permintaan 7 hari ke depan (moving average sederhana) dari log penjualan
import type { SalesLog } from '../config';

export interface ForecastResult {
  avgPerDay: number;
  daysUsed: number;
  note: string;
}

export function calcForecast7Days(
  salesLogs: SalesLog[],
  productId: string,
  lookbackDays = 30,
): ForecastResult {
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  const start = new Date(today);
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - lookbackDays + 1);

  const qtyByDate = new Map<string, number>();
  for (const log of salesLogs) {
    if (log.productId !== productId) continue;
    const d = new Date(log.date + 'T00:00:00');
    if (Number.isNaN(d.getTime()) || d < start || d > today) continue;
    qtyByDate.set(log.date, (qtyByDate.get(log.date) ?? 0) + log.qty);
  }

  const daysUsed = qtyByDate.size;
  const totalQty = Array.from(qtyByDate.values()).reduce((sum, qty) => sum + qty, 0);
  if (daysUsed < 3) {
    return { avgPerDay: 0, daysUsed, note: 'Data kurang (butuh minimal 3 hari penjualan).' };
  }
  const avgPerDay = Math.round(totalQty / daysUsed);
  return {
    avgPerDay,
    daysUsed,
    note: `Rata-rata per hari dari ${daysUsed} hari dengan penjualan (rentang maksimal ${lookbackDays} hari).`,
  };
}
