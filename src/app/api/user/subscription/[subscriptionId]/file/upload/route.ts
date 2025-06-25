import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

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
        const formData = await request.formData();

        const response = await fetch(
            `${process.env.API_URL}/api/panel/user/subscription/${subscriptionId}/file/upload`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            }
        );

        if (!response.ok) {
            throw new Error('failed to upload files');
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('upload files error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}