import { create } from "zustand";

type LocationState = {
	lat: number | null;
	lng: number | null;
	setLocation: (lat: number, lng: number) => void;
	clearLocation: () => void;
};

export const useLocationStore = create<LocationState>((set) => ({
	lat: null,
	lng: null,
	setLocation: (lat, lng) => set({ lat, lng }),
	clearLocation: () => set({ lat: null, lng: null }),
}));
