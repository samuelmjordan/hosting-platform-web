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
        const directory = searchParams.get('directory') || '/';

        const response = await fetch(
            `${process.env.API_URL}/api/panel/user/subscription/${subscriptionId}/file/list?directory=${encodeURIComponent(directory)}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        );

        if (!response.ok) {
            throw new Error('failed to list files');
        }

        const files = await response.json();
        return NextResponse.json(files);
    } catch (error: any) {
        console.error('list files error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}