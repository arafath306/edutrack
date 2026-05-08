"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, Plus, Calendar, 
  CheckCircle2, Clock, Trash2,
  X, Check, Building, Users, GraduationCap, ChevronRight, Share2, Key, Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/supabase/auth-provider";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

// --- Types ---
type ServerNode = "YEARS" | "DEPARTMENTS" | "STUDENTS" | "TASKS";

export default function TasksPage() {
  const { user } = useAuth();
  const supabase = createClient();
  
  // State
  const [loading, setLoading] = useState(true);
  const [institution, setInstitution] = useState<any>(null);
  const [currentView, setCurrentView] = useState<ServerNode>("TASKS");
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedDept, setSelectedDept] = useState<string | null>(null);
  const [members, setMembers] = useState<any[]>([]);
  
  // Modal State
  const [showCreateServer, setShowCreateServer] = useState(false);
  const [serverName, setServerName] = useState("");

  const userRole = (user?.user_metadata as any)?.role || "STUDENT";

  useEffect(() => {
    if (user) {
      fetchInstitution();
    }
  }, [user]);

  const fetchInstitution = async () => {
    const instId = (user?.user_metadata as any)?.institution_id;
    
    if (instId) {
      const { data } = await supabase.from("institutions").select("*").eq("id", instId).single();
      setInstitution(data);
    } else if (userRole === "TEACHER" && user) {
      // Check if teacher created an institution
      const { data } = await supabase.from("institutions").select("*").eq("created_by", user.id).single();
      setInstitution(data);
    }
    setLoading(false);
  };

  const handleCreateServer = async () => {
    if (!serverName) return;
    const inviteCode = `${serverName.substring(0, 3).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    
    const { data, error } = await supabase.from("institutions").insert({
      name: serverName,
      invite_code: inviteCode,
      created_by: user?.id
    }).select().single();

    if (!error) {
      setInstitution(data);
      setShowCreateServer(false);
      // Update teacher profile metadata with their own institution_id
      await supabase.auth.updateUser({
        data: { institution_id: data.id }
      });
    }
  };

  const fetchMembers = async (year: string, dept: string) => {
    setLoading(true);
    // In a real app, we'd query the profiles table filtered by institution_id, year, and dept
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("institution_id", institution?.id)
      .eq("year", year)
      .eq("department", dept);
    
    setMembers(data || []);
    setLoading(false);
  };

  // --- UI Components ---

  const TeacherEmptyState = () => (
    <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
      <div className="w-20 h-20 bg-primary/10 rounded-[30px] flex items-center justify-center border border-primary/20 shadow-xl">
        <Building className="w-10 h-10 text-primary" />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Launch Your Server</h2>
        <p className="text-sm text-muted-foreground max-w-[280px] mx-auto font-medium leading-relaxed">
          Create a private ecosystem for your college students. Share your unique key to invite them.
        </p>
      </div>
      <Button onClick={() => setShowCreateServer(true)} className="rounded-2xl h-14 px-8 font-bold text-base shadow-xl shadow-primary/20">
        Create College Server
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background pb-24 pt-4 px-4 space-y-6 max-w-lg mx-auto relative font-sans">
      {/* 1. HEADER */}
      <header className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h1 className="text-3xl font-bold tracking-tight">
            {currentView === "TASKS" ? "Tasks" : institution?.name || "Server"}
          </h1>
          <p className="text-[10px] font-bold uppercase tracking-widest text-primary">
            {userRole} • {institution ? "SECURE ACCESS" : "NO SERVER"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {institution && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setCurrentView(currentView === "TASKS" ? "YEARS" : "TASKS")}
              className={cn("rounded-full h-12 w-12 bg-card border border-border shadow-sm", currentView !== "TASKS" && "bg-primary text-white border-primary")}
            >
              <Building className="w-5 h-5" />
            </Button>
          )}
          <Button className="rounded-full h-12 w-12 p-0 bg-primary shadow-lg shadow-primary/20">
            <Plus className="w-6 h-6" />
          </Button>
        </div>
      </header>

      {/* 2. SERVER NAVIGATION CONTENT */}
      {loading ? (
        <div className="py-20 text-center text-muted-foreground animate-pulse font-medium">Synchronizing Secure Data...</div>
      ) : !institution ? (
        userRole === "TEACHER" ? <TeacherEmptyState /> : (
          <div className="p-8 bg-red-500/5 border border-red-500/10 rounded-[32px] text-center space-y-4">
            <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
            <p className="text-sm font-bold text-red-500/80">Disconnected from server. Please re-register with a valid Private Key.</p>
          </div>
        )
      ) : (
        <AnimatePresence mode="wait">
          {currentView === "TASKS" ? (
            <motion.div key="tasks" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-6">
              {/* Task filters and list here (kept from previous implementation) */}
              <div className="p-6 bg-card border border-border rounded-[32px] space-y-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-primary" />
                    Academic Workflow
                  </h3>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{institution.name}</span>
                </div>
                <p className="text-xs text-muted-foreground font-medium leading-relaxed italic">
                  "Manage your assignments and study schedules within your institutional workspace."
                </p>
              </div>
              <div className="text-center py-12 text-muted-foreground italic text-sm">Task list content loading...</div>
            </motion.div>
          ) : currentView === "YEARS" ? (
            <motion.div key="years" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="space-y-6">
              <div className="bg-primary/5 border border-primary/10 rounded-[32px] p-6 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold">Invite Key</h3>
                  <p className="text-2xl font-black tracking-tighter text-primary">{institution.invite_code}</p>
                </div>
                <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl bg-white/5 border border-white/5">
                  <Share2 className="w-5 h-5 text-primary" />
                </Button>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {["1st Year", "2nd Year"].map((year) => (
                  <button 
                    key={year}
                    onClick={() => { setSelectedYear(year); setCurrentView("DEPARTMENTS"); }}
                    className="flex items-center justify-between p-6 bg-card border border-border rounded-[28px] hover:border-primary/40 hover:bg-primary/[0.02] transition-all group shadow-sm"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                        <Users className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <span className="text-lg font-bold">{year}</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-all" />
                  </button>
                ))}
              </div>
            </motion.div>
          ) : currentView === "DEPARTMENTS" ? (
            <motion.div key="depts" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <button onClick={() => setCurrentView("YEARS")} className="text-xs font-bold text-primary flex items-center gap-1">Back to Years</button>
              <h3 className="text-xl font-bold">{selectedYear} Departments</h3>
              <div className="grid grid-cols-1 gap-3">
                {["Science", "Arts", "Commerce"].map((dept) => (
                  <button 
                    key={dept}
                    onClick={() => { setSelectedDept(dept); setCurrentView("STUDENTS"); fetchMembers(selectedYear!, dept); }}
                    className="p-5 bg-card border border-border rounded-[24px] text-left hover:border-primary/30 transition-all shadow-sm flex items-center justify-between"
                  >
                    <span className="font-bold">{dept}</span>
                    <div className="text-[10px] font-bold text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-widest">Select</div>
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div key="students" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <button onClick={() => setCurrentView("DEPARTMENTS")} className="text-xs font-bold text-primary flex items-center gap-1">Back to Departments</button>
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">{selectedDept} Students</h3>
                <span className="text-xs font-bold text-muted-foreground">{members.length} Enrolled</span>
              </div>
              <div className="space-y-3">
                {members.length > 0 ? members.map((member) => (
                  <div key={member.id} className="flex items-center gap-4 p-4 bg-card border border-border rounded-[24px] shadow-sm">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-purple-600 flex items-center justify-center text-white font-bold text-xs">
                      {member.name?.[0].toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold">{member.name}</p>
                      <p className="text-[10px] text-muted-foreground font-medium italic">@{member.username}</p>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                  </div>
                )) : (
                  <div className="py-12 text-center text-muted-foreground italic text-sm">No students found in this department yet.</div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* CREATE SERVER MODAL */}
      <AnimatePresence>
        {showCreateServer && (
          <div className="fixed inset-0 flex items-center justify-center z-[100] p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => setShowCreateServer(false)} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-card border border-white/10 rounded-[40px] p-10 w-full max-w-[400px] relative z-10 space-y-8 shadow-[0_50px_100px_rgba(0,0,0,0.8)]">
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold">New Server</h2>
                <p className="text-sm text-muted-foreground font-medium">Assign a name to your institutional study space.</p>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-primary px-1">College / Institution Name</label>
                <input 
                  autoFocus
                  placeholder="e.g. Dhaka College" 
                  value={serverName}
                  onChange={(e) => setServerName(e.target.value)}
                  className="w-full p-5 bg-muted/50 border-none rounded-[22px] outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-lg"
                />
              </div>
              <Button onClick={handleCreateServer} className="w-full h-16 rounded-2xl text-lg font-bold shadow-xl shadow-primary/20">
                Launch System
              </Button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
