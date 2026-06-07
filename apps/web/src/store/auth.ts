import { create } from "zustand";
import { persist } from "zustand/middleware";
import { request } from "../api/client.js";
import type { ApiResponse, LoginParams } from "../types.js";

export interface User {
  id: number;
  username: string;
  nickname?: string;
  roles: string[];
  permissions: string[];
}

interface AuthState {
  token: string | null;
  user: User | null;
  login: (data: LoginParams) => Promise<void>;
  logout: () => void;
  loadUser: () => Promise<void>;
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,

      login: async ({ username, password }: LoginParams) => {
        const res = await request<
          ApiResponse<{ token: string; user: User }>
        >("auth/login", {
          method: "post",
          json: { username, password },
        });
        set({ token: res.data.token, user: res.data.user });
      },

      logout: () => {
        set({ token: null, user: null });
      },

      loadUser: async () => {
        const token = get().token;
        if (!token) throw new Error("No token");

        const res = await request<ApiResponse<{ user: User }>>("auth/verify", {
          headers: { Authorization: `Bearer ${token}` },
        });
        set({ user: res.data.user });
      },
    }),
    {
      name: "auth",
      partialize: (state) => ({ token: state.token, user: state.user }),
    },
  ),
);
