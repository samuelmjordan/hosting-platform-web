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
  subscription: {
    subscription_id: string;
    customer_id: string;
    status: string;
    price_id: string;
    current_period_end: number;
    current_period_start: number;
    cancel_at_period_end: boolean;
    metadata: {
      REGION: string;
    };
  };
  game_server: {
    server_id: string;
    subscription_id: string;
    plan_id: string;
    node_id: string;
  };
  dns_cname_record: {
    server_id: string;
    c_name_record_id: string;
    zone_id: string;
    zone_name: string;
    record_name: string;
    content: string;
  };
}

export type SupportedCurrency = 'USD' | 'EUR' | 'GBP' | 'XXX';

export type SpecificationType = 'GAME_SERVER' | 'ACCOUNT_TIER';