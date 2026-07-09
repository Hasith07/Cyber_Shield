import { createFileRoute, Link, useNavigate, notFound } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { AlertTriangle, ShieldCheck, ShieldAlert, Mail, MessageSquare, Globe, Paperclip, ArrowLeft, ArrowRight, CheckCircle2, XCircle, Lock } from "lucide-react";
import { scenarios, type Scenario } from "@/lib/mock-data";
import { recordAttempt } from "@/lib/progress";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

export const Route = createFileRoute("/_auth/simulations/$id")({
  loader: ({ params }) => {
    const s = scenarios.find((x) => x.id === params.id);
    if (!s) throw notFound();
    return { scenario: s };
  },
  component: Player,
  notFoundComponent: () => (
    <div className="p-8 text-center">
      <div className="text-lg font-semibold">Scenario not found</div>
      <Link to="/simulations" className="text-primary hover:underline text-sm">Back to library</Link>
    </div>
  ),
});

function Player() {
  const { scenario } = Route.useLoaderData();
  const navigate = useNavigate();
  const [decision, setDecision] = useState<"phish" | "safe" | null>(null);
  const [warn, setWarn] = useState<string | null>(null);

  const nextId = useMemo(() => {
    const i = scenarios.findIndex((s) => s.id === scenario.id);
    return scenarios[(i + 1) % scenarios.length]?.id;
  }, [scenario.id]);

  function submit(choice: "phish" | "safe") {
    const correct = (choice === "phish") === scenario.isPhishing;
    setDecision(choice);
    // MOCK — no network. Only writes to localStorage.
    recordAttempt({ scenarioId: scenario.id, correct, points: correct ? scenario.points : 0, at: new Date().toISOString() });
    if (correct) toast.success(`Correct — +${scenario.points} pts`);
    else toast.error("Not quite — review the red flags");
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="ghost" size="sm" asChild><Link to="/simulations"><ArrowLeft /> Back to library</Link></Button>
        <Badge variant="outline" className="capitalize">{scenario.category === "url" ? "Website" : scenario.category}</Badge>
        <Badge variant="outline">{scenario.difficulty}</Badge>
        <span className="text-xs text-muted-foreground">+{scenario.points} pts</span>
      </div>

      {scenario.category === "email" && <EmailView s={scenario} onLink={(msg) => setWarn(msg)} />}
      {scenario.category === "sms" && <SmsView s={scenario} onLink={(msg) => setWarn(msg)} />}
      {scenario.category === "url" && <BrowserView s={scenario} onLink={(msg) => setWarn(msg)} />}

      {decision === null ? (
        <div className="rounded-xl border border-border bg-card p-4 flex flex-wrap gap-2 items-center justify-between">
          <div className="text-sm text-muted-foreground">Make a call: is this legitimate or a phishing attempt?</div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => submit("safe")}><ShieldCheck /> This is Safe</Button>
            <Button onClick={() => submit("phish")}><ShieldAlert /> Report Phishing</Button>
          </div>
        </div>
      ) : (
        <FeedbackCard scenario={scenario} decision={decision} />
      )}

      <div className="flex justify-between">
        <Button variant="ghost" asChild><Link to="/simulations"><ArrowLeft /> Back</Link></Button>
        {nextId && (
          <Button onClick={() => { setDecision(null); navigate({ to: "/simulations/$id", params: { id: nextId } }); }}>
            Next scenario <ArrowRight />
          </Button>
        )}
      </div>

      <Dialog open={!!warn} onOpenChange={(o) => !o && setWarn(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><AlertTriangle className="text-warning" /> Caught! Suspicious action blocked</DialogTitle>
            <DialogDescription>{warn}</DialogDescription>
          </DialogHeader>
          <div className="rounded-md bg-accent/60 p-3 text-sm">
            This is a training simulation — nothing is actually loaded, submitted, or sent. In real life, this is exactly the kind of interaction to avoid.
          </div>
          <DialogFooter>
            <Button onClick={() => setWarn(null)}>Got it</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function FeedbackCard({ scenario, decision }: { scenario: Scenario; decision: "phish" | "safe" }) {
  const correct = (decision === "phish") === scenario.isPhishing;
  return (
    <Card className={`border ${correct ? "border-success/40" : "border-danger/40"}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {correct ? <CheckCircle2 className="text-success" /> : <XCircle className="text-danger" />}
          {correct ? "Correct call" : "Missed one"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <p className="text-muted-foreground">
          This message was <b>{scenario.isPhishing ? "phishing" : "legitimate"}</b>.
        </p>
        {scenario.isPhishing ? (
          <div>
            <div className="font-medium mb-2">Red flags in this scenario:</div>
            <ul className="space-y-2">
              {scenario.redFlags.map((f) => (
                <li key={f.id} className="rounded-md bg-accent/50 p-3">
                  <div className="flex items-center gap-2 font-medium"><AlertTriangle className="size-4 text-warning" /> {f.label}</div>
                  <p className="text-muted-foreground mt-1">{f.explanation}</p>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="rounded-md bg-accent/50 p-3">
            <div className="flex items-center gap-2 font-medium"><ShieldCheck className="size-4 text-success" /> Why this is legitimate</div>
            <p className="text-muted-foreground mt-1">{scenario.legitReason}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Mock inbox chrome
function EmailView({ s, onLink }: { s: Scenario; onLink: (m: string) => void }) {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="px-4 py-3 border-b border-border flex items-center gap-2 bg-accent/40">
        <Mail className="size-4 text-primary" />
        <div className="text-sm font-medium">Inbox — Training Simulation</div>
        <span className="ml-auto text-xs text-muted-foreground">Simulated view · nothing is fetched</span>
      </div>
      <div className="p-4 sm:p-6 space-y-3">
        <div className="flex items-start gap-3">
          <div className="size-10 rounded-full bg-primary/20 grid place-items-center text-primary font-semibold">
            {s.sender?.name.slice(0, 1)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap gap-x-2 items-baseline">
              <span className="font-medium">{s.sender?.name}</span>
              <span className="text-xs text-muted-foreground break-all">&lt;{s.sender?.email}&gt;</span>
            </div>
            <div className="text-sm font-semibold mt-0.5">{s.subject}</div>
            <div className="text-xs text-muted-foreground">to: you@yourcompany.example</div>
          </div>
        </div>
        <div
          className="prose prose-sm dark:prose-invert max-w-none email-body"
          onClick={(e) => {
            const t = e.target as HTMLElement;
            const a = t.closest("a");
            if (a) {
              e.preventDefault();
              onLink(`The link would open: ${a.getAttribute("href") || "unknown"}. This is blocked in the simulator.`);
            }
          }}
          dangerouslySetInnerHTML={{ __html: s.bodyHtml || "" }}
        />
        {s.attachments && s.attachments.length > 0 && (
          <div className="pt-2 border-t border-border flex flex-wrap gap-2">
            {s.attachments.map((a) => (
              <button key={a.name} onClick={() => onLink(`Attachment "${a.name}" would open here. Blocked in the simulator.`)}
                className="inline-flex items-center gap-2 rounded-md border border-border bg-accent/40 px-3 py-1.5 text-xs hover:border-warning/60">
                <Paperclip className="size-3.5" /> {a.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SmsView({ s, onLink }: { s: Scenario; onLink: (m: string) => void }) {
  const parts = s.smsBody?.split(/(hxxps?:\/\/\S+)/g) ?? [];
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="px-4 py-3 border-b border-border flex items-center gap-2 bg-accent/40">
        <MessageSquare className="size-4 text-primary" />
        <div className="text-sm font-medium">Messages — Simulation</div>
      </div>
      <div className="p-4 sm:p-6">
        <div className="text-center text-xs text-muted-foreground mb-3">{s.smsFrom}</div>
        <div className="max-w-sm rounded-2xl rounded-bl-sm bg-accent p-3 text-sm">
          {parts.map((p, i) => p.startsWith("hxxp") ? (
            <button key={i} onClick={() => onLink(`The link ${p} would open here. Blocked in the simulator.`)} className="text-primary underline break-all">{p}</button>
          ) : <span key={i}>{p}</span>)}
        </div>
      </div>
    </div>
  );
}

function BrowserView({ s, onLink }: { s: Scenario; onLink: (m: string) => void }) {
  const isHttps = s.fakeUrl?.startsWith("https://");
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="px-3 py-2 border-b border-border bg-accent/40 flex items-center gap-2">
        <div className="flex gap-1">
          <span className="size-2.5 rounded-full bg-danger/70" />
          <span className="size-2.5 rounded-full bg-warning/70" />
          <span className="size-2.5 rounded-full bg-success/70" />
        </div>
        <div className="flex-1 min-w-0 mx-2 flex items-center gap-2 rounded-md bg-background px-2 py-1 text-xs">
          <Lock className={`size-3 ${isHttps ? "text-success" : "text-danger"}`} />
          <span className="truncate">{s.fakeUrl}</span>
        </div>
      </div>
      <div
        className="site-body"
        onClick={(e) => {
          const t = e.target as HTMLElement;
          const btn = t.closest("button[data-flag]") as HTMLElement | null;
          if (btn) {
            e.preventDefault();
            onLink("The form would submit your credentials here. Blocked in the simulator.");
          }
        }}
        dangerouslySetInnerHTML={{ __html: s.siteHtml || "" }}
      />
    </div>
  );
}
