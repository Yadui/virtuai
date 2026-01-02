import { LandingNavbar } from "@/components/Landing/landing-navbar";
import { LandingHero } from "@/components/Landing/landing-hero";
import { LandingContent } from "@/components/Landing/landing-logos";
import { ShowcaseSection } from "@/components/Landing/landing-features";
import { TestimonialsSection } from "@/components/Landing/landing-test-cards";
import { LandingFooter } from "@/components/Landing/landing-footer";

const LandingPage = () => {
  return (
    <div className="relative overflow-hidden bg-black">
      {/* Global noise texture overlay */}
      <div className="fixed inset-0 noise-overlay pointer-events-none z-50" />
      
      {/* Navigation */}
      <LandingNavbar />
      
      {/* Main content */}
      <main>
        <LandingHero />
        <LandingContent />
        <ShowcaseSection />
        <TestimonialsSection />
      </main>
      
      {/* Footer */}
      <LandingFooter />
    </div>
  );
};

export default LandingPage;
