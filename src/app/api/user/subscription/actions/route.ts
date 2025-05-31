import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { action, subscriptionId } = await request.json();

  try {
    switch (action) {
      case "cancel":
        const createResponse = await fetch(`${process.env.API_URL}/api/stripe/user/${userId}/subscription/${subscriptionId}/cancel`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });
        
        if (!createResponse.ok) {
          throw new Error('Failed to cancel subscription');
        }
        
        const url = await createResponse.text();
        return NextResponse.json({ url });

      case "uncancel":
        const setDefaultResponse = await fetch(`${process.env.API_URL}/api/stripe/user/${userId}/subscription/${subscriptionId}/uncancel`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });
        
        if (!setDefaultResponse.ok) {
          throw new Error('Failed to unancel subscription');
        }
        
        return NextResponse.json({ success: true });

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}