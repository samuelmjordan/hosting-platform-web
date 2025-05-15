import { Region } from "@/app/types";

export async function fetchRegions(): Promise<Region[]> {
    return [
        { region_id: "1", region_code: "WEST_EUROPE", continent: "Western Europe", continent_code: "EUW", city: "Frankfurt" },
        { region_id: "2", region_code: "EAST_EUROPE", continent: "Eastern Europe", continent_code: "EUE", city: "Helsinki" }
    ];
}