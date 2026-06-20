import prismadb from "@/lib/prismadb";
import { getCurrentUserId } from "@/lib/auth";

export const checkSubscription = async (): Promise<boolean> => {
  const userId = await getCurrentUserId();
  if (!userId) return false;

  try {
    const sub = await prismadb.userSubscription.findUnique({
      where: { userId },
      select: { plan: true, razorpayPaymentId: true },
    });

    return sub?.plan === "Pro" && Boolean(sub.razorpayPaymentId);
  } catch {
    return false;
  }
};
