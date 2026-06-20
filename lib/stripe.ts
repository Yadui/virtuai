import Stripe from "stripe";

let stripeClient: Stripe | null = null;

export const getStripe = () => {
  if (!process.env.STRIPE_API_KEY) {
    throw new Error("STRIPE_API_KEY is required for Stripe subscription actions");
  }

  if (!stripeClient) {
    stripeClient = new Stripe(process.env.STRIPE_API_KEY, {
      apiVersion: "2024-12-18.acacia",
      typescript: true,
    });
  }

  return stripeClient;
};
