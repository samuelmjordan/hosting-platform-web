export interface Specification {
  type: SpecificationType;
  specification_id: string;
  title: string;
  caption: string;
  ram_gb: number;
  cpu: number;
  ssd_gb: number;
}

export interface Price {
  price_id: string;
  product_id: string;
  active: boolean;
  currency: SupportedCurrency;
  minor_amount: number;
}

export interface Plan {
  price: Price,
  specification: Specification
}

export interface Region {
  region_id: string;
  continent: string;
  continent_code: string;
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

export type SpecificationType = 'GAME_SERVER' | 'ACCOUNT_TIER';