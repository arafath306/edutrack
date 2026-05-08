import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import TopNav from "@/components/layout/TopNav";
import BottomNav from "@/components/layout/BottomNav";
import EduAI from "@/components/ai/EduAI";
import { AuthProvider } from "@/lib/supabase/auth-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EduTrack - Premium AI Study Ecosystem",
  description: "Modern educational productivity platform for students and creators.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "EduTrack",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-background text-foreground antialiased`}>
        <AuthProvider>
          <TopNav />
          <div className="pb-16 md:pb-0 pt-16">
            {children}
          </div>
          <EduAI />
          <BottomNav />
        </AuthProvider>
      </body>
    </html>
  );
}
