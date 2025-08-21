import { create } from "zustand";

type UIState = {
  accountOpen: boolean;
  openAccount: () => void;
  closeAccount: () => void;
  toggleAccount: () => void;
};

export const useUI = create<UIState>((set, get) => ({
  accountOpen: false,
  openAccount: () => set({ accountOpen: true }),
  closeAccount: () => set({ accountOpen: false }),
  toggleAccount: () => set({ accountOpen: !get().accountOpen }),
}));
