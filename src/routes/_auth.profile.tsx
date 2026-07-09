import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Sun, Moon, LogOut, Trash2, User } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useTheme } from "@/lib/theme";
import { readProgress, resetProgress, updateSettings } from "@/lib/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const COLORS = ["#22D3EE", "#10B981", "#F59E0B", "#EF4444", "#A78BFA", "#F472B6"];

export const Route = createFileRoute("/_auth/profile")({ component: Profile });

function Profile() {
  const { session, update, logout } = useAuth();
  const [theme, setTheme] = useTheme();
  const navigate = useNavigate();
  const [name, setName] = useState(session?.name ?? "");
  const [settings, setSettings] = useState({ notifications: true, emailDigest: false, timedQuiz: true });

  useEffect(() => { setSettings(readProgress().settings); }, []);
  useEffect(() => { if (session) setName(session.name); }, [session]);

  if (!session) return null;

  function save() {
    update({ name: name.trim() || session!.name });
    toast.success("Profile updated");
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-2"><User className="text-primary" /><h1 className="text-2xl font-semibold">Profile & Settings</h1></div>

      <Card>
        <CardHeader><CardTitle>Identity</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="size-14 rounded-full grid place-items-center text-lg font-semibold text-black" style={{ background: session.avatarColor }}>
              {session.name.split(" ").map((s) => s[0]).slice(0, 2).join("").toUpperCase()}
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Signed in as</div>
              <div className="font-medium">{session.email}</div>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="name">Display name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <Label>Avatar color</Label>
            <div className="mt-2 flex gap-2">
              {COLORS.map((c) => (
                <button key={c} onClick={() => update({ avatarColor: c })} aria-label={`Pick ${c}`}
                  className={`size-8 rounded-full border-2 ${session.avatarColor === c ? "border-primary" : "border-transparent"}`}
                  style={{ background: c }} />
              ))}
            </div>
          </div>
          <Button onClick={save}>Save</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Appearance</CardTitle></CardHeader>
        <CardContent>
          <Button variant="outline" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            {theme === "dark" ? <Sun /> : <Moon />} Switch to {theme === "dark" ? "light" : "dark"} mode
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Notifications</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <ToggleRow id="notifications" label="In-app notifications" checked={settings.notifications} onChange={(v) => { setSettings({ ...settings, notifications: v }); updateSettings({ notifications: v }); }} />
          <ToggleRow id="digest" label="Weekly email digest (simulated)" checked={settings.emailDigest} onChange={(v) => { setSettings({ ...settings, emailDigest: v }); updateSettings({ emailDigest: v }); }} />
          <p className="text-xs text-muted-foreground">These toggles are UI-only in this prototype — no notifications are actually sent.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Account</CardTitle></CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline"><Trash2 /> Reset progress</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Reset all training progress?</AlertDialogTitle>
                <AlertDialogDescription>This clears your scores, streaks, badges, and completed scenarios from this browser. Your account stays signed in.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => { resetProgress(); toast.success("Progress reset"); }}>Reset</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button variant="destructive" onClick={() => { logout(); navigate({ to: "/" }); toast("Signed out"); }}><LogOut /> Log out</Button>
        </CardContent>
      </Card>
    </div>
  );
}

function ToggleRow({ id, label, checked, onChange }: { id: string; label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between">
      <Label htmlFor={id} className="text-sm">{label}</Label>
      <Switch id={id} checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
