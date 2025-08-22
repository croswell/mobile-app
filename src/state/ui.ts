import { create } from "zustand";

type UIState = {
  accountOpen: boolean;
  openAccount: () => void;
  closeAccount: () => void;
  toggleAccount: () => void;
  showClubFilterDrawer: boolean;
  openClubFilterDrawer: () => void;
  closeClubFilterDrawer: () => void;
  toggleClubFilterDrawer: () => void;
  selectedClub: string;
  setSelectedClub: (club: string) => void;
  clubFilterOpen: boolean;
  openClubFilter: () => void;
  closeClubFilter: () => void;
  toggleClubFilter: () => void;
  bookDrawerOpen: boolean;
  openBookDrawer: () => void;
  closeBookDrawer: () => void;
  toggleBookDrawer: () => void;
};

export const useUI = create<UIState>((set, get) => ({
  accountOpen: false,
  openAccount: () => set({ accountOpen: true }),
  closeAccount: () => set({ accountOpen: false }),
  toggleAccount: () => set({ accountOpen: !get().accountOpen }),
  showClubFilterDrawer: false,
  openClubFilterDrawer: () => set({ showClubFilterDrawer: true }),
  closeClubFilterDrawer: () => set({ showClubFilterDrawer: false }),
  toggleClubFilterDrawer: () => set({ showClubFilterDrawer: !get().showClubFilterDrawer }),
  selectedClub: "All",
  setSelectedClub: (club: string) => set({ selectedClub: club }),
  clubFilterOpen: false,
  openClubFilter: () => set({ clubFilterOpen: true }),
  closeClubFilter: () => set({ clubFilterOpen: false }),
  toggleClubFilter: () => set((s) => ({ clubFilterOpen: !s.clubFilterOpen })),
  bookDrawerOpen: false,
  openBookDrawer: () => set({ bookDrawerOpen: true }),
  closeBookDrawer: () => set({ bookDrawerOpen: false }),
  toggleBookDrawer: () => set((s) => ({ bookDrawerOpen: !s.bookDrawerOpen })),
}));
