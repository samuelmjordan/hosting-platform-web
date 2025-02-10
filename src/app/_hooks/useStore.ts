import { create } from 'zustand';
import { Product, Region, StoreSelection } from '@/app/types';

interface StoreState extends StoreSelection {
  setProduct: (product: Product | null) => void;
  setRegion: (region: Region | null) => void;
  reset: () => void;
}

export const useStore = create<StoreState>((set) => ({
  product: null,
  region: null,
  setProduct: (product) => set({ product }),
  setRegion: (region) => set({ region }),
  reset: () => set({ product: null, region: null })
}));