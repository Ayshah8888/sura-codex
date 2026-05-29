export default function Footer() {
  return (
    <footer className="border-t border-border mt-20 py-10 text-center text-sm text-muted-foreground">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center space-y-4">
        <p className="font-serif text-lg text-foreground">The Sura Codex</p>
        <p>© {new Date().getFullYear()} All rights reserved. A sanctuary where code and literature meet.</p>
      </div>
    </footer>
  );
}