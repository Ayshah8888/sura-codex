export default function Privacy() {
  return (
    <div className="max-w-[900px] mx-auto px-4 py-16 space-y-12 text-foreground">
      <h1 className="font-serif text-5xl md:text-6xl mb-4">Privacy Policy</h1>
      <p className="text-sm text-muted-foreground italic mb-12">Last updated: May 2026</p>
      
      <div className="space-y-10 text-lg leading-relaxed">
        <section className="space-y-4">
          <h2 className="font-serif text-3xl">Information We Collect</h2>
          <p>
            When you visit The Sura Codex, we collect basic information to help us understand how our platform is used. This includes general reading behavior and, if you choose to participate, comments submitted on essays or novels.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-serif text-3xl">How We Use It</h2>
          <p>
            The information we gather is used solely to improve our content and the technical performance of the site. We do not sell your personal data.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-serif text-3xl">Cookies</h2>
          <p>
            We use standard analytics and session cookies to maintain your logged-in state and understand aggregate traffic patterns.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-serif text-3xl">Third-Party Services</h2>
          <p>
            We may partner with third-party services, such as Google AdSense, to display relevant context-aware advertisements. These services may use their own cookies to serve ads based on your prior visits to this or other websites.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-serif text-3xl">Contact</h2>
          <p>
            For any questions regarding your privacy or this policy, please reach out to us at <a href="mailto:hello@suracodex.com" className="text-primary hover:underline">hello@suracodex.com</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
