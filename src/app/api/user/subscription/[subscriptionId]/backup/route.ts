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
        const backupResponse = await fetch(
            `${process.env.API_URL}/api/panel/user/subscription/${subscriptionId}/backup`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        );

        if (!backupResponse.ok) {
            throw new Error('failed to list backups');
        }

        const backups = await backupResponse.json();
        return NextResponse.json(backups);
    } catch (error: any) {
        console.error('list backups error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(
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
        const { name } = await request.json();

        const backupResponse = await fetch(
            `${process.env.API_URL}/api/panel/user/subscription/${subscriptionId}/backup?name=${encodeURIComponent(name)}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        );

        if (!backupResponse.ok) {
            throw new Error('failed to create backup');
        }

        const backup = await backupResponse.json();
        return NextResponse.json(backup);
    } catch (error: any) {
        console.error('create backup error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}