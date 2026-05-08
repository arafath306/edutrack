"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles, Check, TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

// --- Custom Components ---

const FloatingBlobs = () => (
  <div className="absolute inset-0 overflow-hidden -z-10 pointer-events-none">
    <motion.div
      animate={{
        x: [0, -50, 50, 0],
        y: [0, -80, -40, 0],
        scale: [1, 1.2, 0.9, 1],
      }}
      transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px]"
    />
    <motion.div
      animate={{
        x: [0, 60, -40, 0],
        y: [0, 100, 50, 0],
        scale: [1, 1.1, 1.3, 1],
      }}
      transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[150px]"
    />
  </div>
);

const PreviewCard = ({ label, icon: Icon, color, delay }: any) => (
  <motion.div
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ delay, duration: 0.8, ease: "easeOut" }}
    whileHover={{ y: -5, backgroundColor: "rgba(255,255,255,0.08)" }}
    className="p-5 rounded-[22px] bg-white/[0.04] border border-white/10 backdrop-blur-xl flex items-center gap-4 transition-all cursor-default shadow-2xl"
  >
    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center bg-white/5", color)}>
      <Icon className="w-5 h-5" />
    </div>
    <span className="text-sm font-semibold tracking-tight">{label}</span>
  </motion.div>
);

// --- Page Component ---

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  };

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });
  };

  return (
    <div className="min-h-screen flex bg-[#0a0a0a] text-white selection:bg-primary/30 overflow-hidden font-sans">
      <FloatingBlobs />

      {/* LEFT PANEL - BRANDING */}
      <div className="hidden lg:flex w-[45%] relative flex-col p-16 justify-between bg-gradient-to-br from-[#0a0a0a] to-[#0d0d0d] border-r border-white/5">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 group cursor-pointer"
          onClick={() => router.push('/')}
        >
          <div className="w-12 h-12 bg-primary rounded-[18px] flex items-center justify-center shadow-[0_8px_30px_rgb(99,102,241,0.3)] rotate-2 group-hover:rotate-6 transition-transform duration-500">
            <span className="text-white font-bold text-3xl">E</span>
          </div>
          <span className="text-2xl font-bold tracking-[-0.04em] text-white/90">EduTrack</span>
        </motion.div>

        <div className="space-y-10 relative z-10">
          <motion.div
            initial={{ x: -40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <h1 className="text-[5.5rem] leading-[0.95] font-bold tracking-[-0.06em] mb-8">
              Welcome <span className="text-primary">Back.</span><br />
              Ready to <span className="text-cyan-500">Learn?</span>
            </h1>
            <p className="text-xl text-white/40 font-medium max-w-sm leading-relaxed tracking-tight">
              Pick up right where you left off. Your AI-powered study space is waiting.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 gap-5 mt-16 max-w-lg">
            <PreviewCard label="AI Tutor" icon={Sparkles} color="text-purple-400" delay={0.4} />
            <PreviewCard label="Progress" icon={TrendingUp} color="text-green-400" delay={0.5} />
          </div>
        </div>

        <div className="text-[13px] text-white/20 font-medium flex gap-8">
          <span>© 2026 EduTrack. All rights reserved.</span>
        </div>
      </div>

      {/* RIGHT PANEL - FORM */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 relative overflow-y-auto pt-20 pb-20 no-scrollbar">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[500px] bg-white/[0.03] backdrop-blur-[40px] border border-white/10 rounded-[40px] p-10 md:p-14 shadow-[0_40px_100px_rgba(0,0,0,0.6)] relative overflow-hidden"
        >
          <div className="lg:hidden flex justify-center mb-10">
            <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center shadow-2xl rotate-2">
              <span className="text-white font-bold text-3xl">E</span>
            </div>
          </div>

          <header className="mb-12 text-center lg:text-left">
            <h2 className="text-4xl font-bold tracking-tight mb-3">Sign In</h2>
            <p className="text-white/40 text-lg font-medium tracking-tight">Welcome back to your study space.</p>
          </header>

          {error && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              className="mb-8 p-5 bg-red-500/10 border border-red-500/20 rounded-[20px] text-red-500 text-sm font-semibold flex items-center gap-3"
            >
              <div className="w-2 h-2 rounded-full bg-red-500" />
              {error}
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="relative group">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-primary transition-colors" />
              <input
                type="email"
                placeholder="Email Address"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full pl-14 pr-5 py-5 bg-white/[0.05] rounded-[22px] border border-white/5 focus:border-primary/40 focus:bg-white/[0.08] outline-none transition-all text-base font-medium placeholder:text-white/20"
                required
              />
            </div>

            <div className="space-y-4">
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-primary transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full pl-14 pr-14 py-5 bg-white/[0.05] rounded-[22px] border border-white/5 focus:border-primary/40 focus:bg-white/[0.08] outline-none transition-all text-base font-medium placeholder:text-white/20"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <div className="flex justify-end px-1">
                <Link href="#" className="text-sm font-bold text-primary hover:text-primary/80 transition-colors">Forgot Password?</Link>
              </div>
            </div>

            <Button
              disabled={loading}
              className="w-full h-16 rounded-[24px] bg-gradient-to-r from-primary to-purple-600 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 text-white font-bold text-lg shadow-[0_15px_40px_rgba(99,102,241,0.3)] group relative overflow-hidden border-t border-white/20 mt-4"
            >
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.span
                    key="loading"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing In...
                  </motion.span>
                ) : (
                  <motion.span
                    key="normal"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-2"
                  >
                    Sign In
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </motion.span>
                )}
              </AnimatePresence>
            </Button>

            <div className="flex items-center gap-4 py-4">
              <div className="h-[1px] flex-1 bg-white/5" />
              <span className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">Social Access</span>
              <div className="h-[1px] flex-1 bg-white/5" />
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleLogin}
              className="w-full h-14 rounded-[22px] border-white/5 bg-white/[0.03] hover:bg-white/[0.08] hover:border-white/20 transition-all font-bold gap-3 text-white/70"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Sign in with Google
            </Button>

            <p className="text-center text-sm text-white/30 font-medium pt-6">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-primary font-bold hover:text-primary/80 transition-colors underline-offset-4 hover:underline">Create Account</Link>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
