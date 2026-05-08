"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, ArrowRight, RefreshCcw, CheckCircle2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const FloatingBlobs = () => (
  <div className="absolute inset-0 overflow-hidden -z-10 pointer-events-none">
    <motion.div
      animate={{
        x: [0, 30, -30, 0],
        y: [0, 50, 20, 0],
        scale: [1, 1.1, 1],
      }}
      transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      className="absolute top-[-5%] left-[-5%] w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px]"
    />
    <motion.div
      animate={{
        x: [0, -40, 30, 0],
        y: [0, -60, -30, 0],
        scale: [1, 1.2, 1],
      }}
      transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px]"
    />
  </div>
);

export default function VerifyPage() {
  const router = useRouter();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [timer, setTimer] = useState(59);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Move to next input
    if (value && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate verification
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => router.push("/dashboard"), 2000);
    }, 1500);
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] p-6">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center space-y-8"
        >
          <div className="w-28 h-28 bg-green-500/20 rounded-full flex items-center justify-center mx-auto border border-green-500/30 shadow-[0_0_50px_rgba(34,197,94,0.2)]">
            <CheckCircle2 className="w-14 h-14 text-green-500" />
          </div>
          <div className="space-y-2">
            <h2 className="text-4xl font-bold text-white tracking-tight">Identity Verified.</h2>
            <p className="text-muted-foreground text-lg">Welcome to the elite circle of learners.</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] p-6 text-white overflow-hidden relative font-sans">
      <FloatingBlobs />

      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[500px] bg-white/[0.03] backdrop-blur-[40px] border border-white/10 rounded-[40px] p-10 md:p-14 shadow-[0_40px_100px_rgba(0,0,0,0.6)] relative overflow-hidden"
      >
        <div className="flex justify-center mb-10">
          <div className="w-16 h-16 bg-primary/10 rounded-[24px] flex items-center justify-center border border-primary/30 shadow-[0_0_40px_rgba(99,102,241,0.2)]">
            <ShieldCheck className="w-8 h-8 text-primary" />
          </div>
        </div>

        <header className="mb-12 text-center">
          <h2 className="text-4xl font-bold tracking-tight mb-3">Verify Email</h2>
          <p className="text-white/40 text-lg font-medium tracking-tight">
            We sent a 6-digit code to your email.
          </p>
        </header>

        <form onSubmit={handleVerify} className="space-y-10">
          <div className="flex justify-between gap-3">
            {otp.map((digit, i) => (
              <input
                key={i}
                type="text"
                maxLength={1}
                value={digit}
                ref={(el) => {
                  inputs.current[i] = el;
                }}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className={cn(
                  "w-full h-16 bg-white/[0.05] rounded-[20px] border border-white/5 text-center text-2xl font-bold focus:border-primary/50 focus:bg-white/[0.08] focus:ring-4 focus:ring-primary/10 outline-none transition-all",
                  digit ? "border-primary/40 text-primary" : ""
                )}
              />
            ))}
          </div>

          <div className="space-y-6">
            <Button
              disabled={loading || otp.some(d => !d)}
              className="w-full h-16 rounded-[24px] bg-gradient-to-r from-primary to-purple-600 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 text-white font-bold text-lg shadow-[0_15px_40px_rgba(99,102,241,0.3)] group relative overflow-hidden border-t border-white/20"
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
                    Verifying...
                  </motion.span>
                ) : (
                  <motion.span
                    key="normal"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-2"
                  >
                    Confirm Code
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </motion.span>
                )}
              </AnimatePresence>
            </Button>

            <div className="text-center">
              <p className="text-sm text-white/30 font-medium mb-4">
                Didn't receive the code? {timer > 0 ? `Resend in ${timer}s` : ""}
              </p>
              <Button
                type="button"
                variant="ghost"
                disabled={timer > 0}
                className="text-primary font-bold hover:bg-primary/10 rounded-xl px-6"
                onClick={() => setTimer(59)}
              >
                <RefreshCcw className="w-4 h-4 mr-2" />
                Resend Code
              </Button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
