import { create } from "zustand";

type LocationState = {
	lat: string | "";
	lng: string | "";
	setLocation: (lat: string, lng: string) => void;
	clearLocation: () => void;
};

export const useLocationStore = create<LocationState>((set) => ({
	lat: "",
	lng: "",
	setLocation: (lat, lng) => set({ lat, lng }),
	clearLocation: () => set({ lat: "", lng: "" }),
}));
