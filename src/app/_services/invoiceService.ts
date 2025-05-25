import { Invoice } from "@/app/types";
import { auth } from "@clerk/nextjs/server";

export async function fetchInvoices(): Promise<Invoice[]> {

  const { userId } = await auth();

  if (!userId) {
    throw new Error("Not authenticated");
  }

  const response = await fetch(`${process.env.API_URL}/api/user/${userId}/invoice`, {
    headers: {
      'Content-Type': 'application/json',
    }
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Invoices not found for this type');
    }
    throw new Error('Failed to fetch invoices');
  }

  return response.json();
}