import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-[900px] mx-auto px-4 py-16 space-y-12 text-foreground">
      <h1 className="font-serif text-5xl md:text-6xl mb-8">Contact</h1>
      
      <div className="space-y-6 text-lg leading-relaxed max-w-2xl">
        <p>
          The Sura Codex is a small operation. If you have a question, a collaboration idea, or just want to say something about what you read, write to:
        </p>
        <p className="text-xl">
          <a href="mailto:hello@suracodex.com" className="text-primary hover:underline font-medium">hello@suracodex.com</a>
        </p>
        <p className="text-sm text-muted-foreground italic">
          Please note that response times may be slow, but all messages are read with care.
        </p>
      </div>

      <div className="max-w-xl pt-8">
        {submitted ? (
          <div className="bg-card border border-border p-8 text-center space-y-4">
            <h3 className="font-serif text-2xl">Thank you</h3>
            <p className="text-muted-foreground">Your message has been received.</p>
            <Button variant="outline" onClick={() => setSubmitted(false)} className="mt-4">
              Send another message
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" required className="bg-background" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required className="bg-background" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" rows={5} required className="bg-background" />
            </div>
            <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
              Send Message
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
