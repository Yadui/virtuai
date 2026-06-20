import { Settings } from "lucide-react";

import { Heading } from "@/components/Header/heading";
import { SubscriptionButton } from "@/components/SubscriptionModel/subscription-button";
import { ModelManagement } from "@/components/Settings/ModelManagement";
import { checkSubscription } from "@/lib/subscription";

const SettingsPage = async () => {
    const isPro = await checkSubscription();

    return (
        <div className="h-full overflow-y-auto bg-[#f7f7f4] text-[#26251e]">
            <div>
            <Heading
                title="Settings"
                description="Manage your account and AI models."
                icon={Settings}
                iconColor="text-[#26251e]"
                bgColor="bg-white"
            />
            </div>
            <div className="px-4 lg:px-8 space-y-8 pb-8">
                {/* Subscription Section */}
                <div className="space-y-4 pt-6">
                    <h3 className="text-lg font-semibold text-[#26251e]">Subscription</h3>
                    <div className="rounded-xl border border-[#e6e5e0] bg-white p-4">
                        <div className="mb-4 text-sm text-[#5a5852]">
                            {isPro ? "You are currently on a Pro plan." : "You are currently on a free plan."}
                        </div>
                        <SubscriptionButton isPro={isPro} />
                    </div>
                </div>

                {/* Model Management Section */}
                <div className="border-t border-[#e6e5e0] pt-8">
                    <ModelManagement />
                </div>
            </div>
        </div>
    );
}

export default SettingsPage;

