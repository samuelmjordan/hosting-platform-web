export interface Specification {
  id: string;
  title: string;
  ram: number;
  cpu: number;
  priceId: string;
  priceAmount: number;
}

export interface Price {
  priceId: string;
  productId: string;
  specId: string;
  active: boolean;
  currency: string;
  minorAmount: number;
}

export interface Region {
  id: string;
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
  price: Price
  region: Region
}