import { Product, Region } from '@/app/types';
import { StoreClient } from '@/app/_components/storeComponent/storeClient';

const getProducts = async (): Promise<Product[]> => {
    return [
        { id: BigInt(1), title: "Wooden Sword", ram: 2, cpu: 0.5, link: "https://buy.stripe.com/test_7sI4jZgUh3Gb1uo3cc" },
        { id: BigInt(2), title: "Stone Pickaxe", ram: 4, cpu: 1, link: "https://buy.stripe.com/test_7sI4jZgUh3Gb1uo3cc" },
        { id: BigInt(3), title: "Iron Chestplate", ram: 6, cpu: 1.5, link: "https://buy.stripe.com/test_7sI4jZgUh3Gb1uo3cc" },
        { id: BigInt(4), title: "Diamond Boots", ram: 8, cpu: 2, link: "https://buy.stripe.com/test_7sI4jZgUh3Gb1uo3cc" },
        { id: BigInt(5), title: "Crying Obsidian", ram: 12, cpu: 3, link: "https://buy.stripe.com/test_7sI4jZgUh3Gb1uo3cc" },
        { id: BigInt(6), title: "Golden Apple", ram: 16, cpu: 4, link: "https://buy.stripe.com/test_7sI4jZgUh3Gb1uo3cc" },
        { id: BigInt(7), title: "Netherite Ingot", ram: 24, cpu: 6, link: "https://buy.stripe.com/test_7sI4jZgUh3Gb1uo3cc" },
        { id: BigInt(8), title: "Nether Star", ram: 32, cpu: 8, link: "https://buy.stripe.com/test_7sI4jZgUh3Gb1uo3cc" },
    ];
};

const getRegions = async (): Promise<Region[]> => {
    return [
        { id: BigInt(1), continent: "North America", continentCode: "NA", city: "Chicago" },
        { id: BigInt(2), continent: "Western Europe", continentCode: "EUW", city: "Frankfurt" },
        { id: BigInt(3), continent: "Eastern Europe", continentCode: "EUE", city: "Helsinki" },
        { id: BigInt(4), continent: "Southeast Asia", continentCode: "SEA", city: "Singapore" },
    ];
};

const StoreComponent = async () => {
    const products = await getProducts();
    const regions = await getRegions();

    return (
        <StoreClient 
            products={products}
            regions={regions}
        />
    );
};

export default StoreComponent;