import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [location] = useLocation();

  return (
    <nav className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-border/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="font-serif text-2xl tracking-wide text-foreground hover:text-primary transition-colors">
          The Sura Codex
        </Link>
        <div className="flex items-center space-x-6 text-sm">
          <Link href="/essays" className={cn("hover:text-primary transition-colors", location.startsWith("/essays") ? "text-primary font-medium" : "text-muted-foreground")}>
            Essays
          </Link>
          <Link href="/novels" className={cn("hover:text-primary transition-colors", location.startsWith("/novels") ? "text-primary font-medium" : "text-muted-foreground")}>
            Novels
          </Link>
          <Link href="/admin" className={cn("hover:text-primary transition-colors", location.startsWith("/admin") ? "text-primary font-medium" : "text-muted-foreground")}>
            Admin
          </Link>
        </div>
      </div>
    </nav>
  );
}