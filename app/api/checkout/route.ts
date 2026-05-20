import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { priceId, quantity = 1, selectedSize, selectedColor, productSlug } = await req.json();

    const origin = req.headers.get("origin") ?? "http://localhost:3000";

    const metadata: Record<string, string> = {};
    if (selectedSize) metadata.size = selectedSize;
    if (selectedColor) metadata.color = selectedColor;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: priceId, quantity }],
      metadata,
      success_url: `${origin}/shop?checkout=success`,
      cancel_url: `${origin}/shop/${productSlug ?? ""}`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
