import { create } from 'zustand';
import { Price, Region, StoreSelection } from '@/app/types';

interface StoreState extends StoreSelection {
  setPrice: (price: Price | null) => void;
  setRegion: (region: Region | null) => void;
  reset: () => void;
}

export const useStore = create<StoreState>((set) => ({
  price: null,
  region: null,
  setPrice: (price) => set({ price }),
  setRegion: (region) => set({ region }),
  reset: () => set({ price: null, region: null })
}));