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
      return NextResponse.json(
          { error: 'unauthorized' },
          { status: 401 }
      );
    }

    const { subscriptionId } = await params;
    const { title, address, action, specificationId: specification_id } = await request.json();
    const basePath = `${process.env.API_URL}/api/user/subscription/${subscriptionId}`;

    switch (action) {
      case "cancel":
        const cancelResponse = await fetch(`${basePath}/cancel`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        });

        if (!cancelResponse.ok) {
          throw new Error('failed to cancel subscription');
        }

        const url = await cancelResponse.text();
        return NextResponse.json({ url });

      case "uncancel":
        const uncancelResponse = await fetch(`${basePath}/uncancel`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (!uncancelResponse.ok) {
          throw new Error('failed to uncancel subscription');
        }

        return NextResponse.json({ success: true });

      case "change-address":
        const changeAddressResponse = await fetch(`${basePath}/address`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ address })
        });

        if (!changeAddressResponse.ok) {
          throw new Error('failed to change server address');
        }

        return NextResponse.json({ success: true });

      case "change-title":
        const changeTitleResponse = await fetch(`${basePath}/title`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ title })
        });

        console.log(changeTitleResponse);

        if (!changeTitleResponse.ok) {
          throw new Error('failed to change server title');
        }

        return NextResponse.json({ success: true });

      default:
        return NextResponse.json({ error: "invalid action" }, { status: 400 });
    }
  } catch (error: any) {
    console.error('subscription action error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}