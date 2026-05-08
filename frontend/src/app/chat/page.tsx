"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Hash, Search, Send, Plus, Settings, Users, Phone, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/lib/supabase/auth-provider";

export default function ChatPage() {
  const supabase = createClient();
  const { user } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;

    fetchMessages();

    const channel = supabase
      .channel("realtime-messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        async (payload) => {
          const { data } = await supabase
            .from("messages")
            .select("*, profiles(name)")
            .eq("id", payload.new.id)
            .single();
          
          if (data) {
            setMessages((prev) => {
              // Avoid duplicate messages
              if (prev.find(m => m.id === data.id)) return prev;
              return [...prev, data];
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    const { data } = await supabase
      .from("messages")
      .select("*, profiles(name)")
      .order("created_at", { ascending: true });
    
    setMessages(data || []);
    setLoading(false);
  };


  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    const messageContent = newMessage;
    setNewMessage("");

    const { error } = await supabase.from("messages").insert({
      content: messageContent,
      sender_id: user.id,
      // In this demo, we assume a single general chat or chatId
    });

    if (error) console.error("Error sending message:", error);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden bg-background">
      {/* Channels Sidebar - Desktop */}
      <div className="hidden md:flex w-64 flex-col bg-muted/30 border-r border-border">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h2 className="font-bold flex items-center gap-2">
            <Users className="w-5 h-5" />
            Study Groups
          </h2>
          <Plus className="w-4 h-4 cursor-pointer hover:text-primary transition-colors" />
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {["general", "physics-help", "math-club", "announcements"].map((channel) => (
            <div
              key={channel}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors ${channel === 'general' ? 'bg-primary/10 text-primary' : 'hover:bg-muted text-muted-foreground'}`}
            >
              <Hash className="w-4 h-4" />
              <span className="text-sm font-medium">{channel}</span>
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-border bg-card/50 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
            {user?.email?.[0].toUpperCase() || "U"}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-xs font-bold truncate">{user?.email}</p>
            <p className="text-[10px] text-green-500">Online</p>
          </div>
          <Settings className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-foreground transition-colors" />
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-background relative">
        <header className="h-14 border-b border-border flex items-center justify-between px-4 z-10 bg-background/80 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <Hash className="w-5 h-5 text-muted-foreground" />
            <h3 className="font-bold">general</h3>
            <div className="w-2 h-2 rounded-full bg-green-500 ml-2" />
            <span className="text-xs text-muted-foreground font-medium">128 active</span>
          </div>
          <div className="flex items-center gap-4 text-muted-foreground">
            <Phone className="w-4 h-4 cursor-pointer hover:text-primary transition-colors" />
            <Video className="w-4 h-4 cursor-pointer hover:text-primary transition-colors" />
            <div className="h-4 w-[1px] bg-border mx-1" />
            <div className="relative hidden sm:block">
              <Search className="absolute left-2 top-1.5 w-3 h-3" />
              <input 
                placeholder="Search" 
                className="bg-muted text-xs pl-7 pr-3 py-1.5 rounded-md w-32 outline-none focus:w-48 transition-all"
              />
            </div>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {loading ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">Loading messages...</div>
          ) : messages.length > 0 ? (
            messages.map((msg, i) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex gap-4 group"
              >
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-primary/20">
                  {msg.profiles?.name?.[0]?.toUpperCase() || "U"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-sm hover:underline cursor-pointer">{msg.profiles?.name || "Anonymous"}</span>
                    <span className="text-[10px] text-muted-foreground">{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div className="text-sm text-foreground/90 leading-relaxed bg-muted/30 p-3 rounded-2xl rounded-tl-none border border-border/50 inline-block max-w-[85%]">
                    {msg.content}
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground space-y-2">
              <p>No messages yet.</p>
              <p className="text-xs italic text-center px-8">Be the first one to say something in the general channel!</p>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="p-4 bg-background">
          <form 
            onSubmit={handleSendMessage}
            className="bg-muted/50 border border-border rounded-2xl flex items-center p-2 gap-2 focus-within:ring-2 focus-within:ring-primary/30 transition-all"
          >
            <div className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center cursor-pointer hover:bg-muted-foreground/10">
              <Plus className="w-4 h-4" />
            </div>
            <input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Message #general"
              className="flex-1 bg-transparent border-none outline-none text-sm px-2 py-2"
            />
            <Button 
              type="submit" 
              size="icon" 
              className="rounded-xl h-8 w-8"
              disabled={!newMessage.trim()}
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
          <p className="text-[10px] text-muted-foreground mt-2 px-2">
            Press Enter to send. Use / for commands.
          </p>
        </div>
      </div>
    </div>
  );
}
