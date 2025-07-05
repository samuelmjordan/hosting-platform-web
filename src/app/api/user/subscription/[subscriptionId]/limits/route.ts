'server only'

import { auth } from "@clerk/nextjs/server";
import { NextResponse } from 'next/server';

const API_URL = process.env.API_URL;

export async function GET(request: Request, { params }: { params: { subscriptionId: string } }) {
    try {
        const { subscriptionId } = await params;
        const { getToken } = await auth();
        const token = await getToken();

        if (!token) {
            return NextResponse.json(
                { error: 'unauthorized' },
                { status: 401 }
            );
        }

        const response = await fetch(`${API_URL}/api/user/subscription/${subscriptionId}/limits`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json(
                { error: errorData.message || 'Fetch resource limits failed' },
                { status: response.status }
            );
        }

        const limits = await response.json();
        return NextResponse.json(limits);

    } catch (error) {
        console.error('Fetch resource limits error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}