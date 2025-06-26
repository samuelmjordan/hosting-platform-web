'use server'

import { auth } from "@clerk/nextjs/server";
import { NextResponse } from 'next/server';

const API_URL = process.env.API_URL;
const BASE_URL = process.env.BASE_URL;

export async function POST(request: Request) {
  try {
    const { getToken } = await auth();
    const token = await getToken();

    if (!token) {
      return NextResponse.json(
          { error: 'unauthorized' },
          { status: 401 }
      );
    }

    const { price_id } = await request.json();

    const checkoutData = {
      price_id,
      success: `${BASE_URL}/return`,
      cancel: `${BASE_URL}/return`
    };

    console.log('Sending checkout data:', checkoutData);

    const response = await fetch(`${API_URL}/api/user/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
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