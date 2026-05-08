"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import {
  Users, VideoIcon, ShieldCheck, TrendingUp, AlertTriangle,
  RefreshCcw, Ban, CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";

type Profile = {
  id: string;
  name: string;
  email: string;
  role: string;
  level: number;
  xp: number;
  created_at: string;
};

const stats = [
  { label: "Total Users", icon: Users, color: "text-blue-500", bg: "bg-blue-500/10", key: "users" },
  { label: "Active Today", icon: TrendingUp, color: "text-green-500", bg: "bg-green-500/10", key: "active" },
  { label: "Videos", icon: VideoIcon, color: "text-purple-500", bg: "bg-purple-500/10", key: "videos" },
  { label: "Reports", icon: AlertTriangle, color: "text-red-500", bg: "bg-red-500/10", key: "reports" },
];

export default function AdminPage() {
  const supabase = createClient();
  const router = useRouter();
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("users");

  useEffect(() => {
    checkAdmin();
    fetchUsers();
  }, []);

  const checkAdmin = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "ADMIN") {
      router.push("/dashboard");
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });
    setUsers(data ?? []);
    setLoading(false);
  };

  const updateRole = async (id: string, role: string) => {
    await supabase.from("profiles").update({ role }).eq("id", id);
    fetchUsers();
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <ShieldCheck className="w-8 h-8 text-primary" />
            Admin Panel
          </h1>
          <p className="text-muted-foreground">EduTrack enterprise management dashboard</p>
        </div>
        <Button onClick={fetchUsers} variant="outline" className="rounded-xl gap-2">
          <RefreshCcw className="w-4 h-4" /> Refresh
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-5 rounded-2xl border border-border bg-card"
          >
            <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
              <s.icon className={`w-5 h-5 ${s.color}`} />
            </div>
            <p className="text-2xl font-bold">{s.key === "users" ? users.length : "—"}</p>
            <p className="text-sm text-muted-foreground">{s.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="flex gap-2 mb-6 bg-muted p-1 rounded-xl w-fit">
        {["users", "reports", "settings"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${tab === t ? "bg-card shadow text-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "users" && (
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h2 className="font-bold">All Users ({users.length})</h2>
          </div>
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-8 text-center text-muted-foreground">Loading users...</div>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold">User</th>
                    <th className="text-left px-4 py-3 font-semibold">Role</th>
                    <th className="text-left px-4 py-3 font-semibold">Level</th>
                    <th className="text-left px-4 py-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                            {(user.name || user.email || "U")[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium">{user.name || "Unknown"}</p>
                            <p className="text-muted-foreground text-xs">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          defaultValue={user.role}
                          onChange={(e) => updateRole(user.id, e.target.value)}
                          className="bg-muted px-2 py-1 rounded-lg text-xs outline-none border-none"
                        >
                          <option value="STUDENT">Student</option>
                          <option value="TEACHER">Teacher</option>
                          <option value="CREATOR">Creator</option>
                          <option value="ADMIN">Admin</option>
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-bold">Lv. {user.level ?? 1}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-500">
                            <Ban className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
