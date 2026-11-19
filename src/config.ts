// Data bisnis default dan konstanta aplikasi (dibaca komponen, tidak diubah di runtime)
export type ProductCategory = 'kopi' | 'bahan' | 'makanan';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  unit: string;
  stock: number;
  minStock: number;
  expiryDate: string; // YYYY-MM-DD, kosong jika tidak ada
  costPrice?: number; // opsional, rupiah bulat
}

export interface SalesLog {
  id: string;
  date: string; // YYYY-MM-DD
  productId: string;
  qty: number;
}

export interface AppState {
  products: Product[];
  salesLogs: SalesLog[];
}

export const STORAGE_KEY = 'jagaproduk_state_v1';

export const DEFAULT_STATE: AppState = {
  products: [
    {
      id: 'p1',
      name: 'Biji Kopi Arabika',
      category: 'kopi',
      unit: 'kg',
      stock: 5,
      minStock: 2,
      expiryDate: '',
      costPrice: 120000,
    },
    {
      id: 'p2',
      name: 'Gula Pasir',
      category: 'bahan',
      unit: 'kg',
      stock: 3,
      minStock: 1,
      expiryDate: '',
    },
    {
      id: 'p3',
      name: 'Roti Manis',
      category: 'makanan',
      unit: 'pcs',
      stock: 10,
      minStock: 5,
      expiryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    },
  ],
  salesLogs: [],
};

export const EXPIRY_NEAR_DAYS = 3; // mendekati kadaluarsa jika <= 3 hari
