const LandingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="min-h-screen bg-black overflow-x-hidden">
      {children}
    </main>
  );
};

export default LandingLayout;
