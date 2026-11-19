// Data bisnis default dan konstanta aplikasi (dibaca komponen, tidak diubah di runtime)
export type ProductCategory = 'kopi' | 'bahan' | 'makanan' | 'minuman';

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

export interface UserLogin {
  username: string;
  password: string;
}

export interface AppState {
  userLoggedIn: boolean;
  products: Product[];
  salesLogs: SalesLog[];
}

export const STORAGE_KEY = 'jagaproduk_state_v1';

export const STATIC_CREDENTIAL: UserLogin = {
  username: 'admin',
  password: 'jaga123',
};

export const DEFAULT_STATE: AppState = {
  userLoggedIn: false,
  products: [
    {
      id: 'p1',
      name: 'Biji Kopi Arabika',
      category: 'kopi',
      unit: 'kg',
      stock: 12,
      minStock: 5,
      expiryDate: '',
      costPrice: 120000,
    },
    {
      id: 'p2',
      name: 'Gula Pasir',
      category: 'bahan',
      unit: 'kg',
      stock: 8,
      minStock: 3,
      expiryDate: '',
      costPrice: 15000,
    },
    {
      id: 'p3',
      name: 'Roti Manis',
      category: 'makanan',
      unit: 'pcs',
      stock: 25,
      minStock: 10,
      expiryDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    },
    {
      id: 'p4',
      name: 'Teh Kotak',
      category: 'minuman',
      unit: 'kotak',
      stock: 30,
      minStock: 15,
      expiryDate: '',
    },
    {
      id: 'p5',
      name: 'Mie Instan',
      category: 'makanan',
      unit: 'pcs',
      stock: 40,
      minStock: 20,
      expiryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    },
    {
      id: 'p6',
      name: 'Semen Bambu',
      category: 'bahan',
      unit: 'bal',
      stock: 3,
      minStock: 2,
      expiryDate: '',
      costPrice: 450000,
    },
  ],
  salesLogs: [
    // Minggu ini (7 hari terakhir)
    { id: 's1', date: '2026-11-18', productId: 'p1', qty: 3 },
    { id: 's2', date: '2026-11-18', productId: 'p2', qty: 5 },
    { id: 's3', date: '2026-11-18', productId: 'p3', qty: 12 },
    { id: 's4', date: '2026-11-17', productId: 'p1', qty: 2 },
    { id: 's5', date: '2026-11-17', productId: 'p4', qty: 8 },
    { id: 's6', date: '2026-11-17', productId: 'p5', qty: 20 },
    { id: 's7', date: '2026-11-16', productId: 'p2', qty: 4 },
    { id: 's8', date: '2026-11-16', productId: 'p3', qty: 15 },
    { id: 's9', date: '2026-11-15', productId: 'p1', qty: 4 },
    { id: 's10', date: '2026-11-15', productId: 'p5', qty: 18 },
    { id: 's11', date: '2026-11-14', productId: 'p3', qty: 10 },
    { id: 's12', date: '2026-11-14', productId: 'p4', qty: 6 },
    { id: 's13', date: '2026-11-13', productId: 'p1', qty: 2 },
    { id: 's14', date: '2026-11-13', productId: 'p2', qty: 3 },
    { id: 's15', date: '2026-11-13', productId: 'p5', qty: 25 },
    // Minggu lalu
    { id: 's16', date: '2026-11-09', productId: 'p1', qty: 5 },
    { id: 's17', date: '2026-11-09', productId: 'p3', qty: 22 },
    { id: 's18', date: '2026-11-08', productId: 'p4', qty: 10 },
    { id: 's19', date: '2026-11-08', productId: 'p5', qty: 30 },
    { id: 's20', date: '2026-11-07', productId: 'p2', qty: 6 },
    { id: 's21', date: '2026-11-07', productId: 'p3', qty: 18 },
    { id: 's22', date: '2026-11-06', productId: 'p1', qty: 3 },
    { id: 's23', date: '2026-11-06', productId: 'p4', qty: 7 },
    { id: 's24', date: '2026-11-05', productId: 'p5', qty: 35 },
    { id: 's25', date: '2026-11-05', productId: 'p2', qty: 4 },
    { id: 's26', date: '2026-11-04', productId: 'p3', qty: 25 },
    { id: 's27', date: '2026-11-04', productId: 'p1', qty: 6 },
    { id: 's28', date: '2026-11-03', productId: 'p4', qty: 9 },
    { id: 's29', date: '2026-11-03', productId: 'p5', qty: 40 },
    { id: 's30', date: '2026-11-02', productId: 'p3', qty: 30 },
  ],
};

export const EXPIRY_NEAR_DAYS = 3; // mendekati kadaluarsa jika <= 3 hari
