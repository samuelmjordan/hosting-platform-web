import {auth} from "@clerk/nextjs/server";
import {NextResponse} from "next/server";

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
        const { root, files } = await request.json();

        const response = await fetch(
            `${process.env.API_URL}/api/panel/user/subscription/${subscriptionId}/file/delete`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ root, files })
            }
        );

        if (!response.ok) {
            throw new Error('failed to delete files');
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('delete files error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}