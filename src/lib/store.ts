import { create } from "zustand";

interface ApplicationState {
	applicationId: string | null;
	setApplicationId: (id: string) => void;
}

export const useApplicationStore = create<ApplicationState>((set) => ({
	applicationId: null,
	setApplicationId: (id) => set({ applicationId: id }),
}));
