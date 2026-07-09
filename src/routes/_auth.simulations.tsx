import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Mail, MessageSquare, Globe, CheckCircle2, Circle } from "lucide-react";
import { scenarios, type Category, type Difficulty } from "@/lib/mock-data";
import { readProgress, type Progress } from "@/lib/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_auth/simulations")({ component: Simulations });

const CATS: { id: "all" | Category; label: string }[] = [
  { id: "all", label: "All" }, { id: "email", label: "Email" }, { id: "sms", label: "SMS" }, { id: "url", label: "Website / URL" },
];
const DIFFS: ("all" | Difficulty)[] = ["all", "Beginner", "Intermediate", "Advanced"];

function Simulations() {
  const [cat, setCat] = useState<(typeof CATS)[number]["id"]>("all");
  const [diff, setDiff] = useState<(typeof DIFFS)[number]>("all");
  const [progress, setProgress] = useState<Progress | null>(null);

  useEffect(() => {
    setProgress(readProgress());
    const on = () => setProgress(readProgress());
    window.addEventListener("pas:progress-updated", on);
    return () => window.removeEventListener("pas:progress-updated", on);
  }, []);

  const list = useMemo(() => scenarios.filter((s) =>
    (cat === "all" || s.category === cat) && (diff === "all" || s.difficulty === diff)
  ), [cat, diff]);

  const attemptedMap = new Map((progress?.attempts ?? []).map((a) => [a.scenarioId, a]));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Simulation Library</h1>
        <p className="text-sm text-muted-foreground">Mixed legitimate and phishing scenarios. All content is fictional and safe.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {CATS.map((c) => (
          <Button key={c.id} size="sm" variant={cat === c.id ? "default" : "outline"} onClick={() => setCat(c.id)}>{c.label}</Button>
        ))}
        <span className="w-px bg-border mx-1" />
        {DIFFS.map((d) => (
          <Button key={d} size="sm" variant={diff === d ? "default" : "outline"} onClick={() => setDiff(d)}>{d === "all" ? "All levels" : d}</Button>
        ))}
      </div>

      {list.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-10 text-center text-muted-foreground">No scenarios match your filters.</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((s) => {
            const Icon = s.category === "email" ? Mail : s.category === "sms" ? MessageSquare : Globe;
            const attempt = attemptedMap.get(s.id);
            return (
              <Link key={s.id} to="/simulations/$id" params={{ id: s.id }}
                className="group rounded-xl border border-border bg-card p-5 hover:border-primary/50 hover:glow-primary transition-all">
                <div className="flex items-center justify-between">
                  <div className="size-9 rounded-md bg-accent/60 grid place-items-center text-primary"><Icon className="size-4" /></div>
                  {attempt ? (
                    <span className={`text-xs inline-flex items-center gap-1 ${attempt.correct ? "text-success" : "text-danger"}`}>
                      <CheckCircle2 className="size-3.5" /> {attempt.correct ? "Passed" : "Missed"}
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground inline-flex items-center gap-1"><Circle className="size-3.5" /> New</span>
                  )}
                </div>
                <div className="mt-3 font-semibold">{s.title}</div>
                <div className="mt-1 text-xs text-muted-foreground capitalize">{s.category === "url" ? "Website" : s.category} · +{s.points} pts</div>
                <div className="mt-3 flex gap-2">
                  <Badge variant="outline">{s.difficulty}</Badge>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
