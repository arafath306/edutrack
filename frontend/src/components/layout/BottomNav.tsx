"use client";

import { Home, MessageCircle, PlayCircle, User, CheckSquare } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const tabs = [
  { name: "Home", href: "/dashboard", icon: Home },
  { name: "Tasks", href: "/tasks", icon: CheckSquare },
  { name: "Chat", href: "/chat", icon: MessageCircle },
  { name: "Video", href: "/video", icon: PlayCircle },
  { name: "You", href: "/profile", icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();

  // Don't show nav on auth pages
  const isAuthPage = pathname === "/login" || pathname === "/register" || pathname === "/verify" || pathname === "/";
  if (isAuthPage) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-2xl border-t border-border/50 pb-safe">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          const Icon = tab.icon;
          
          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full gap-1 transition-all relative",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <motion.div
                whileTap={{ scale: 0.9 }}
                className="relative"
              >
                <Icon className={cn("w-5 h-5", isActive && "fill-primary/20")} />
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -inset-2 bg-primary/10 rounded-xl -z-10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </motion.div>
              <span className="text-[10px] font-bold tracking-tight">{tab.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
