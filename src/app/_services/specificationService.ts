import { Specification } from "@/app/types";

export async function fetchSpecifications(): Promise<Specification[]> {
    return [
        { specId: "7bf955c1-8072-4812-87fc-a096af2485bf", title: "Wooden Pickaxe", ram: 4, cpu: 2},
        { specId: "14f90ac7-7c0f-4cf9-97c9-fb69edb5f823", title: "Golden Hoe", ram: 8, cpu: 4},
        { specId: "0433bed8-6964-40ce-8d70-478be68251b2", title: "Diamond Sword", ram: 16, cpu: 8},
    ];
}