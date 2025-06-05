import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { title, address, region, action, subscriptionId, specificationId: specification_id } = await request.json();
  const stripeBasePath = `${process.env.API_URL}/api/stripe/user/${userId}/subscription/${subscriptionId}`
  const basePath = `${process.env.API_URL}/api/user/${userId}/subscription/${subscriptionId}`

  try {
    switch (action) {
      case "cancel":
        const createResponse = await fetch(`${stripeBasePath}/cancel`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });
        
        if (!createResponse.ok) {
          throw new Error('Failed to cancel subscription');
        }
        
        const url = await createResponse.text();
        return NextResponse.json({ url });

      case "uncancel":
        const setDefaultResponse = await fetch(`${stripeBasePath}/uncancel`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });
        
        if (!setDefaultResponse.ok) {
          throw new Error('Failed to unancel subscription');
        }
        
        return NextResponse.json({ success: true });

      case "change-specification":
        const specificationResponse = await fetch(`${stripeBasePath}/specification`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ specification_id })
        });
        
        if (!specificationResponse.ok) {
          throw new Error('Failed to change subscription specification');
        }
        
        return NextResponse.json({ success: true });

      case "change-region":
        const changeRegionResponse = await fetch(`${basePath}/region`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ region })
        });
        
        if (!changeRegionResponse.ok) {
          throw new Error('Failed to make change server region request');
        }
        
        return NextResponse.json({ success: true });

      case "change-address":
        const changeAddressResponse = await fetch(`${basePath}/address`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ address })
        });
        
        if (!changeAddressResponse.ok) {
          throw new Error('Failed to change server adress');
        }
        
        return NextResponse.json({ success: true });

      case "change-title":
        const changeTitleResponse = await fetch(`${basePath}/title`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title })
        });
        
        if (!changeTitleResponse.ok) {
          throw new Error('Failed to change server title');
        }
        
        return NextResponse.json({ success: true });

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}