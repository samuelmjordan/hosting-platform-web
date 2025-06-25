import { PaymentMethod } from "@/app/types";
import { auth } from "@clerk/nextjs/server";

export async function fetchPaymentMethods(): Promise<PaymentMethod[]> {
  const { getToken } = await auth();
  const token = await getToken();

  if (!token) {
    return [];
  }

  const response = await fetch(`${process.env.API_URL}/api/user/payment-method`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Payment methods not found for this type');
    }
    throw new Error('Failed to fetch Payment methods');
  }

  return response.json();
}