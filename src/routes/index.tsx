import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldCheck, Mail, MessageSquare, Globe, LockKeyhole, CircuitBoard, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/")({ component: Landing });

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="relative overflow-hidden cyber-grid">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full blur-3xl opacity-30" style={{ background: "radial-gradient(circle, oklch(0.82 0.15 210), transparent 60%)" }} />
        <div className="absolute -bottom-32 -right-24 w-96 h-96 rounded-full blur-3xl opacity-20" style={{ background: "radial-gradient(circle, oklch(0.72 0.17 160), transparent 60%)" }} />

        <header className="relative z-10 max-w-6xl mx-auto flex items-center justify-between p-4 sm:p-6">
          <Link to="/" className="flex items-center gap-2">
            <ShieldCheck className="text-primary" />
            <span className="font-display font-semibold">Cyber Command</span>
          </Link>
          <nav className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild><Link to="/login">Login</Link></Button>
            <Button size="sm" asChild><Link to="/signup">Sign up</Link></Button>
          </nav>
        </header>

        <section className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs text-muted-foreground">
            <Sparkles className="size-3 text-primary" /> 100% Safe Simulation · No Real Data Collected
          </div>
          <h1 className="mt-6 text-4xl sm:text-6xl font-bold tracking-tight">
            Train your instinct to catch <span className="text-gradient-cyber">phishing</span>.
          </h1>
          <p className="mt-5 max-w-2xl mx-auto text-muted-foreground">
            The Phishing Awareness Simulator drills you against realistic — but fully mocked — emails, texts, and fake sign-in pages. Learn the red flags before an attacker uses them on you.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            <Button size="lg" className="glow-primary" asChild>
              <Link to="/signup">Start Training <ArrowRight /></Link>
            </Button>
            <Button size="lg" variant="outline" asChild><Link to="/login">I already have an account</Link></Button>
          </div>
        </section>
      </div>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <h2 className="text-2xl font-semibold text-center">How it works</h2>
        <p className="mt-2 text-center text-muted-foreground">Three steps. Nothing leaves your browser.</p>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            { icon: CircuitBoard, title: "1. Enter the simulator", body: "Sign in with any email — the whole app runs client-side. Your progress lives in your browser." },
            { icon: Mail, title: "2. Face realistic scenarios", body: "Inspect emails, SMS, and fake sign-in pages built from safe, fictional brands like NovaBank and Cloudify." },
            { icon: ShieldCheck, title: "3. Learn every red flag", body: "Get instant feedback on every scenario, plus quizzes and a learning library to lock it in." },
          ].map(({ icon: Icon, title, body }) => (
            <Card key={title} className="bg-card/60 backdrop-blur border-border hover:glow-primary transition-shadow">
              <CardContent className="p-6">
                <Icon className="text-primary" />
                <div className="mt-3 font-semibold">{title}</div>
                <p className="mt-2 text-sm text-muted-foreground">{body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: LockKeyhole, label: "100% Safe Simulation" },
            { icon: ShieldCheck, label: "No Real Data Collected" },
            { icon: Globe, label: "Runs Entirely In-Browser" },
            { icon: MessageSquare, label: "Instant Feedback" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-3 rounded-lg border border-border bg-card/40 p-4">
              <div className="size-9 rounded-md grid place-items-center bg-primary/10 text-primary"><Icon className="size-4" /></div>
              <span className="text-sm font-medium">{label}</span>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-border py-8 text-center text-xs text-muted-foreground">
        Training prototype · All scenarios are fictional · No emails are sent, no credentials are captured.
      </footer>
    </div>
  );
}
