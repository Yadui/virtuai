import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";
import { getStripe } from "@/lib/stripe";
import { absoluteUrl } from "@/lib/utils";
import { getCurrentUser } from "@/lib/auth";

const settingsUrl = absoluteUrl("/settings");

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userId = user.id;
    const stripe = getStripe();

    const userSubscription = await prismadb.userSubscription.findUnique({
      where: {
        userId,
      },
    });

    // Check if the user has an existing Stripe customer
    if (userSubscription && userSubscription.stripeCustomerId) {
      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: userSubscription.stripeCustomerId,
        return_url: settingsUrl,
      });

      return new NextResponse(JSON.stringify({ url: stripeSession.url }));
    }

    // Handle the Stripe Checkout session creation
    if (user.email) {
      const stripeSession = await stripe.checkout.sessions.create({
        success_url: settingsUrl,
        cancel_url: settingsUrl,
        payment_method_types: ["card"],
        mode: "subscription",
        billing_address_collection: "auto",
        customer_email: user.email,
        line_items: [
          {
            price_data: {
              currency: "INR",
              product_data: {
                name: "VirtuAI Pro",
                description: "Unlimited AI Generations",
              },
              unit_amount: 150000,
              recurring: {
                interval: "month",
              },
            },
            quantity: 1,
          },
        ],
        metadata: {
          userId,
        },
      });

      return new NextResponse(JSON.stringify({ url: stripeSession.url }));
    } else {
      return new NextResponse("Email not found", { status: 400 });
    }
  } catch (error) {
    console.log("[STRIPE_ERROR]", error); // Log the full error to understand the issue
    return new NextResponse("Internal Error", { status: 500 });
  }
}
