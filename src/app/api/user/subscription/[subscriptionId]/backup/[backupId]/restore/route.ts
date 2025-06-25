import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
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
        const restoreResponse = await fetch(
            `${process.env.API_URL}/api/panel/user/subscription/${subscriptionId}/backup/${backupId}/restore`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        );

        if (!restoreResponse.ok) {
            throw new Error('failed to restore backup');
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('restore backup error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}