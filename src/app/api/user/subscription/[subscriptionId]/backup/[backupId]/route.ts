import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ subscriptionId: string; backupId: string }> }
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

        const { subscriptionId, backupId } = await params;
        const backupResponse = await fetch(
            `${process.env.API_URL}/api/panel/user/subscription/${subscriptionId}/backup/${backupId}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        );

        if (!backupResponse.ok) {
            throw new Error('failed to get backup');
        }

        const backup = await backupResponse.json();
        return NextResponse.json(backup);
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error('get backup error:', error);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ subscriptionId: string; backupId: string }> }
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

        const { subscriptionId, backupId } = await params;
        const backupResponse = await fetch(
            `${process.env.API_URL}/api/panel/user/subscription/${subscriptionId}/backup/${backupId}`,
            {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        );

        if (!backupResponse.ok) {
            throw new Error('failed to delete backup');
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error('delete backup error:', error);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}