import { Settings } from "lucide-react";

import { Heading } from "@/components/Header/heading";
import { SubscriptionButton } from "@/components/SubscriptionModel/subscription-button";
import { ModelManagement } from "@/components/Settings/ModelManagement";
import { checkSubscription } from "@/lib/subscription";

const SettingsPage = async () => {
    const isPro = await checkSubscription();

    return (
        <div className="h-full overflow-y-auto bg-[#0f0f17] text-white">
            <div className="mt-8">
            <Heading
                title="Settings"
                description="Manage your account and AI models."
                icon={Settings}
                iconColor="text-white"
                bgColor="bg-white/10"
            />
            </div>
            <div className="px-4 lg:px-8 space-y-8 pb-8">
                {/* Subscription Section */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-white">Subscription</h3>
                    <div className="p-4 border border-white/10 rounded-lg bg-white/5">
                        <div className="text-muted-foreground text-sm mb-4">
                            {isPro ? "You are currently on a Pro plan." : "You are currently on a free plan."}
                        </div>
                        <SubscriptionButton isPro={isPro} />
                    </div>
                </div>

                {/* Model Management Section */}
                <div className="border-t border-white/10 pt-8">
                    <ModelManagement />
                </div>
            </div>
        </div>
    );
}

export default SettingsPage;

