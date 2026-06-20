import "./globals.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { AuthProvider } from "@/components/Auth/auth-provider";
import { ModalProvider } from "@/components/SubscriptionModel/modal-provider";
import { ToasterProvider } from "@/components/Toaster/toaster-provider";
import { CrispProvider } from "@/components/CrispChat/crisp-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VirtuAI",
  description: "AI Platform",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <head>
        <link rel="shortcut icon" href="/logo.png" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <CrispProvider />
          <ModalProvider />
          <ToasterProvider />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
};

export default RootLayout;
