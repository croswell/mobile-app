import { create } from "zustand";
import { makeSeed } from "../mocks/seed";

type DataState = ReturnType<typeof makeSeed>;
export const useData = create<DataState>(() => makeSeed());
