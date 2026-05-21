import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

interface LineItem {
  priceId: string;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const origin = req.headers.get("origin") ?? "http://localhost:3000";

    // Support both single-item and multi-item (cart) requests
    const items: LineItem[] = body.items ?? [
      {
        priceId: body.priceId,
        quantity: body.quantity ?? 1,
        selectedSize: body.selectedSize,
        selectedColor: body.selectedColor,
      },
    ];

    const line_items = items.map(({ priceId, quantity }) => ({
      price: priceId,
      quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      success_url: `${origin}/shop?checkout=success`,
      cancel_url: `${origin}/cart`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
