import {NextResponse} from "next/server";
import {auth} from "@clerk/nextjs/server";

export async function POST(
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
        const content = await request.text();

        if (!file) {
            return NextResponse.json({ error: 'file parameter required' }, { status: 400 });
        }

        const response = await fetch(
            `${process.env.API_URL}/api/panel/user/subscription/${subscriptionId}/file/write?file=${encodeURIComponent(file)}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: content
            }
        );

        if (!response.ok) {
            throw new Error('failed to write file');
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error('write file error:', error);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}