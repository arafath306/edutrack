"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  AtSign, User, Mail, Lock, Eye, EyeOff, Check, Camera, 
  Upload, Sparkles, Search, Building, CheckCircle2,
  ArrowRight, Chrome, TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

// --- Custom Components ---

const FloatingBlobs = () => (
  <div className="absolute inset-0 overflow-hidden -z-10 pointer-events-none">
    <motion.div
      animate={{
        x: [0, 50, -50, 0],
        y: [0, 80, 40, 0],
        scale: [1, 1.2, 0.9, 1],
      }}
      transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px]"
    />
    <motion.div
      animate={{
        x: [0, -60, 40, 0],
        y: [0, -100, -50, 0],
        scale: [1, 1.1, 1.3, 1],
      }}
      transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[150px]"
    />
    <motion.div
      animate={{
        opacity: [0.2, 0.4, 0.2],
      }}
      transition={{ duration: 10, repeat: Infinity }}
      className="absolute top-[20%] right-[20%] w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[100px]"
    />
  </div>
);

const StrengthMeter = ({ password }: { password: string }) => {
  const [strength, setStrength] = useState(0);
  const [label, setLabel] = useState("Weak");

  useEffect(() => {
    let s = 0;
    if (password.length > 6) s++;
    if (password.length > 10) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    setStrength(s);
    if (s <= 2) setLabel("Weak");
    else if (s <= 4) setLabel("Medium");
    else setLabel("Strong");
  }, [password]);

  const colors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-500", "bg-emerald-500"];

  return (
    <div className="mt-2 space-y-1">
      <div className="flex gap-1.5 h-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <div 
            key={i} 
            className={cn(
              "flex-1 rounded-full transition-all duration-700 ease-out",
              i <= strength ? colors[strength - 1] : "bg-white/10"
            )}
          />
        ))}
      </div>
      <p className={cn("text-[9px] font-bold uppercase tracking-[0.2em] transition-opacity", strength > 0 ? "opacity-60" : "opacity-0")}>
        {label}
      </p>
    </div>
  );
};

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

