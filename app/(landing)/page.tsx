import { LandingNavbar } from "@/components/Landing/landing-navbar";
import { LandingHero } from "@/components/Landing/landing-hero";
import { LandingContent } from "@/components/Landing/landing-logos";
import { ShowcaseSection } from "@/components/Landing/landing-features";
import { TestimonialsSection } from "@/components/Landing/landing-test-cards";
import { LandingFooter } from "@/components/Landing/landing-footer";

const LandingPage = () => {
  return (
    <div className="relative overflow-hidden bg-[#f7f7f4] text-[#26251e]">
      <LandingNavbar />
      <main>
        <LandingHero />
        <LandingContent />
        <ShowcaseSection />
        <TestimonialsSection />
      </main>
      <LandingFooter />
    </div>
  );
};

export default LandingPage;
