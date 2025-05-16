import { Server } from "@/app/types";
import { auth } from "@clerk/nextjs/server";

export async function fetchServers(): Promise<Server[]> {

  const { userId } = await auth();
  const response = await fetch(`${process.env.API_URL}/api/user/${userId}/subscription/server`, {
    headers: {
      'Content-Type': 'application/json',
    }
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Servers not found for this type');
    }
    throw new Error('Failed to fetch servers');
  }

  return response.json();
}