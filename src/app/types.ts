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
  region_code: string;
  continent: string;
  continent_code: string;
  city: string;
}

export interface StoreSelection {
  price: Price | null;
  region: Region | null;
}

export interface Server {
  server_name: string;
  subscription_status: string;
  specification_title: string;
  current_period_end: number;
  current_period_start: number;
  cancel_at_period_end: boolean;
  currency: SupportedCurrency;
  minor_amount: number;
  region_code: string;
  cname_record_name: null | string;
}

export interface CurrencyAmount {
  type: SupportedCurrency;
  value: number;
}

export type SupportedCurrency = 'USD' | 'EUR' | 'GBP' | 'XXX';

export type SpecificationType = 'GAME_SERVER' | 'ACCOUNT_TIER';