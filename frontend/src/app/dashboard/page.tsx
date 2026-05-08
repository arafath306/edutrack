"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Zap, Clock, CheckCircle2, TrendingUp, Sparkles, 
  Plus, Play, MessageCircle, FileUp, ChevronRight,
  Users, Flame, Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/supabase/auth-provider";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { cn } from "@/lib/utils";

// --- Components ---

const StatCard = ({ label, value, icon: Icon, color, trend }: any) => (
  <div className="bg-card border border-border/50 p-4 rounded-3xl space-y-3 relative overflow-hidden group">
    <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center bg-opacity-10", color.replace('text-', 'bg-'))}>
      <Icon className={cn("w-5 h-5", color)} />
    </div>
    <div>
      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{label}</p>
      <h3 className="text-2xl font-bold tracking-tight">{value}</h3>
    </div>
    {trend && (
      <div className="absolute top-4 right-4 flex items-center gap-1 text-[10px] font-bold text-green-500">
        <TrendingUp className="w-3 h-3" />
        {trend}
      </div>
    )}
  </div>
);

export default function HomePage() {
  const { user } = useAuth();
  const supabase = createClient();
  const [profile, setProfile] = useState<any>(null);
  const [upcomingTasks, setUpcomingTasks] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    // Fetch profile stats
    const { data: prof } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user?.id)
      .single();
    setProfile(prof);

    // Fetch only a preview of upcoming tasks
    const { data: tasks } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", user?.id)
      .eq("status", "Todo")
      .order("deadline", { ascending: true })
      .limit(3);
    setUpcomingTasks(tasks || []);
  };

  return (
    <div className="min-h-screen pb-24 pt-4 px-4 space-y-8 max-w-lg mx-auto">
      {/* 1. GREETING & STREAK */}
      <section className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">
            Good Evening, <span className="text-primary">{profile?.name?.split(' ')[0] || 'Arafath'}</span> 👋
          </h1>
          <p className="text-sm text-muted-foreground font-medium">Ready to crush your goals today?</p>
        </div>
        <div className="flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 px-3 py-1.5 rounded-2xl">
          <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
          <span className="text-sm font-bold text-orange-600">{profile?.streak || 0}</span>
        </div>
      </section>

      {/* 2. STATS GRID */}
      <section className="grid grid-cols-2 gap-4">
        <StatCard label="Study Hours" value="6.2h" icon={Clock} color="text-blue-500" trend="+12%" />
        <StatCard label="XP Earned" value={profile?.xp || 0} icon={Zap} color="text-purple-500" trend="+450" />
        <StatCard label="Completed" value="12" icon={CheckCircle2} color="text-green-500" />
        <StatCard label="Level" value={profile?.level || 1} icon={Award} color="text-orange-500" />
      </section>

      {/* 3. QUICK ACTIONS */}
      <section className="space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground px-1">Quick Actions</h2>
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: "Task", icon: Plus, color: "bg-blue-500", href: "/tasks" },
            { label: "Focus", icon: Play, color: "bg-purple-500", href: "#" },
            { label: "AI", icon: Sparkles, color: "bg-green-500", href: "#" },
            { label: "Upload", icon: FileUp, color: "bg-orange-500", href: "/video" }
          ].map((action) => (
            <Link key={action.label} href={action.href} className="flex flex-col items-center gap-2">
              <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-opacity-20", action.color)}>
                <action.icon className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold">{action.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. UPCOMING PREVIEW */}
      <section className="bg-card border border-border/50 rounded-[32px] p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-bold tracking-tight">Upcoming Tasks</h2>
          <Link href="/tasks" className="text-xs font-bold text-primary flex items-center gap-1">
            View All <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="space-y-3">
          {upcomingTasks.length > 0 ? upcomingTasks.map((task) => (
            <div key={task.id} className="flex items-center gap-4 p-3 rounded-2xl bg-muted/30 border border-border/50">
              <div className="w-1.5 h-8 rounded-full bg-primary" />
              <div className="flex-1">
                <p className="text-sm font-bold truncate">{task.title}</p>
                <p className="text-[10px] text-muted-foreground uppercase font-bold">{task.subject}</p>
              </div>
              <div className="text-[10px] font-bold text-muted-foreground bg-muted px-2 py-1 rounded-lg">
                Today
              </div>
            </div>
          )) : (
            <p className="text-sm text-muted-foreground italic text-center py-4">No tasks for today. Chill time? ☕</p>
          )}
        </div>
      </section>

      {/* 5. AI INSIGHTS */}
      <section className="bg-gradient-to-br from-primary/10 to-purple-500/10 border border-primary/20 rounded-[32px] p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <h2 className="font-bold tracking-tight">EduAI Insights</h2>
        </div>
        <div className="p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/5">
          <p className="text-sm font-medium leading-relaxed">
            "Arafath, you focus better at night. I suggest moving your **Math Revision** to 8 PM tonight."
          </p>
        </div>
      </section>

      {/* 6. FRIEND ACTIVITY (Discord Style) */}
      <section className="space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground px-1">Friend Activity</h2>
        <div className="space-y-3">
          {[
            { name: "Samiul", action: "Studying Physics", status: "Focusing", time: "20m" },
            { name: "Rifat", action: "Completed 5 Tasks", status: "Online", time: "1h" }
          ].map((friend) => (
            <div key={friend.name} className="flex items-center gap-3 p-3 rounded-2xl bg-card border border-border/50 group hover:border-primary/30 transition-colors">
              <div className="w-10 h-10 rounded-full bg-muted border border-border relative">
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-card rounded-full" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold">{friend.name}</p>
                <p className="text-[10px] text-muted-foreground">{friend.action}</p>
              </div>
              <span className="text-[10px] font-bold text-muted-foreground">{friend.time}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
