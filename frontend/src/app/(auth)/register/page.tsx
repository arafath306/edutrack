"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  AtSign, User, Mail, Lock, Eye, EyeOff, Check, Camera, 
  Upload, Sparkles, Building, CheckCircle2,
  ArrowRight, TrendingUp, ShieldCheck, Key
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
  </div>
);

const StrengthMeter = ({ password }: { password: string }) => {
  const [strength, setStrength] = useState(0);
  useEffect(() => {
    let s = 0;
    if (password.length > 6) s++;
    if (password.length > 10) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    setStrength(s);
  }, [password]);

  const colors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-500", "bg-emerald-500"];
  return (
    <div className="mt-2 flex gap-1.5 h-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className={cn("flex-1 rounded-full transition-all duration-700", i <= strength ? colors[strength - 1] : "bg-white/10")} />
      ))}
    </div>
  );
};

const PreviewCard = ({ label, icon: Icon, color, delay }: any) => (
  <motion.div
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ delay, duration: 0.8 }}
    className="p-5 rounded-[22px] bg-white/[0.04] border border-white/10 backdrop-blur-xl flex items-center gap-4 cursor-default shadow-2xl"
  >
    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center bg-white/5", color)}>
      <Icon className="w-5 h-5" />
    </div>
    <span className="text-sm font-semibold tracking-tight">{label}</span>
  </motion.div>
);

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
    inviteCode: "", // Private Key for Students
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

    let institution_id = null;

    // --- STUDENT VALIDATION (Private Key) ---
    if (selectedRole === "STUDENT") {
      if (!form.inviteCode) {
        setErrors({ inviteCode: "Private Key is required for students" });
        setLoading(false);
        return;
      }

      // Check if code exists in institutions table
      const { data: inst, error: instError } = await supabase
        .from("institutions")
        .select("id")
        .eq("invite_code", form.inviteCode)
        .single();

      if (instError || !inst) {
        setErrors({ inviteCode: "Invalid Private Key. Please contact your teacher." });
        setLoading(false);
        return;
      }
      institution_id = inst.id;
    }

    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          name: form.name,
          username: form.username,
          role: selectedRole,
          institution_id: institution_id,
          // Defaulting to 1st year/Science for demo if needed, or could add more fields
          year: "1st Year",
          department: "Science"
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
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center space-y-8">
          <div className="w-28 h-28 bg-primary/20 rounded-full flex items-center justify-center mx-auto border border-primary/30 shadow-[0_0_50px_rgba(99,102,241,0.2)]">
            <CheckCircle2 className="w-14 h-14 text-primary" />
          </div>
          <div className="space-y-2">
            <h2 className="text-4xl font-bold text-white tracking-tight">Identity Confirmed.</h2>
            <p className="text-muted-foreground text-lg">Redirecting to your study server...</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#0a0a0a] text-white selection:bg-primary/30 overflow-hidden font-sans">
      <FloatingBlobs />

      {/* LEFT PANEL */}
      <div className="hidden lg:flex w-[45%] relative flex-col p-16 justify-between bg-gradient-to-br from-[#0a0a0a] to-[#0d0d0d] border-r border-white/5">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4 group cursor-pointer" onClick={() => router.push('/')}>
          <div className="w-12 h-12 bg-primary rounded-[18px] flex items-center justify-center shadow-[0_8px_30px_rgb(99,102,241,0.3)] rotate-2">
            <span className="text-white font-bold text-3xl">E</span>
          </div>
          <span className="text-2xl font-bold tracking-[-0.04em] text-white/90">EduTrack</span>
        </motion.div>

        <div className="space-y-10 relative z-10">
          <motion.div initial={{ x: -40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2, duration: 0.8 }}>
            <h1 className="text-[5.5rem] leading-[0.95] font-bold tracking-[-0.06em] mb-8">
              Server <span className="text-primary italic">Joined.</span><br />
              System <span className="text-purple-500">Active.</span>
            </h1>
            <p className="text-xl text-white/40 font-medium max-w-sm leading-relaxed tracking-tight">
              A private study ecosystem for elite institutions. Enter your private key to begin.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 gap-5 mt-16 max-w-lg">
            <PreviewCard label="Private Server" icon={Building} color="text-purple-400" delay={0.4} />
            <PreviewCard label="Dept. Groups" icon={ShieldCheck} color="text-green-400" delay={0.5} />
            <PreviewCard label="Auto-Enroll" icon={Key} color="text-blue-400" delay={0.6} />
            <PreviewCard label="XP Rewards" icon={TrendingUp} color="text-cyan-400" delay={0.7} />
          </div>
        </div>

        <div className="text-[13px] text-white/20 font-medium flex gap-8">
          <span>© 2026 EduTrack. Secure Access Only.</span>
        </div>
      </div>

      {/* RIGHT PANEL - FORM */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 relative overflow-y-auto pt-20 pb-20 no-scrollbar">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[520px] bg-white/[0.03] backdrop-blur-[40px] border border-white/10 rounded-[40px] p-10 md:p-14 shadow-[0_40px_100px_rgba(0,0,0,0.6)]"
        >
          <header className="mb-10 text-center lg:text-left">
            <h2 className="text-4xl font-bold tracking-tight mb-3">Create Profile</h2>
            <p className="text-white/40 text-lg font-medium">Initialize your secure study credentials.</p>
          </header>

          <form onSubmit={handleRegister} className="space-y-6">
            {/* Role Selection */}
            <div className="space-y-4">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/30 px-1">Identity Role</span>
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
                      "flex flex-col items-center justify-center p-4 rounded-[22px] border transition-all gap-2",
                      selectedRole === role.id ? "bg-primary/10 border-primary/50 text-primary shadow-lg shadow-primary/10" : "bg-white/[0.03] border-white/5 text-white/40 hover:bg-white/[0.06]"
                    )}
                  >
                    <role.icon className="w-5 h-5" />
                    <span className="text-[11px] font-bold">{role.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Private Key for Students */}
            <AnimatePresence>
              {selectedRole === "STUDENT" && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }} 
                  animate={{ height: "auto", opacity: 1 }} 
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-2 overflow-hidden"
                >
                  <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary px-1">Institutional Private Key</label>
                  <div className={cn("relative group transition-all", errors.inviteCode && "ring-2 ring-red-500/50 rounded-[22px]")}>
                    <Key className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary group-focus-within:animate-pulse" />
                    <input
                      placeholder="Enter Server Invite Code"
                      value={form.inviteCode}
                      onChange={(e) => setForm({ ...form, inviteCode: e.target.value })}
                      className="w-full pl-14 pr-5 py-5 bg-primary/5 rounded-[22px] border border-primary/20 focus:border-primary focus:bg-primary/10 outline-none transition-all text-base font-bold placeholder:text-primary/30"
                      required
                    />
                  </div>
                  {errors.inviteCode && <p className="text-[10px] text-red-500 font-bold px-1">{errors.inviteCode}</p>}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="relative group">
                <AtSign className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-primary" />
                <input placeholder="Username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} className="w-full pl-14 pr-5 py-4 bg-white/[0.05] rounded-[22px] border border-white/5 focus:border-primary/40 outline-none transition-all text-base font-medium" required />
              </div>
              <div className="relative group">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-primary" />
                <input placeholder="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full pl-14 pr-5 py-4 bg-white/[0.05] rounded-[22px] border border-white/5 focus:border-primary/40 outline-none transition-all text-base font-medium" required />
              </div>
            </div>

            <div className="relative group">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-primary" />
              <input type="email" placeholder="Email Address" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full pl-14 pr-5 py-4 bg-white/[0.05] rounded-[22px] border border-white/5 focus:border-primary/40 outline-none transition-all text-base font-medium" required />
            </div>

            <div className="space-y-3">
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-primary" />
                <input type={showPassword ? "text" : "password"} placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full pl-14 pr-14 py-4 bg-white/[0.05] rounded-[22px] border border-white/5 focus:border-primary/40 outline-none transition-all text-base font-medium" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors">{showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button>
              </div>
              <StrengthMeter password={form.password} />
            </div>

            <div className="relative group">
              <Check className={cn("absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors", form.confirmPassword && form.password === form.confirmPassword ? "text-green-500" : "text-white/30")} />
              <input type="password" placeholder="Confirm Password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} className={cn("w-full pl-14 pr-5 py-4 bg-white/[0.05] rounded-[22px] border border-white/5 outline-none transition-all text-base font-medium", form.confirmPassword && form.password === form.confirmPassword ? "border-green-500/40" : "focus:border-primary/40")} required />
            </div>

            <Button disabled={loading} className="w-full h-16 rounded-[24px] bg-gradient-to-r from-primary to-purple-600 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 text-white font-bold text-lg shadow-[0_15px_40px_rgba(99,102,241,0.3)] group relative overflow-hidden border-t border-white/20">
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.span key="loading" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Initializing Account...
                  </motion.span>
                ) : (
                  <motion.span key="normal" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex items-center gap-2">
                    Create Profile <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </motion.span>
                )}
              </AnimatePresence>
            </Button>

            <p className="text-center text-sm text-white/30 font-medium pt-4">Already registered? <Link href="/login" className="text-primary font-bold hover:underline underline-offset-4">Sign In</Link></p>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
