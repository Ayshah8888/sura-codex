import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="mt-20 py-16 text-sm text-muted-foreground">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center space-y-8">
        <p className="font-serif text-2xl text-foreground w-full text-left max-w-[900px]">The Sura Codex</p>
        
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 max-w-[900px] w-full text-foreground/80">
          <Link href="/essays" className="hover:text-primary transition-colors">Essays</Link>
          <span className="text-border">|</span>
          <Link href="/novels" className="hover:text-primary transition-colors">Novels</Link>
          <span className="text-border">|</span>
          <Link href="/archive" className="hover:text-primary transition-colors">Archive</Link>
          <span className="text-border">|</span>
          <Link href="/about" className="hover:text-primary transition-colors">About</Link>
          <span className="text-border">|</span>
          <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
          <span className="text-border">|</span>
          <Link href="/contact" className="hover:text-primary transition-colors">Contact</Link>
        </div>

        <div className="w-full max-w-[900px] h-px bg-border/50"></div>
        
        <p className="max-w-[900px] w-full text-left">© 2026 The Sura Codex. All rights reserved.</p>
      </div>
    </footer>
  );
}