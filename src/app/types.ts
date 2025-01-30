export interface Product {
    id: bigint;
    title: string;
    ram: number;
    cpu: number;
    link: string;
}

export interface Region {
    id: bigint;
    continent: string;
    continentCode: string;
    city: string;
}

export interface Server {
  id: bigint
  title: string
  status: "pending" | "processing" | "success" | "failed"
}