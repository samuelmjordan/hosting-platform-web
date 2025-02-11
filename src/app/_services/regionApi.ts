import { Region } from '@/app/types';

export const regionsAPI = {
    async fetchProductRegions(): Promise<Region[]> {
        return [
            { id: "3c5f544a-e75b-4a5e-9607-cb65686af07a", continent: "North America", continentCode: "NA", city: "Chicago" },
            { id: "3c5f544a-e75b-4a5e-9607-cb65686af07b", continent: "Western Europe", continentCode: "EUW", city: "Frankfurt" },
            { id: "3c5f544a-e75b-4a5e-9607-cb65686af07c", continent: "Eastern Europe", continentCode: "EUE", city: "Helsinki" },
            { id: "3c5f544a-e75b-4a5e-9607-cb65686af07d", continent: "Southeast Asia", continentCode: "SEA", city: "Singapore" },
        ];
    }
};