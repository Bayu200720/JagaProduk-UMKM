export interface Credentials {
  username: string;
  password: string;
}

export interface AuthService {
  login(credentials: Credentials): boolean;
  logout(): void;
  isAuthenticated(): boolean;
}

const AUTH_KEY = 'jagaproduk_auth_v1';
const VALID_USERNAME = 'admin';
const VALID_PASSWORD = 'jaga123';

export function createLocalAuthService(): AuthService {
  return {
    login(credentials: Credentials): boolean {
      const ok =
        credentials.username.trim() === VALID_USERNAME &&
        credentials.password === VALID_PASSWORD;
      if (ok) {
        localStorage.setItem(AUTH_KEY, '1');
      }
      return ok;
    },
    logout(): void {
      localStorage.removeItem(AUTH_KEY);
    },
    isAuthenticated(): boolean {
      return localStorage.getItem(AUTH_KEY) === '1';
    },
  };
}

export const authService = createLocalAuthService();
