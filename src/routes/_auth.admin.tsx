import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ShieldCheck, Send, Plus } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { scenarios } from "@/lib/mock-data";
import { readProgress, addCustomScenario, type Progress } from "@/lib/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export const Route = createFileRoute("/_auth/admin")({ component: Admin });

function Admin() {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [progress, setProgress] = useState<Progress | null>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<"email" | "sms" | "url">("email");
  const [difficulty, setDifficulty] = useState<"Beginner" | "Intermediate" | "Advanced">("Beginner");
  const [isPhishing, setIsPhishing] = useState(true);

  useEffect(() => {
    if (session && session.role !== "admin") {
      toast.error("Admin access required");
      navigate({ to: "/dashboard" });
      return;
    }
    setProgress(readProgress());
    const on = () => setProgress(readProgress());
    window.addEventListener("pas:progress-updated", on);
    return () => window.removeEventListener("pas:progress-updated", on);
  }, [session, navigate]);

  if (!session || session.role !== "admin") return null;

  function addScenario(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) { toast.error("Title required"); return; }
    // MOCK — stores to localStorage only. No backend, no send.
    addCustomScenario({ id: `custom-${Date.now()}`, title: title.trim(), category, difficulty, isPhishing });
    toast.success("Scenario added to local library");
    setTitle("");
  }

  // MOCK aggregate stats — deterministic pseudo values so the table looks alive.
  function statsFor(id: string) {
    const seed = Array.from(id).reduce((a, c) => a + c.charCodeAt(0), 0);
    const total = 40 + (seed % 200);
    const pass = Math.max(5, Math.min(total - 5, Math.round(total * (0.35 + ((seed % 40) / 100)))));
    return { total, pass, fail: total - pass };
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <ShieldCheck className="text-primary" />
        <h1 className="text-2xl font-semibold">Admin</h1>
        <Badge variant="secondary">Restricted</Badge>
      </div>

      <Card>
        <CardHeader><CardTitle>Scenarios — aggregate performance</CardTitle></CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead><TableHead>Category</TableHead><TableHead>Difficulty</TableHead>
                <TableHead className="text-right">Attempts</TableHead>
                <TableHead className="text-right">Pass rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scenarios.map((s) => {
                const st = statsFor(s.id);
                const rate = Math.round((st.pass / st.total) * 100);
                return (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium">{s.title}</TableCell>
                    <TableCell className="capitalize">{s.category === "url" ? "Website" : s.category}</TableCell>
                    <TableCell>{s.difficulty}</TableCell>
                    <TableCell className="text-right font-mono">{st.total}</TableCell>
                    <TableCell className={`text-right font-mono ${rate >= 70 ? "text-success" : rate >= 45 ? "text-warning" : "text-danger"}`}>{rate}%</TableCell>
                  </TableRow>
                );
              })}
              {progress?.customScenarios.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium">{s.title} <Badge variant="outline" className="ml-1">custom</Badge></TableCell>
                  <TableCell className="capitalize">{s.category}</TableCell>
                  <TableCell>{s.difficulty}</TableCell>
                  <TableCell className="text-right text-muted-foreground">—</TableCell>
                  <TableCell className="text-right text-muted-foreground">—</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Add mock scenario</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={addScenario} className="space-y-3">
              <div className="space-y-1.5"><Label htmlFor="title">Title</Label><Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. NovaBank OTP reset" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Category</Label>
                  <Select value={category} onValueChange={(v) => setCategory(v as any)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="email">Email</SelectItem><SelectItem value="sms">SMS</SelectItem><SelectItem value="url">Website</SelectItem></SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Difficulty</Label>
                  <Select value={difficulty} onValueChange={(v) => setDifficulty(v as any)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="Beginner">Beginner</SelectItem><SelectItem value="Intermediate">Intermediate</SelectItem><SelectItem value="Advanced">Advanced</SelectItem></SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-md border border-border p-3">
                <Label htmlFor="phish" className="text-sm">Mark as phishing</Label>
                <Switch id="phish" checked={isPhishing} onCheckedChange={setIsPhishing} />
              </div>
              <Button type="submit" disabled={!title.trim()}><Plus /> Add scenario</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Send className="text-warning" /> Send Test Campaign</CardTitle></CardHeader>
          <CardContent>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="inline-block">
                    <Button disabled variant="outline" className="opacity-60 cursor-not-allowed">
                      <Send /> Send test campaign
                    </Button>
                  </span>
                </TooltipTrigger>
                <TooltipContent className="max-w-sm text-xs">
                  Backend integration point — in production this would connect to a dedicated authorized-phishing-simulation service (e.g. GoPhish) or a transactional email API (e.g. Resend/SendGrid) with proper consent, sender authentication, and abuse controls. Not wired up in this prototype.
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <p className="mt-3 text-xs text-muted-foreground">This button is intentionally disabled. Shown for architectural completeness only — nothing is ever sent from this app.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
