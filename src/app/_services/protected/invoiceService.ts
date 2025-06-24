import { Invoice } from "@/app/types";
import { auth } from "@clerk/nextjs/server";

export async function fetchInvoices(): Promise<Invoice[]> {
  const { getToken } = await auth();
  const token = await getToken();

  if (!token) {
    return [];
  }

  const response = await fetch(`${process.env.API_URL}/api/user/invoice`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
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