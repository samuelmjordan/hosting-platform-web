export interface Product {
  id: string;
  title: string;
  ram: number;
  cpu: number;
  priceId: string;
  priceAmount: number;
}

export interface Region {
  id: string;
  continent: string;
  continentCode: string;
  city: string;
}

export interface StoreSelection {
  product: Product | null;
  region: Region | null;
}

export interface Server {
  id: bigint
  title: string
  description: string
  status: "Online" | "Offline" | "Pending"
  product: Product
  region: Region
}