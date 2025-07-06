import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { getToken } = await auth();
  const token = await getToken();

  if (!token) {
    return NextResponse.json(
        { error: 'unauthorized' },
        { status: 401 }
    );
  }

  const { action, paymentMethodId, successUrl, cancelUrl } = await request.json();

  try {
    switch (action) {
      case "create":
        const createResponse = await fetch(`${process.env.API_URL}/api/user/payment-method`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
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
        const setDefaultResponse = await fetch(`${process.env.API_URL}/api/user/payment-method/${paymentMethodId}/default`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!setDefaultResponse.ok) {
          throw new Error('Failed to set default payment method');
        }
        
        return NextResponse.json({ success: true });

      case "removeDefault":
        const removeDefaultResponse = await fetch(`${process.env.API_URL}/api/user/payment-method/${paymentMethodId}/default/remove`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!removeDefaultResponse.ok) {
          throw new Error('Failed to remove default payment method');
        }
        
        return NextResponse.json({ success: true });

      case "remove":
        const removeResponse = await fetch(`${process.env.API_URL}/api/user/payment-method/${paymentMethodId}/remove`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!removeResponse.ok) {
          throw new Error('Failed to remove payment method');
        }
        
        return NextResponse.json({ success: true });

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}