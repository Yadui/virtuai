"use client";

import { Loader2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRazorpayCheckout } from "@/hooks/use-razorpay-checkout";

export const SubscriptionButton = ({ isPro = false }: { isPro: boolean }) => {
  const { openCheckout, loading } = useRazorpayCheckout();

  if (isPro) {
    return (
      <Button variant="default" disabled>
        Pro plan active
      </Button>
    );
  }

  return (
    <Button
      variant="default"
      disabled={loading}
      onClick={() => openCheckout("Pro")}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <>
          Upgrade to Pro — ₹149
          <Zap className="ml-2 h-4 w-4 fill-white" />
        </>
      )}
    </Button>
  );
};
