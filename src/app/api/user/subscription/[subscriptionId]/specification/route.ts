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
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error('update subscription specification error:', error);

        if (message.includes('Cannot find subscription') ||
            message.includes('Cannot find price') ||
            message.includes('Cannot find a plan')) {
            return NextResponse.json({ error: message }, { status: 404 });
        }

        if (message.includes('not an upgrade')) {
            return NextResponse.json({ error: 'downgrades not supported' }, { status: 400 });
        }

        // stripe errors
        if (message.includes('stripe') || message.includes('payment')) {
            return NextResponse.json({ error: 'payment processing failed' }, { status: 402 });
        }

        return NextResponse.json({ error: 'failed to upgrade server' }, { status: 500 });
    }
}