import { Region } from "@/app/types";

export async function fetchRegions(): Promise<Region[]> {
    return [
        { region_id: "3c5f544a-e75b-4a5e-9607-cb65686af07b", continent: "Western Europe", continent_code: "EUW", city: "Frankfurt" },
        { region_id: "3c5f544a-e75b-4a5e-9607-cb65686af07c", continent: "Eastern Europe", continent_code: "EUE", city: "Helsinki" }
    ];
}