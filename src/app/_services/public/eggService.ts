import {Egg} from "@/app/_components/page/settings/utils/types";

export async function fetchEggs(): Promise<Egg[]> {
    const response = await fetch(`${process.env.API_URL}/egg`, {
        headers: {
            'Content-Type': 'application/json',
        }
    });

    if (!response.ok) {
        if (response.status === 404) {
            throw new Error('Eggs not found');
        }
        throw new Error('Failed to fetch eggs');
    }

    return response.json();
}