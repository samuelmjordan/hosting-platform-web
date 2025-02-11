import "server-only"
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from 'next/server';

const API_URL = process.env.API_URL;
const BASE_URL = process.env.BASE_URL;

export async function POST(request: Request) {
  try {
    const { userId } = await auth();

    const { priceId } = await request.json();

    const checkoutData = {
      priceId,
      userId,
      success: `${BASE_URL}/return`,
      cancel: `${BASE_URL}/return`
    };

    console.log('Sending checkout data:', checkoutData);

    const response = await fetch(`${API_URL}/api/stripe/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(checkoutData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.message || 'Checkout failed' },
        { status: response.status }
      );
    }

    const checkoutUrl = await response.text();
    return NextResponse.json({ url: checkoutUrl });

  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}