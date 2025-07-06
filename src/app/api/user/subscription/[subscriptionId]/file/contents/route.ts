import {NextResponse} from "next/server";
import {auth} from "@clerk/nextjs/server";

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
            `${process.env.API_URL}/api/panel/user/subscription/${subscriptionId}/file/contents?file=${encodeURIComponent(file)}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        );

        if (!response.ok) {
            throw new Error('failed to get file contents');
        }

        const contents = await response.text();
        return new Response(contents, {
            headers: { 'Content-Type': 'text/plain' }
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error('get file contents error:', error);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}