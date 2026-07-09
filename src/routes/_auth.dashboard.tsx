import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Mail, MessageSquare, Globe, ScrollText, Trophy, BookOpen, Flame, Award, Target } from "lucide-react";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from "recharts";
import { useAuth } from "@/lib/auth";
import { computeStats, readProgress, type Progress } from "@/lib/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/_auth/dashboard")({ component: Dashboard });

function Dashboard() {
  const { session } = useAuth();
  const [progress, setProgress] = useState<Progress | null>(null);

  useEffect(() => {
    setProgress(readProgress());
    const on = () => setProgress(readProgress());
    window.addEventListener("pas:progress-updated", on);
    return () => window.removeEventListener("pas:progress-updated", on);
  }, []);

  const stats = useMemo(() => (progress ? computeStats(progress) : null), [progress]);

  if (!progress || !stats) {
    return <div className="space-y-4"><Skeleton className="h-24" /><Skeleton className="h-40" /><Skeleton className="h-40" /></div>;
  }

  const radar = [
    { cat: "Email", value: pct(stats.byCategory.email) },
    { cat: "SMS", value: pct(stats.byCategory.sms) },
    { cat: "URL", value: pct(stats.byCategory.url) },
    { cat: "Social", value: pct(stats.byCategory.social) },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-card cyber-grid p-6">
        <div className="text-sm text-muted-foreground">Welcome back</div>
        <h1 className="text-2xl sm:text-3xl font-semibold mt-1">{session?.name}</h1>
        <div className="mt-4 flex flex-wrap gap-6">
          <Metric icon={<Target className="text-primary" />} label="Awareness score" value={stats.totalScore} />
          <Metric icon={<Award className="text-warning" />} label="Simulations passed" value={`${stats.passed}/${stats.totalScenarios}`} />
          <Metric icon={<Flame className="text-danger" />} label="Current streak" value={stats.streak} />
          <Metric icon={<ScrollText className="text-success" />} label="Quizzes taken" value={progress.quizResults.length} />
        </div>
        {stats.badges.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {stats.badges.map((b) => <Badge key={b} variant="secondary">{b}</Badge>)}
          </div>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <TileLink to="/simulations" title="Email Simulations" desc="Spot phishing in an inbox" icon={<Mail />} accent="text-primary" />
        <TileLink to="/simulations" title="SMS / Smishing" desc="Judge suspicious texts" icon={<MessageSquare />} accent="text-warning" />
        <TileLink to="/simulations" title="Website / URL" desc="Detect fake sign-in pages" icon={<Globe />} accent="text-success" />
        <TileLink to="/quiz" title="Quiz Center" desc="Test your knowledge" icon={<ScrollText />} accent="text-primary" />
        <TileLink to="/leaderboard" title="Leaderboard" desc="See top performers" icon={<Trophy />} accent="text-warning" />
        <TileLink to="/library" title="Learning Library" desc="Read the fundamentals" icon={<BookOpen />} accent="text-success" />
      </div>

      <Card>
        <CardHeader><CardTitle>Performance by category</CardTitle></CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radar}>
                <PolarGrid stroke="oklch(1 0 0 / 0.12)" />
                <PolarAngleAxis dataKey="cat" tick={{ fill: "oklch(0.72 0.03 250)", fontSize: 12 }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar dataKey="value" stroke="oklch(0.82 0.15 210)" fill="oklch(0.82 0.15 210)" fillOpacity={0.35} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          {stats.completed === 0 && (
            <p className="text-sm text-muted-foreground text-center">No scenarios completed yet — <Link to="/simulations" className="text-primary hover:underline">start your first simulation</Link>.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function pct(x: { correct: number; total: number }) {
  return x.total === 0 ? 0 : Math.round((x.correct / x.total) * 100);
}

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <div className="size-10 rounded-md bg-accent/60 grid place-items-center">{icon}</div>
      <div>
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="text-lg font-semibold">{value}</div>
      </div>
    </div>
  );
}

function TileLink({ to, title, desc, icon, accent }: { to: string; title: string; desc: string; icon: React.ReactNode; accent: string }) {
  return (
    <Link to={to as any} className="group rounded-xl border border-border bg-card p-5 hover:border-primary/50 hover:glow-primary transition-all">
      <div className={`size-9 rounded-md grid place-items-center bg-accent/60 ${accent}`}>{icon}</div>
      <div className="mt-3 font-semibold">{title}</div>
      <div className="text-sm text-muted-foreground">{desc}</div>
    </Link>
  );
}
