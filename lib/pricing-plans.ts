// VirtuAI Pro — ₹149/month (one-time purchase, unlocks pro tier)
export const planPrices = {
  Free: {
    id: "free",
    label: "Free",
    unitAmount: 0,
    currency: "INR",
    description: "9,999 free generations to get started.",
  },
  Pro: {
    id: "pro",
    label: "Pro",
    unitAmount: 14900, // paise — ₹149
    currency: "INR",
    description: "Unlimited AI generations across all tools.",
  },
} as const;

export type BillingPlanName = keyof typeof planPrices;
export type PaidBillingPlanName = Exclude<BillingPlanName, "Free">;

export const isPaidBillingPlanName = (value: unknown): value is PaidBillingPlanName =>
  value === "Pro";

export const billingPlanNames = ["Free", "Pro"] as const satisfies readonly BillingPlanName[];