export default function RegisterPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState("STUDENT");
  const [success, setSuccess] = useState(false);
  
  const [form, setForm] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    
    if (form.password !== form.confirmPassword) {
      setErrors({ confirmPassword: "Passwords do not match" });
      setLoading(false);
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          name: form.name,
          username: form.username,
          role: selectedRole,
        },
      },
    });

    if (error) {
      setErrors({ auth: error.message });
      setLoading(false);
    } else {
      setSuccess(true);
      setTimeout(() => router.push("/dashboard"), 2000);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505]">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center space-y-8"
        >
          <div className="w-28 h-28 bg-primary/20 rounded-full flex items-center justify-center mx-auto border border-primary/30 shadow-[0_0_50px_rgba(99,102,241,0.2)]">
            <CheckCircle2 className="w-14 h-14 text-primary" />
          </div>
          <div className="space-y-2">
            <h2 className="text-4xl font-bold text-white tracking-tight">Welcome to the future.</h2>
            <p className="text-muted-foreground text-lg">Your EduTrack journey starts now.</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#0a0a0a] text-white selection:bg-primary/30 overflow-hidden font-sans">
      <FloatingBlobs />

      {/* LEFT PANEL - BRANDING */}
      <div className="hidden lg:flex w-[45%] relative flex-col p-16 justify-between bg-gradient-to-br from-[#0a0a0a] to-[#0d0d0d] border-r border-white/5">
        {/* Logo Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 group cursor-pointer"
        >
          <div className="w-12 h-12 bg-primary rounded-[18px] flex items-center justify-center shadow-[0_8px_30px_rgb(99,102,241,0.3)] rotate-2 group-hover:rotate-6 transition-transform duration-500">
            <span className="text-white font-bold text-3xl">E</span>
          </div>
          <span className="text-2xl font-bold tracking-[-0.04em] text-white/90">EduTrack</span>
        </motion.div>

        {/* Hero Text */}
        <div className="space-y-10 relative z-10">
          <motion.div
            initial={{ x: -40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <h1 className="text-[5.5rem] leading-[0.95] font-bold tracking-[-0.06em] mb-8">
              Study <span className="text-primary italic">Smarter.</span><br />
              Grow <span className="text-purple-500">Faster.</span>
            </h1>
            <p className="text-xl text-white/40 font-medium max-w-sm leading-relaxed tracking-tight">
              A premium AI-powered study ecosystem designed for high-performance learners.
            </p>
          </motion.div>

          {/* Preview Grid */}
          <div className="grid grid-cols-2 gap-5 mt-16 max-w-lg">
            <PreviewCard label="AI Summaries" icon={Sparkles} color="text-purple-400" delay={0.4} />
            <PreviewCard label="Daily Tasks" icon={Check} color="text-green-400" delay={0.5} />
            <PreviewCard label="Real-time Chat" icon={Mail} color="text-blue-400" delay={0.6} />
            <PreviewCard label="Analytics" icon={TrendingUp} color="text-cyan-400" delay={0.7} />
          </div>
        </div>

        {/* Footer */}
        <div className="text-[13px] text-white/20 font-medium flex gap-8">
          <span>© 2026 EduTrack. All rights reserved.</span>
          <Link href="#" className="hover:text-white/60 transition-colors">Privacy</Link>
          <Link href="#" className="hover:text-white/60 transition-colors">Terms</Link>
        </div>
      </div>

      {/* RIGHT PANEL - FORM */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 relative overflow-y-auto pt-20 pb-20 no-scrollbar">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[520px] bg-white/[0.03] backdrop-blur-[40px] border border-white/10 rounded-[40px] p-10 md:p-14 shadow-[0_40px_100px_rgba(0,0,0,0.6)] relative overflow-hidden"
        >
          {/* Mobile View Logo */}
          <div className="lg:hidden flex justify-center mb-10">
            <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center shadow-2xl rotate-2">
              <span className="text-white font-bold text-3xl">E</span>
            </div>
          </div>

          <header className="mb-12 text-center lg:text-left">
            <h2 className="text-4xl font-bold tracking-tight mb-3">Create Account</h2>
            <p className="text-white/40 text-lg font-medium tracking-tight">Join the next generation of learners.</p>
          </header>

          {errors.auth && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              className="mb-8 p-5 bg-red-500/10 border border-red-500/20 rounded-[20px] text-red-500 text-sm font-semibold flex items-center gap-3"
            >
              <div className="w-2 h-2 rounded-full bg-red-500" />
              {errors.auth}
            </motion.div>
          )}

          <form onSubmit={handleRegister} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="relative group">
                <AtSign className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-primary transition-colors" />
                <input
                  placeholder="Username"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  className="w-full pl-14 pr-5 py-4 bg-white/[0.05] rounded-[22px] border border-white/5 focus:border-primary/40 focus:bg-white/[0.08] outline-none transition-all text-base font-medium placeholder:text-white/20"
                  required
                />
              </div>
              <div className="relative group">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-primary transition-colors" />
                <input
                  placeholder="Full Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full pl-14 pr-5 py-4 bg-white/[0.05] rounded-[22px] border border-white/5 focus:border-primary/40 focus:bg-white/[0.08] outline-none transition-all text-base font-medium placeholder:text-white/20"
                  required
                />
              </div>
            </div>

            <div className="relative group">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-primary transition-colors" />
              <input
                type="email"
                placeholder="Email Address"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full pl-14 pr-5 py-4 bg-white/[0.05] rounded-[22px] border border-white/5 focus:border-primary/40 focus:bg-white/[0.08] outline-none transition-all text-base font-medium placeholder:text-white/20"
                required
              />
            </div>

            <div className="space-y-3">
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-primary transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full pl-14 pr-14 py-4 bg-white/[0.05] rounded-[22px] border border-white/5 focus:border-primary/40 focus:bg-white/[0.08] outline-none transition-all text-base font-medium placeholder:text-white/20"
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
              <StrengthMeter password={form.password} />
            </div>

            <div className="relative group">
              <Check className={cn("absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors", form.confirmPassword && form.password === form.confirmPassword ? "text-green-500" : "text-white/30")} />
              <input
                type="password"
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                className={cn(
                  "w-full pl-14 pr-5 py-4 bg-white/[0.05] rounded-[22px] border border-white/5 focus:bg-white/[0.08] outline-none transition-all text-base font-medium placeholder:text-white/20",
                  form.confirmPassword && form.password === form.confirmPassword ? "border-green-500/40" : "focus:border-primary/40"
                )}
                required
              />
            </div>

            {/* Role Selection */}
            <div className="space-y-4">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/30 px-1">Choose Role</span>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: "STUDENT", label: "Student", icon: User },
                  { id: "TEACHER", label: "Teacher", icon: Building },
                  { id: "CREATOR", label: "Creator", icon: Sparkles }
                ].map((role) => (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => setSelectedRole(role.id)}
                    className={cn(
                      "flex flex-col items-center justify-center p-4 rounded-[22px] border transition-all gap-2 group relative overflow-hidden",
                      selectedRole === role.id 
                        ? "bg-primary/10 border-primary/50 text-primary shadow-[0_0_30px_rgba(99,102,241,0.15)]" 
                        : "bg-white/[0.03] border-white/5 text-white/40 hover:bg-white/[0.06]"
                    )}
                  >
                    <role.icon className="w-5 h-5" />
                    <span className="text-[11px] font-bold tracking-tight">{role.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
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
                    Creating Account...
                  </motion.span>
                ) : (
                  <motion.span
                    key="normal"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-2"
                  >
                    Create Account
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </motion.span>
                )}
              </AnimatePresence>
            </Button>

            <div className="flex items-center gap-4 py-4">
              <div className="h-[1px] flex-1 bg-white/5" />
              <span className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">Social Connect</span>
              <div className="h-[1px] flex-1 bg-white/5" />
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full h-14 rounded-[22px] border-white/5 bg-white/[0.03] hover:bg-white/[0.08] hover:border-white/20 transition-all font-bold gap-3 text-white/70"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Sign up with Google
            </Button>

            <p className="text-center text-sm text-white/30 font-medium pt-6">
              Already have an account?{" "}
              <Link href="/login" className="text-primary font-bold hover:text-primary/80 transition-colors underline-offset-4 hover:underline">Sign In</Link>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
