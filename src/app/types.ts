export interface Specification {
  specId: string;
  title: string;
  ram: number;
  cpu: number;
}

export interface Price {
  priceId: string;
  productId: string;
  specId: string;
  active: boolean;
  currency: SupportedCurrency;
  minorAmount: number;
}

export interface Plan {
  price: Price,
  spec: Specification
}

export interface Region {
  regionId: string;
  continent: string;
  continentCode: string;
  city: string;
}

export interface StoreSelection {
  price: Price | null;
  region: Region | null;
}

export interface Server {
  id: bigint
  title: string
  description: string
  status: "Online" | "Offline" | "Pending"
  plan: Plan
  region: Region
}

export type SupportedCurrency = 'USD' | 'EUR' | 'GBP' | 'XXX';