import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] w-full flex flex-col items-center justify-center text-center px-4">
      <h1 className="font-serif text-8xl md:text-9xl text-foreground mb-6">404</h1>
      <p className="text-xl md:text-2xl text-muted-foreground mb-10 font-serif italic">
        This page doesn't exist — or hasn't been written yet.
      </p>
      <Link 
        href="/" 
        className="px-8 py-3 bg-primary text-primary-foreground font-medium transition-colors hover:bg-primary/90"
      >
        Return to the Home Page
      </Link>
    </div>
  );
}
