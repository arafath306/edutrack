"use client";

import { motion } from "framer-motion";
import { Play, Flame, Clock, ThumbsUp, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

const categories = ["All", "Physics", "Chemistry", "Math", "Biology", "Computer Science", "Engineering"];

const videos = [
  { id: 1, title: "Understanding Quantum Mechanics", creator: "Dr. Physics", views: "1.2M", time: "12:45", thumbnail: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80" },
  { id: 2, title: "Organic Chemistry Basics", creator: "ChemMaster", views: "850K", time: "15:20", thumbnail: "https://images.unsplash.com/photo-1532187875605-2fe3587b1598?w=800&q=80" },
  { id: 3, title: "Calculus III Full Course", creator: "MathWiz", views: "2.5M", time: "45:00", thumbnail: "https://images.unsplash.com/photo-1509228468518-180dd482180c?w=800&q=80" },
  { id: 4, title: "The Future of AI in Education", creator: "TechEdu", views: "500K", time: "10:30", thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80" },
];

export default function VideoPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Play className="w-8 h-8 text-primary fill-primary" />
            EduTube
          </h1>
          <p className="text-muted-foreground text-sm">Learn from the best educators in the world</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
            <input 
              placeholder="Search lectures..." 
              className="w-full pl-10 pr-4 py-2 bg-muted rounded-full border-none focus:ring-2 focus:ring-primary outline-none transition-all"
            />
          </div>
          <Button variant="outline" size="icon" className="rounded-full">
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </header>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
        {categories.map((cat, i) => (
          <button
            key={cat}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${i === 0 ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Featured Shorts Row */}
      <section className="mb-12">
        <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
          <Flame className="w-5 h-5 text-orange-500" />
          EduShorts
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="aspect-[9/16] rounded-2xl bg-gradient-to-br from-slate-800 to-black relative overflow-hidden group cursor-pointer border border-white/5"
            >
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                <p className="text-xs font-bold line-clamp-2 text-white">Top 5 Physics Hacks for Students</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Main Video Grid */}
      <section>
        <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
          <Clock className="w-5 h-5 text-blue-500" />
          Recommended for you
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {videos.map((video, i) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="relative aspect-video rounded-2xl overflow-hidden mb-3 border border-border">
                <img src={video.thumbnail} alt={video.title} className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/80 rounded text-[10px] font-bold text-white">
                  {video.time}
                </div>
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                   <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white shadow-xl">
                      <Play className="w-6 h-6 fill-white" />
                   </div>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-muted flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-sm leading-tight mb-1 line-clamp-2 group-hover:text-primary transition-colors">{video.title}</h3>
                  <p className="text-xs text-muted-foreground font-medium mb-1">{video.creator}</p>
                  <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                    {video.views} views • 2 days ago
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
