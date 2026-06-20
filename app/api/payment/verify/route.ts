import { NextRequest, NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import { getCurrentUser } from "@/lib/auth";
import { verifyRazorpayPaymentSignature, getRazorpayOrder } from "@/lib/razorpay";
import { isPaidBillingPlanName, planPrices } from "@/lib/pricing-plans";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await req.json();
  const { plan, razorpay_order_id: orderId, razorpay_payment_id: paymentId, razorpay_signature: signature } = data;

  if (!isPaidBillingPlanName(plan)) {
    return NextResponse.json({ error: "Invalid plan." }, { status: 400 });
  }

  if (!orderId || !paymentId || !signature) {
    return NextResponse.json({ error: "Missing Razorpay payment fields." }, { status: 400 });
  }

  const validSignature = verifyRazorpayPaymentSignature({ orderId, paymentId, signature });
  if (!validSignature) {
    return NextResponse.json({ error: "Invalid payment signature." }, { status: 400 });
  }

  // Double-check order amount matches the plan price on server side
  const order = await getRazorpayOrder(orderId);
  const expectedPlan = planPrices[plan];
  const orderMatchesPlan =
    order?.amount === expectedPlan.unitAmount &&
    order.currency === expectedPlan.currency &&
    order.notes?.plan === plan &&
    order.notes?.userId === user.id;

  if (!orderMatchesPlan) {
    return NextResponse.json({ error: "Razorpay order does not match this purchase." }, { status: 400 });
  }

  // Upsert subscription record
  await prismadb.userSubscription.upsert({
    where: { userId: user.id },
    create: {
      userId: user.id,
      plan,
      razorpayOrderId: orderId,
      razorpayPaymentId: paymentId,
      activatedAt: new Date(),
    },
    update: {
      plan,
      razorpayOrderId: orderId,
      razorpayPaymentId: paymentId,
      activatedAt: new Date(),
    },
  });

  return NextResponse.json({ ok: true, plan });
}
