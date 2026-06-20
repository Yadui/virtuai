import prismadb from "@/lib/prismadb";
import { getCurrentUserId } from "@/lib/auth";

const DAY_IN_MS = 86_400_000;

export const checkSubscription = async () => {
  const userId = await getCurrentUserId();

  if (!userId) {
    return false;
  }

  try {
    const userSubscription = await prismadb.userSubscription.findUnique({
      where: {
        userId: userId,
      },
      select: {
        stripeSubscriptionId: true,
        stripeCurrentPeriodEnd: true,
        stripeCustomerId: true,
        stripePriceId: true,
      },
    });

    if (!userSubscription) {
      return false;
    }

    const isValid =
      userSubscription.stripePriceId &&
      userSubscription.stripeCurrentPeriodEnd?.getTime()! + DAY_IN_MS >
        Date.now();

    return !!isValid;
  } catch {
    console.warn("[SUBSCRIPTION_CHECK_FALLBACK] Subscription data unavailable; defaulting to free plan.");
    return false;
  }
};
