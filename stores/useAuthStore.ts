import { User } from "@/types";
import { create } from "zustand";

type AuthState = {
	principal: User | undefined;
	setAuth: (user: AuthState["principal"]) => void;
	clearAuth: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
	principal: undefined,
	setAuth: (user) => set({ principal: user }),
	clearAuth: () => set({ principal: undefined }),
}));
