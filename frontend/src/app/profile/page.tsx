"use client";

import { motion } from "framer-motion";
import { User, Gem, Trophy, Star, Settings, Shield, LogOut, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const achievements = [
  { name: "Early Adopter", icon: Star, color: "text-yellow-500", bg: "bg-yellow-500/10" },
  { name: "7 Day Streak", icon: Trophy, color: "text-orange-500", bg: "bg-orange-500/10" },
  { name: "Top Learner", icon: Shield, color: "text-blue-500", bg: "bg-blue-500/10" },
];

export default function ProfilePage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="relative mb-8">
        {/* Profile Header Background */}
        <div className="h-48 rounded-3xl bg-gradient-to-r from-primary/20 via-purple-500/20 to-pink-500/20 border border-border overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/5" />
        </div>
        
        {/* Profile Info */}
        <div className="px-6 -mt-16 flex flex-col md:flex-row items-end gap-6">
          <div className="relative">
            <div className="w-32 h-32 rounded-3xl bg-card border-4 border-background overflow-hidden shadow-2xl">
              <div className="w-full h-full bg-primary/20 flex items-center justify-center">
                 <User className="w-16 h-16 text-primary" />
              </div>
            </div>
            <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-yellow-500 border-4 border-background flex items-center justify-center text-white font-bold text-xs shadow-lg">
              Lv 8
            </div>
          </div>
          <div className="flex-1 mb-4">
            <h1 className="text-3xl font-bold mb-1">Arafath Hossain</h1>
            <p className="text-muted-foreground font-medium">arafath@example.com</p>
          </div>
          <div className="flex gap-2 mb-4">
            <Button variant="outline" className="rounded-xl gap-2">
              <Settings className="w-4 h-4" />
              Edit Profile
            </Button>
            <Button variant="destructive" className="rounded-xl gap-2">
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Left Column - Stats */}
        <div className="md:col-span-1 space-y-6">
          <div className="p-6 rounded-3xl border border-border bg-card">
             <h2 className="font-bold mb-4">Currency & XP</h2>
             <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-2xl bg-muted/50 border border-border/50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                      <Gem className="w-4 h-4 text-blue-500" />
                    </div>
                    <span className="text-sm font-bold">EduDiamonds</span>
                  </div>
                  <span className="font-bold">1,250</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-2xl bg-muted/50 border border-border/50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
                      <Trophy className="w-4 h-4 text-orange-500" />
                    </div>
                    <span className="text-sm font-bold">Experience</span>
                  </div>
                  <span className="font-bold text-orange-500">8,450 XP</span>
                </div>
             </div>
             <div className="mt-6 space-y-2">
               <div className="flex justify-between text-xs font-bold mb-1">
                 <span>Progress to Level 9</span>
                 <span>85%</span>
               </div>
               <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                 <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: '85%' }}
                   className="h-full bg-gradient-to-r from-primary to-purple-500"
                 />
               </div>
             </div>
          </div>

          <div className="p-6 rounded-3xl border border-border bg-card">
             <h2 className="font-bold mb-4">Achievements</h2>
             <div className="grid grid-cols-3 gap-4">
                {achievements.map((ach) => (
                  <div key={ach.name} className="flex flex-col items-center gap-2 group cursor-pointer">
                    <div className={`w-12 h-12 rounded-2xl ${ach.bg} flex items-center justify-center transition-transform group-hover:scale-110`}>
                      <ach.icon className={`w-6 h-6 ${ach.color}`} />
                    </div>
                    <span className="text-[10px] font-bold text-center leading-tight">{ach.name}</span>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Right Column - Premium & Activity */}
        <div className="md:col-span-2 space-y-6">
           {/* Premium Card */}
           <div className="p-8 rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-bold mb-4 backdrop-blur-md">
                  <Star className="w-3 h-3 fill-white" />
                  Premium Member
                </div>
                <h2 className="text-2xl font-bold mb-2">EduTrack Pro Plus</h2>
                <p className="text-white/80 text-sm mb-6 max-w-sm">
                  Unlimited AI assistance, detailed analytics, and exclusive creator content.
                </p>
                <Button className="bg-white text-primary hover:bg-white/90 rounded-xl font-bold px-8">
                  Manage Subscription
                </Button>
              </div>
           </div>

           {/* Recent Activity */}
           <div className="p-6 rounded-3xl border border-border bg-card">
              <h2 className="font-bold mb-4">Recent Activity</h2>
              <div className="space-y-4">
                 {[
                   { title: "Completed Quantum Physics Quiz", time: "2 hours ago", xp: "+50 XP" },
                   { title: "Watched Organic Chemistry Basics", time: "5 hours ago", xp: "+20 XP" },
                   { title: "Started 7 Day Study Streak", time: "1 day ago", xp: "+100 XP" },
                 ].map((act, i) => (
                   <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-border/50 group hover:bg-muted/50 transition-colors cursor-pointer">
                      <div>
                        <p className="text-sm font-bold">{act.title}</p>
                        <p className="text-xs text-muted-foreground">{act.time}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-green-500">{act.xp}</span>
                        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
