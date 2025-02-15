export interface Specification {
  type: SpecificationType;
  specificationId: string;
  title: string;
  caption: string;
  ram_gb: number;
  cpu: number;
  ssd_gb: number;
}

export interface Price {
  priceId: string;
  productId: string;
  active: boolean;
  currency: SupportedCurrency;
  minorAmount: number;
}

export interface Plan {
  price: Price,
  specification: Specification
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

export type SpecificationType = 'JAVA_SERVER' | 'BEDROCK_SERVER';