import { Zap } from "lucide-react";
import { useEffect, useState } from "react";

import { MAX_FREE_COUNTS } from "@/constants";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useProModal } from "@/hooks/use-pro-modal";

//- note :
//* This is also client component as it's nested
//* So we don't need to mention at top

export const FreeCounter = ({
  isPro = false,
  apiLimitCount = 0,
}: {
  isPro: boolean;
  apiLimitCount: number;
}) => {
  //_ Use this at top
  const proModal = useProModal();

  //- Note :
  //* Hydration error : when code runs on ser ver
  //_ Prevention from Hydration errors :
  //* So here we make sure that it's initialised once mounted then only

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  if (isPro) {
    return null;
  }

  return (
    <div className="px-3 pb-4">
      <Card className="border-[#e6e5e0] bg-white">
        <CardContent className="p-4">
          <div className="mb-4 space-y-3 text-center text-sm text-[#5a5852]">
            <p>
              {apiLimitCount} / {MAX_FREE_COUNTS} Free Generations
            </p>
            <Progress
              className="h-3"
              value={(apiLimitCount / MAX_FREE_COUNTS) * 100}
            />
          </div>

          <Button
            onClick={proModal.onOpen}
            variant="default"
            className="w-full"
          >
            Upgrade
            <Zap className="w-4 h-4 ml-2 fill-white" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
