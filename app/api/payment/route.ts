import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { createRazorpayOrder } from "@/lib/razorpay";
import { isPaidBillingPlanName } from "@/lib/pricing-plans";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await req.json();
  const plan = data.plan;

  if (!isPaidBillingPlanName(plan)) {
    return NextResponse.json({ error: "Choose a paid plan." }, { status: 400 });
  }

  const order = await createRazorpayOrder({
    plan,
    userId: user.id,
    email: user.email ?? "",
  });

  if (!order.ok) {
    return NextResponse.json({ error: order.error }, { status: order.status });
  }

  return NextResponse.json(order);
}
