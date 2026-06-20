"use client";

import { Check, Zap } from "lucide-react";
import { Loader2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useProModal } from "@/hooks/use-pro-modal";
import { useRazorpayCheckout } from "@/hooks/use-razorpay-checkout";
import { tools } from "@/constants";

export const ProModal = () => {
  const proModal = useProModal();
  const { openCheckout, loading } = useRazorpayCheckout();

  const onUpgrade = async () => {
    proModal.onClose();
    await openCheckout("Pro");
  };

  return (
    <Dialog open={proModal.isOpen} onOpenChange={proModal.onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex flex-col items-center gap-y-4 pb-2">
            <div className="flex items-center gap-x-2 text-xl font-semibold text-[#26251e]">
              Upgrade to VirtuAI
              <Badge variant="default" className="py-1 text-sm uppercase">
                pro
              </Badge>
            </div>
          </DialogTitle>

          <DialogDescription className="space-y-2 pt-2 text-center font-medium text-[#26251e]">
            {tools.map((tool) => (
              <Card
                key={tool.href}
                className="flex items-center justify-between border-[#e6e5e0] bg-white p-3"
              >
                <div className="flex items-center gap-x-4">
                  <div className="w-fit rounded-md border border-[#e6e5e0] bg-[#fafaf7] p-2 text-[#26251e]">
                    <tool.icon className="h-5 w-5" />
                  </div>
                  <div className="text-sm font-semibold">{tool.label}</div>
                </div>
                <Check className="h-5 w-5 text-primary" />
              </Card>
            ))}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            disabled={loading}
            onClick={onUpgrade}
            size="lg"
            className="w-full"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                Upgrade — ₹149
                <Zap className="ml-2 h-4 w-4 fill-white" />
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
