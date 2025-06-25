import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ subscriptionId: string }> }
) {
    try {
        const { getToken } = await auth();
        const token = await getToken();

        if (!token) {
            return NextResponse.json(
                { error: 'unauthorized' },
                { status: 401 }
            );
        }

        const { subscriptionId } = await params;
        const settingsResponse = await fetch(
            `${process.env.API_URL}/api/panel/user/subscription/${subscriptionId}/settings`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        );

        if (!settingsResponse.ok) {
            throw new Error('failed to get settings');
        }

        const settings = await settingsResponse.json();
        return NextResponse.json(settings);
    } catch (error: any) {
        console.error('get settings error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ subscriptionId: string }> }
) {
    try {
        const { getToken } = await auth();
        const token = await getToken();

        if (!token) {
            return NextResponse.json(
                { error: 'unauthorized' },
                { status: 401 }
            );
        }

        const { subscriptionId } = await params;
        const updateRequest = await request.json();

        const settingsResponse = await fetch(
            `${process.env.API_URL}/api/panel/user/subscription/${subscriptionId}/settings`,
            {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updateRequest)
            }
        );

        if (!settingsResponse.ok) {
            throw new Error('failed to update settings');
        }

        const settings = await settingsResponse.json();
        return NextResponse.json(settings);
    } catch (error: any) {
        console.error('update settings error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}