const LandingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f7f7f4]">
      {children}
    </main>
  );
};

export default LandingLayout;
