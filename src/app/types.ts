export interface Product {
    id: bigint;
    title: string;
    ram: number;
    cpu: number;
}

export interface Region {
    id: bigint;
    continent: string;
    continentCode: string;
    city: string;
}