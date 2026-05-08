"use client";

import { Bell, Search, Settings } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";

export default function TopNav() {
  const pathname = usePathname();
  
  // Hide TopNav on Auth pages and Splash screen
  const isAuthPage = pathname === "/login" || pathname === "/register" || pathname === "/verify" || pathname === "/";
  if (isAuthPage) return null;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform">
              <span className="text-primary-foreground font-bold text-xl">E</span>
            </div>
            <span className="font-bold text-xl tracking-tight hidden sm:block">EduTrack</span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Search className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="relative rounded-full">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-background" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Settings className="w-5 h-5" />
          </Button>
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-purple-500 border border-border cursor-pointer hover:opacity-80 transition-opacity" />
        </div>
      </div>
    </header>
  );
}
