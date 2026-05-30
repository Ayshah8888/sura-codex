import { Link } from "wouter";

export default function About() {
  return (
    <div className="max-w-[900px] mx-auto px-4 py-16 space-y-12 text-foreground">
      <h1 className="font-serif text-5xl md:text-6xl mb-8">About The Sura Codex</h1>
      
      <div className="space-y-6 text-lg leading-relaxed">
        <p>
          The Sura Codex is a digital sanctuary where code and literature meet. It is a space for programmer-writers, where technical precision meets literary depth.
        </p>
        <p>
          We believe that writing code and writing prose are not opposing disciplines, but parallel forms of creation. Both require an obsession with structure, an ear for rhythm, and a desire to build worlds from nothing but text.
        </p>
        <p>
          Here, you will find essays on technology written with literary care, serialized fiction that engages with the digital age, and a running account of our own construction as a form of transparency.
        </p>
      </div>

      <section className="space-y-6">
        <h2 className="font-serif text-3xl">What we publish</h2>
        <ul className="list-none space-y-3 text-lg">
          <li><strong className="font-medium text-primary">Tech Essays</strong> &mdash; Meditations on software, systems, and the culture of building.</li>
          <li><strong className="font-medium text-primary">Literary Fiction</strong> &mdash; Serialized novels and short stories exploring themes of the digital age.</li>
          <li><strong className="font-medium text-primary">Product Journey</strong> &mdash; A transparent account of building and maintaining this platform.</li>
        </ul>
      </section>

      <section className="space-y-6">
        <h2 className="font-serif text-3xl">Who is this for?</h2>
        <p className="text-lg leading-relaxed">
          For people who code and write. For those who find the two activities more similar than different, and who seek a place where both can coexist without compromise.
        </p>
      </section>

      <div className="pt-12 border-t border-border mt-16">
        <p className="text-lg italic text-muted-foreground">
          The Sura Codex is published from somewhere quiet. It is always in progress.
        </p>
      </div>
    </div>
  );
}
