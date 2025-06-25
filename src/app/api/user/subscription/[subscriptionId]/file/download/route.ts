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
            return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
        }

        const { subscriptionId } = await params;
        const { searchParams } = new URL(request.url);
        const file = searchParams.get('file');

        if (!file) {
            return NextResponse.json({ error: 'file parameter required' }, { status: 400 });
        }

        const response = await fetch(
            `${process.env.API_URL}/api/panel/user/subscription/${subscriptionId}/file/download?file=${encodeURIComponent(file)}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        );

        if (!response.ok) {
            throw new Error('failed to get download link');
        }

        const downloadData = await response.json();
        return NextResponse.json(downloadData);
    } catch (error: any) {
        console.error('get download link error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}