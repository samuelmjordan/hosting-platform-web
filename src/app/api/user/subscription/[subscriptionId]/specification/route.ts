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
        const body = await request.json();
        const { specificationId } = body;

        if (!specificationId) {
            return NextResponse.json({ error: 'specificationId required' }, { status: 400 });
        }

        const response = await fetch(
            `${process.env.API_URL}/api/user/subscription/${subscriptionId}/specification`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ specification_id: specificationId })
            }
        );

        if (!response.ok) {
            throw new Error('failed to upgrade');
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error: any) {
        console.error('update subscription specification error:', error);

        if (error.message.includes('Cannot find subscription') ||
            error.message.includes('Cannot find price') ||
            error.message.includes('Cannot find a plan')) {
            return NextResponse.json({ error: error.message }, { status: 404 });
        }

        if (error.message.includes('not an upgrade')) {
            return NextResponse.json({ error: 'downgrades not supported' }, { status: 400 });
        }

        // stripe errors
        if (error.message.includes('stripe') || error.message.includes('payment')) {
            return NextResponse.json({ error: 'payment processing failed' }, { status: 402 });
        }

        return NextResponse.json({ error: 'failed to upgrade server' }, { status: 500 });
    }
}