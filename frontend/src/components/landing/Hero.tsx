"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, BookOpen, Users, Play } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 overflow-hidden bg-background">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] opacity-50 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px] opacity-30 pointer-events-none" />

      <div className="container px-4 mx-auto text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6"
        >
          <Sparkles className="w-4 h-4" />
          <span>The Future of Learning is Here</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70"
        >
          Elevate Your Study <br /> With <span className="text-primary">EduTrack</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground mb-10"
        >
          A premium AI-powered ecosystem designed for students, teachers, and creators. 
          Manage tasks, chat with friends, and learn with AI — all in one place.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Button size="lg" className="rounded-full px-8 h-12 text-base font-semibold group">
            Get Started Free
            <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Button>
          <Button size="lg" variant="outline" className="rounded-full px-8 h-12 text-base font-semibold">
            <Play className="mr-2 w-4 h-4" />
            Watch Demo
          </Button>
        </motion.div>

        {/* Floating Previews */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-20 relative max-w-5xl mx-auto"
        >
          <div className="rounded-2xl border border-border bg-card overflow-hidden premium-shadow">
             {/* Mock UI Content */}
             <div className="aspect-video bg-gradient-to-br from-slate-900 to-slate-950 flex items-center justify-center p-8">
                <div className="grid grid-cols-12 gap-4 w-full h-full opacity-80">
                  <div className="col-span-3 bg-white/5 rounded-lg border border-white/10" />
                  <div className="col-span-6 bg-white/5 rounded-lg border border-white/10 flex flex-col p-4 gap-4">
                    <div className="h-8 w-1/2 bg-white/10 rounded" />
                    <div className="grid grid-cols-2 gap-4 flex-1">
                      <div className="bg-white/10 rounded" />
                      <div className="bg-white/10 rounded" />
                    </div>
                  </div>
                  <div className="col-span-3 bg-white/5 rounded-lg border border-white/10" />
                </div>
             </div>
          </div>
          
          {/* Floating Badges */}
          <div className="absolute -top-6 -left-6 md:-top-10 md:-left-10 bg-card p-4 rounded-xl border border-border shadow-2xl animate-bounce duration-3000">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <BookOpen className="text-blue-500 w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold">12 Tasks</p>
                  <p className="text-xs text-muted-foreground">Completed today</p>
                </div>
             </div>
          </div>

          <div className="absolute -bottom-6 -right-6 md:-bottom-10 md:-right-10 bg-card p-4 rounded-xl border border-border shadow-2xl animate-bounce duration-3000 delay-500">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Users className="text-green-500 w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold">4 Friends</p>
                  <p className="text-xs text-muted-foreground">Active now</p>
                </div>
             </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
