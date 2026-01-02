import Navbar from "@/components/NavBar/navbar";
import { getApiLimitCount } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const apiLimitCount = await getApiLimitCount();
  const isPro = await checkSubscription();

  return (
    <div className="h-full relative flex flex-col dark">
      <Navbar apiLimitCount={apiLimitCount} isPro={isPro} />
      <main className="flex-1 overflow-hidden bg-background">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
