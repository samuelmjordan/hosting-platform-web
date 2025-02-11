import "server-only"
import { NextResponse } from 'next/server';

const API_URL = process.env.API_URL;

export async function POST(request: Request) {
  try {
    const { productId } = await request.json();

    console.log('Fetching product data:', productId);

    const response = await fetch(`${API_URL}/api/product/${productId}/prices`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.message || 'Failed to fetch prices' },
        { status: response.status }
      );
    }

    console.log(response);
    return NextResponse.json({ productId });

  } catch (error) {
    console.error('Error fetching prices:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}