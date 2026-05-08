"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, X, Brain, Book, FileText, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";

const aiFeatures = [
  { icon: Brain, label: "Homework Solver", color: "bg-blue-500" },
  { icon: Book, label: "Quiz Generator", color: "bg-purple-500" },
  { icon: FileText, label: "Notes Summarizer", color: "bg-green-500" },
  { icon: Zap, label: "Study Planner", color: "bg-orange-500" },
];

export default function EduAI() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! I'm your EduTrack AI assistant. How can I help you study today? (আমি আপনাকে কিভাবে সাহায্য করতে পারি?)" }
  ]);
  const [input, setInput] = useState("");

  // Rules of Hooks: All hooks (useState, usePathname, etc.) MUST be called before any early returns.
  const isAuthPage = pathname === "/login" || pathname === "/register" || pathname === "/verify" || pathname === "/";
  if (isAuthPage) return null;

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { role: "user", content: input }]);
    setInput("");
    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { role: "assistant", content: "I'm processing your request. Please wait a moment..." }]);
    }, 1000);
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-6 w-14 h-14 bg-primary rounded-full flex items-center justify-center shadow-2xl z-40"
      >
        <Sparkles className="text-primary-foreground w-6 h-6" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed bottom-24 right-6 w-[90vw] md:w-[400px] h-[600px] bg-card border border-border rounded-3xl shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-primary text-primary-foreground flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                <span className="font-bold">EduAI Assistant</span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-primary-foreground hover:bg-white/10 rounded-full">
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* AI Features Grid */}
            <div className="p-4 grid grid-cols-2 gap-2 bg-muted/30">
              {aiFeatures.map((f) => (
                <button key={f.label} className="p-2 rounded-xl border border-border bg-card hover:bg-accent transition-colors flex flex-col items-center gap-1">
                  <div className={`p-2 rounded-lg ${f.color} bg-opacity-20`}>
                    <f.icon className={`w-4 h-4 ${f.color.replace('bg-', 'text-')}`} />
                  </div>
                  <span className="text-[10px] font-medium">{f.label}</span>
                </button>
              ))}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl ${m.role === 'user' ? 'bg-primary text-primary-foreground rounded-tr-none' : 'bg-muted border border-border rounded-tl-none'}`}>
                    <p className="text-sm">{m.content}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border bg-card">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask anything..."
                  className="w-full p-3 pr-12 bg-muted rounded-full border-none focus:ring-2 focus:ring-primary outline-none text-sm"
                />
                <button onClick={handleSend} className="absolute right-2 p-2 bg-primary text-primary-foreground rounded-full hover:opacity-90 transition-opacity">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
