import type { AppState, Product, SalesLog } from '../config';

export const STORAGE_KEY = 'jagaproduk_state_v1';

export const DEFAULT_STATE: AppState = {
  userLoggedIn: false,
  products: [],
  salesLogs: [],
};

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return JSON.parse(JSON.stringify(DEFAULT_STATE));
    const parsed = JSON.parse(raw);
    return {
      userLoggedIn: !!parsed.userLoggedIn,
      products: parsed.products || [],
      salesLogs: parsed.salesLogs || [],
    };
  } catch {
    return JSON.parse(JSON.stringify(DEFAULT_STATE));
  }
}

export function saveState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // silently ignore storage full / private mode
  }
}
