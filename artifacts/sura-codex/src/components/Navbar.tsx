import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useAuth } from "@workspace/replit-auth-web";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Navbar() {
  const [location] = useLocation();
  const { user, isAuthenticated, login, logout } = useAuth();

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
          <Link href="/archive" className={cn("hover:text-primary transition-colors", location.startsWith("/archive") ? "text-primary font-medium" : "text-muted-foreground")}>
            Archive
          </Link>
          {user?.role === 'admin' && (
            <Link href="/admin" className={cn("hover:text-primary transition-colors", location.startsWith("/admin") ? "text-primary font-medium" : "text-muted-foreground")}>
              Admin
            </Link>
          )}
          
          <div className="flex items-center space-x-4 border-l border-border pl-6 ml-2">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8 border border-border">
                  {user?.profileImageUrl ? <AvatarImage src={user.profileImageUrl} /> : <AvatarFallback className="bg-[#C5A58A] text-white">{user?.firstName?.[0]}</AvatarFallback>}
                </Avatar>
                <Button variant="ghost" size="sm" onClick={() => logout()} className="text-muted-foreground hover:text-foreground">
                  Log out
                </Button>
              </div>
            ) : (
              <Button variant="outline" size="sm" onClick={() => login()} className="font-medium">
                Log in
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}