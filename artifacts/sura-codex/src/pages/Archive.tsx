import React, { useState } from "react";
import { useListArchive } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { MessageSquare, Heart } from "lucide-react";

export default function Archive() {
  const [type, setType] = useState<"essay" | "novel" | "">("");
  const [category, setCategory] = useState("");
  const [q, setQ] = useState("");

  const { data: items, isLoading } = useListArchive({ 
    type: type || undefined, 
    category: category || undefined, 
    q: q || undefined 
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col md:flex-row gap-8">
      <aside className="w-full md:w-64 shrink-0 space-y-8">
        <div>
          <h3 className="font-serif text-xl mb-4">Search</h3>
          <Input 
            placeholder="Search archive..." 
            value={q} 
            onChange={e => setQ(e.target.value)}
            className="bg-card"
          />
        </div>
        
        <div>
          <h3 className="font-serif text-xl mb-4">Type</h3>
          <div className="space-y-2">
            {[
              { label: "All Types", value: "" },
              { label: "Essays", value: "essay" },
              { label: "Novels", value: "novel" }
            ].map(opt => (
              <button
                key={opt.value}
                onClick={() => setType(opt.value as any)}
                className={`block w-full text-left px-3 py-2 rounded text-sm transition-colors ${type === opt.value ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-muted-foreground'}`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-serif text-xl mb-4">Category</h3>
          <div className="space-y-2">
            {["", "Tech", "Writing", "Journey", "Fantasy", "Sci-Fi"].map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`block w-full text-left px-3 py-2 rounded text-sm transition-colors ${category === cat ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-muted-foreground'}`}
              >
                {cat || "All Categories"}
              </button>
            ))}
          </div>
        </div>
      </aside>

      <main className="flex-1">
        <h1 className="font-serif text-4xl mb-8">Archive</h1>
        
        {isLoading ? (
          <div className="space-y-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-card animate-pulse border border-border/50" />
            ))}
          </div>
        ) : items?.length ? (
          <div className="space-y-6">
            {items.map(item => (
              <Link key={`${item.type}-${item.id}`} href={`/${item.type}s/${item.id}`}>
                <div className="block p-6 bg-card hover:border-primary/50 transition-colors border border-border/50 shadow-sm group">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge variant="secondary" className="bg-[#e5d0be] text-[#5c4a3d] font-normal border-none">
                      {item.type}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {item.publishedAt && format(new Date(item.publishedAt), "MMM d, yyyy")}
                    </span>
                    {item.category && (
                      <>
                        <span className="text-sm text-muted-foreground">&bull;</span>
                        <span className="text-sm text-muted-foreground">{item.category}</span>
                      </>
                    )}
                  </div>
                  <h2 className="text-2xl font-serif mb-2 group-hover:text-primary transition-colors">{item.title}</h2>
                  <p className="text-muted-foreground mb-4 line-clamp-2">{item.excerpt}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><Heart className="w-4 h-4" /> {item.likeCount}</span>
                    <span className="flex items-center gap-1"><MessageSquare className="w-4 h-4" /> {item.commentCount}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-muted-foreground bg-card border border-border/50">
            No items found matching your criteria.
          </div>
        )}
      </main>
    </div>
  );
}