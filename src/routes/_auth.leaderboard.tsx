import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Trophy, Medal } from "lucide-react";
import { seedLeaderboard } from "@/lib/mock-data";
import { useAuth } from "@/lib/auth";
import { computeStats, readProgress } from "@/lib/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_auth/leaderboard")({ component: Leaderboard });

function Leaderboard() {
  const { session } = useAuth();
  const [entries, setEntries] = useState<{ name: string; score: number; badges: number; isYou?: boolean; color?: string }[]>([]);

  useEffect(() => {
    const p = readProgress();
    const stats = computeStats(p);
    const you = { name: session?.name ?? "You", score: stats.totalScore, badges: stats.badges.length, isYou: true, color: session?.avatarColor };
    const merged = [...seedLeaderboard, you].sort((a, b) => b.score - a.score);
    setEntries(merged);
  }, [session]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Trophy className="text-warning" />
        <h1 className="text-2xl font-semibold">Leaderboard</h1>
      </div>
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Rank</TableHead>
              <TableHead>Agent</TableHead>
              <TableHead className="text-right">Score</TableHead>
              <TableHead className="text-right">Badges</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.map((e, i) => {
              const initials = e.name.split(" ").map((s) => s[0]).slice(0, 2).join("").toUpperCase();
              return (
                <TableRow key={i} className={e.isYou ? "bg-primary/10" : ""}>
                  <TableCell className="font-medium">
                    <span className="inline-flex items-center gap-1">
                      {i < 3 && <Medal className={`size-4 ${i === 0 ? "text-warning" : i === 1 ? "text-muted-foreground" : "text-orange-400"}`} />}
                      #{i + 1}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-full grid place-items-center text-xs font-semibold text-black" style={{ background: e.color ?? "#22D3EE" }}>{initials}</div>
                      <span className="font-medium">{e.name}</span>
                      {e.isYou && <Badge>You</Badge>}
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-mono">{e.score}</TableCell>
                  <TableCell className="text-right">{e.badges}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
