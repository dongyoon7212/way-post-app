import { User } from "@/types";
import { create } from "zustand";

type AuthState = {
	principal: User | null;
	setAuth: (user: AuthState["principal"]) => void;
	clearAuth: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
	principal: null,
	setAuth: (user) => set({ principal: user }),
	clearAuth: () => set({ principal: null }),
}));
