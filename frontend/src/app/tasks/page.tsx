"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, Plus, Calendar, Filter, MoreVertical, 
  CheckCircle2, Clock, AlertCircle, Trash2, Edit2,
  ChevronDown, X, Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/supabase/auth-provider";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

// --- Categories ---
const categories = ["All", "Personal", "Group", "Teacher", "Completed"];

export default function TasksPage() {
  const { user } = useAuth();
  const supabase = createClient();
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    subject: "",
    category: "Personal",
    priority: "Medium",
    deadline: ""
  });

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user, activeTab]);

  const fetchTasks = async () => {
    let query = supabase.from("tasks").select("*").eq("user_id", user?.id);
    
    if (activeTab === "Completed") {
      query = query.eq("status", "Completed");
    } else if (activeTab !== "All") {
      query = query.eq("category", activeTab).neq("status", "Completed");
    } else {
      query = query.neq("status", "Completed");
    }

    const { data } = await query.order("deadline", { ascending: true });
    setTasks(data || []);
    setLoading(false);
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title) return;

    const { error } = await supabase.from("tasks").insert({
      ...newTask,
      user_id: user?.id,
      status: "Todo"
    });

    if (!error) {
      setShowCreateModal(false);
      setNewTask({ title: "", subject: "", category: "Personal", priority: "Medium", deadline: "" });
      fetchTasks();
    }
  };

  const toggleTaskStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "Completed" ? "Todo" : "Completed";
    const { error } = await supabase
      .from("tasks")
      .update({ status: newStatus })
      .eq("id", id);
    
    if (!error) fetchTasks();
  };

  const deleteTask = async (id: string) => {
    const { error } = await supabase.from("tasks").delete().eq("id", id);
    if (!error) fetchTasks();
  };

  return (
    <div className="min-h-screen bg-background pb-24 pt-4 px-4 space-y-6 max-w-lg mx-auto relative">
      {/* 1. TOP BAR */}
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="rounded-full bg-muted/50">
            <Calendar className="w-5 h-5" />
          </Button>
          <Button 
            onClick={() => setShowCreateModal(true)}
            className="rounded-full w-10 h-10 p-0 bg-primary shadow-lg shadow-primary/20"
          >
            <Plus className="w-6 h-6" />
          </Button>
        </div>
      </header>

      {/* 2. SEARCH & FILTER */}
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
        <input 
          placeholder="Search tasks..." 
          className="w-full pl-12 pr-4 py-3 bg-card border border-border rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-sm"
        />
      </div>

      {/* 3. CATEGORY TABS */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat)}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap border",
              activeTab === cat 
                ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" 
                : "bg-muted/50 text-muted-foreground border-transparent hover:bg-muted"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 4. TASK LIST */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Loading your workflow...</div>
        ) : tasks.length > 0 ? (
          tasks.map((task) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={task.id}
              className={cn(
                "group relative bg-card border border-border p-4 rounded-[24px] flex items-start gap-4 hover:border-primary/30 transition-all shadow-sm",
                task.status === "Completed" && "opacity-60"
              )}
            >
              <button 
                onClick={() => toggleTaskStatus(task.id, task.status)}
                className={cn(
                  "mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                  task.status === "Completed" 
                    ? "bg-primary border-primary text-white" 
                    : "border-muted-foreground/30 hover:border-primary"
                )}
              >
                {task.status === "Completed" && <Check className="w-4 h-4" />}
              </button>

              <div className="flex-1 space-y-1">
                <h3 className={cn("font-bold text-sm", task.status === "Completed" && "line-through text-muted-foreground")}>
                  {task.title}
                </h3>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{task.subject}</span>
                  <div className="flex items-center gap-1 text-[10px] font-bold text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded-full">
                    <Clock className="w-3 h-3" />
                    {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'Today'}
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 rounded-full hover:bg-red-500/10 hover:text-red-500 transition-colors"
                  onClick={() => deleteTask(task.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
                <div className={cn(
                  "text-[9px] font-bold px-2 py-0.5 rounded-md border uppercase",
                  task.priority === "High" ? "text-red-500 border-red-500/20 bg-red-500/5" : "text-blue-500 border-blue-500/20 bg-blue-500/5"
                )}>
                  {task.priority}
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground space-y-4">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 opacity-20" />
            </div>
            <p className="text-sm font-medium">All clear! No tasks in this view.</p>
          </div>
        )}
      </div>

      {/* 5. CREATE MODAL */}
      <AnimatePresence>
        {showCreateModal && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setShowCreateModal(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            />
            <motion.div 
              initial={{ y: "100%" }} 
              animate={{ y: 0 }} 
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 bg-card rounded-t-[40px] border-t border-border z-[70] p-8 space-y-6 shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">New Study Task</h2>
                <button onClick={() => setShowCreateModal(false)} className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateTask} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-1">Task Title</label>
                  <input 
                    autoFocus
                    placeholder="e.g. Physics Assignment" 
                    value={newTask.title}
                    onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                    className="w-full p-4 bg-muted border-none rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-1">Subject</label>
                    <input 
                      placeholder="e.g. Science" 
                      value={newTask.subject}
                      onChange={(e) => setNewTask({...newTask, subject: e.target.value})}
                      className="w-full p-4 bg-muted border-none rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-1">Category</label>
                    <select 
                      value={newTask.category}
                      onChange={(e) => setNewTask({...newTask, category: e.target.value})}
                      className="w-full p-4 bg-muted border-none rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium appearance-none"
                    >
                      <option>Personal</option>
                      <option>Group</option>
                      <option>Teacher</option>
                    </select>
                  </div>
                </div>

                <Button className="w-full h-14 rounded-2xl text-lg font-bold mt-4 shadow-xl shadow-primary/20">
                  Create Task
                </Button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
