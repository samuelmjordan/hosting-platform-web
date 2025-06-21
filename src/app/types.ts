export interface Specification {
  type: SpecificationType;
  specification_id: string;
  title: string;
  caption: string;
  ram_gb: number;
  cpu: number;
  ssd_gb: number;
}

export interface NavbarItem {
  label: string;
  href: string;
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

export interface StoreSelection {
  price: Price | null;
}

export interface Server {
  subscription_id: string;
  server_name: string;
  subscription_status: string;
  specification_title: string;
  ram_gb: number;
  vcpu: number;
  ssd_gb: number;
  current_period_end: number;
  current_period_start: number;
  cancel_at_period_end: boolean;
  currency: SupportedCurrency;
  minor_amount: number;
  region_code: string;
  cname_record_name: null | string;
}

export interface Invoice {
 invoice_id: string;
 customer_id: string;
 subscription_id: string;
 invoice_number: string;
 paid: boolean;
 payment_method: string;
 collection_method: string;
 currency: SupportedCurrency;
 minor_amount: number;
 created_at: number;
 link: string;
}

export interface PaymentMethodField {
  value: string;
  label: string;
  display_type: 'brand_icon' | 'masked' | 'text' | 'wallet_icon';
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'google_pay' | 'apple_pay' | 'samsung_pay' | 'sepa';
  display_name: string;
  is_default: boolean;
  is_active: boolean;
  fields: Record<string, PaymentMethodField>;
}

export interface CurrencyAmount {
  type: SupportedCurrency;
  value: number;
}

export type SupportedCurrency = 'USD' | 'EUR' | 'GBP' | 'XXX';

export type SpecificationType = 'GAME_SERVER' | 'ACCOUNT_TIER';