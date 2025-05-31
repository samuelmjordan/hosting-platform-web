import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { action, paymentMethodId, successUrl, cancelUrl } = await request.json();

  try {
    switch (action) {
      case "create":
        const createResponse = await fetch(`${process.env.API_URL}/api/stripe/user/${userId}/payment-method`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            success: successUrl,
            cancel: cancelUrl 
          })
        });
        
        if (!createResponse.ok) {
          throw new Error('Failed to create payment method');
        }
        
        const url = await createResponse.text();
        return NextResponse.json({ url });

      case "setDefault":
        const setDefaultResponse = await fetch(`${process.env.API_URL}/api/stripe/user/${userId}/payment-method/${paymentMethodId}/default`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });
        
        if (!setDefaultResponse.ok) {
          throw new Error('Failed to set default payment method');
        }
        
        return NextResponse.json({ success: true });

      case "removeDefault":
        const removeDefaultResponse = await fetch(`${process.env.API_URL}/api/stripe/user/${userId}/payment-method/${paymentMethodId}/default/remove`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });
        
        if (!removeDefaultResponse.ok) {
          throw new Error('Failed to remove default payment method');
        }
        
        return NextResponse.json({ success: true });

      case "remove":
        const removeResponse = await fetch(`${process.env.API_URL}/api/stripe/user/${userId}/payment-method/${paymentMethodId}/remove`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });
        
        if (!removeResponse.ok) {
          throw new Error('Failed to remove payment method');
        }
        
        return NextResponse.json({ success: true });

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}