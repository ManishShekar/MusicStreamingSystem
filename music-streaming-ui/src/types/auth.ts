export type Role = "Admin" | "User";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginResponse {
  userId: number;
  userName: string;
  email: string;
  role: Role;
  token: string;
}

export interface AuthState {
  userId: number | null;
  userName: string | null;
  email: string | null;
  role: Role | null;
  token: string | null;
  isAuthenticated: boolean;
}
