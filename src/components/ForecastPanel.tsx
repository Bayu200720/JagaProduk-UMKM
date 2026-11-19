// Forecast permintaan 7 hari (moving average)
import type { AppState } from '../config';
import { calcForecast7Days } from '../lib/forecast';

interface Props {
  state: AppState;
}

export function ForecastPanel({ state }: Props) {
  if (state.products.length === 0) {
    return (
      <section className="p-4 sm:p-6 mb-6 bg-white rounded-2xl shadow-sm border border-neutral-200">
        <h2 className="text-lg font-semibold text-neutral-900 mb-2">Forecast Permintaan 7 Hari</h2>
        <p className="text-neutral-600 text-sm">Belum ada produk untuk dihitung forecast.</p>
      </section>
    );
  }

  return (
    <section className="p-4 sm:p-6 mb-6 bg-white rounded-2xl shadow-sm border border-neutral-200">
      <h2 className="text-lg font-semibold text-neutral-900 mb-4">Forecast Permintaan 7 Hari</h2>
      {state.products.map((p) => {
        const forecast = calcForecast7Days(state.salesLogs, p.id);
        const s = `~${forecast.avgPerDay} ${p.unit}/hari`;
        return (
          <div key={p.id} className="mb-3 p-3 bg-neutral-50 rounded-xl border border-neutral-200">
            <p className="text-neutral-900 font-medium mb-1">
              {p.name} ({p.category}): {s}
            </p>
            <p className="text-sm text-neutral-600">
              {forecast.note} Saran beli besok: ~{forecast.avgPerDay} {p.unit}.
            </p>
          </div>
        );
      })}
    </section>
  );
}
