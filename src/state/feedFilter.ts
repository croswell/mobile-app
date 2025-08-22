import { create } from "zustand";

type FeedFilterState = {
  selected: string; // "All" | partner name
  setSelected: (v: string) => void;
};

export const useFeedFilter = create<FeedFilterState>((set) => ({
  selected: "All",
  setSelected: (v) => set({ selected: v }),
}));
