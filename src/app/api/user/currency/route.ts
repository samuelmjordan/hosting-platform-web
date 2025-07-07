'server only'

import { auth } from "@clerk/nextjs/server";
import { NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function GET() {
  try {
    const { getToken } = await auth();
    const token = await getToken();

    if (!token) {
      return NextResponse.json(
          { error: 'unauthorized' },
          { status: 401 }
      );
    }

    const response = await fetch(`${API_URL}/api/user/currency`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.message || 'Fetch currency failed' },
        { status: response.status }
      );
    }

    const userCurrency = await response.json();
    return NextResponse.json({ userCurrency });

  } catch (error) {
    console.error('Fetch currency error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}