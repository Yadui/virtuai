"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any;
  }
}

const loadRazorpayScript = () =>
  new Promise<boolean>((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

export const useRazorpayCheckout = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const openCheckout = async (plan = "Pro") => {
    setLoading(true);

    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        toast.error("Failed to load payment gateway. Check your connection.");
        return;
      }

      // Create Razorpay order on server
      const orderRes = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });

      if (!orderRes.ok) {
        const err = await orderRes.json().catch(() => ({}));
        toast.error(err.error ?? "Failed to create order.");
        return;
      }

      const order = await orderRes.json();

      // Open Razorpay checkout
      await new Promise<void>((resolve) => {
        const rzp = new window.Razorpay({
          key: order.keyId,
          amount: order.amount,
          currency: order.currency,
          name: "VirtuAI",
          description: "VirtuAI Pro",
          order_id: order.orderId,
          modal: { ondismiss: resolve },
          handler: async (response: {
            razorpay_order_id: string;
            razorpay_payment_id: string;
            razorpay_signature: string;
          }) => {
            try {
              const verifyRes = await fetch("/api/payment/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  plan,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                }),
              });

              if (verifyRes.ok) {
                toast.success("🎉 Upgraded to VirtuAI Pro!");
                router.refresh();
              } else {
                const err = await verifyRes.json().catch(() => ({}));
                toast.error(err.error ?? "Payment verification failed.");
              }
            } catch {
              toast.error("Payment verification failed.");
            } finally {
              resolve();
            }
          },
        });

        rzp.open();
      });
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return { openCheckout, loading };
};
