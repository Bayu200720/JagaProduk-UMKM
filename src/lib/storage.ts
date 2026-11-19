// Penyimpanan localStorage (satu kunci) dengan fallback jika kosong/rusak
import { AppState, DEFAULT_STATE, STORAGE_KEY } from '../config';

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(DEFAULT_STATE);
    const parsed = JSON.parse(raw) as AppState;
    if (!parsed || typeof parsed !== 'object') return structuredClone(DEFAULT_STATE);
    if (!Array.isArray(parsed.products)) parsed.products = structuredClone(DEFAULT_STATE.products);
    if (!Array.isArray(parsed.salesLogs)) parsed.salesLogs = [];
    return parsed;
  } catch {
    return structuredClone(DEFAULT_STATE);
  }
}

export function saveState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Abaikan jika penyimpanan penuh/terblokir
  }
}
