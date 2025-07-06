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
        const downloadResponse = await fetch(
            `${process.env.API_URL}/api/panel/user/subscription/${subscriptionId}/backup/${backupId}/download`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        );

        if (!downloadResponse.ok) {
            throw new Error('failed to get backup download link');
        }

        const downloadLink = await downloadResponse.text();
        return NextResponse.json({ url: downloadLink });
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error('get backup download link error:', error);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}