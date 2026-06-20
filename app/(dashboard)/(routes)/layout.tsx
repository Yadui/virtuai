import Navbar from "@/components/NavBar/navbar";
import { Sidebar } from "@/components/SideBar/sidebar";
import { getApiLimitCount } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const apiLimitCount = await getApiLimitCount();
  const isPro = await checkSubscription();

  return (
    <div className="flex h-screen overflow-hidden bg-[#f7f7f4] text-[#26251e]">
      {/* Persistent sidebar — desktop only */}
      <aside className="hidden w-[220px] shrink-0 border-r border-[#e6e5e0] lg:flex lg:flex-col">
        <Sidebar apiLimitCount={apiLimitCount} isPro={isPro} />
      </aside>

      {/* Right column: navbar + page content */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Navbar apiLimitCount={apiLimitCount} isPro={isPro} />
        <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
