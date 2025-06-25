import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { getToken } = await auth();
  const token = await getToken();

  if (!token) {
    return [];
  }

  const { title, address, action, subscriptionId, specificationId: specification_id } = await request.json();
  const basePath = `${process.env.API_URL}/api/user/subscription/${subscriptionId}`

  try {
    switch (action) {
      case "cancel":
        const createResponse = await fetch(`${basePath}/cancel`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        });
        
        if (!createResponse.ok) {
          throw new Error('Failed to cancel subscription');
        }
        
        const url = await createResponse.text();
        return NextResponse.json({ url });

      case "uncancel":
        const setDefaultResponse = await fetch(`${basePath}/uncancel`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!setDefaultResponse.ok) {
          throw new Error('Failed to unancel subscription');
        }
        
        return NextResponse.json({ success: true });

      case "change-specification":
        const specificationResponse = await fetch(`${basePath}/specification`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ specification_id })
        });
        
        if (!specificationResponse.ok) {
          throw new Error('Failed to change subscription specification');
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
          throw new Error('Failed to change server adress');
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