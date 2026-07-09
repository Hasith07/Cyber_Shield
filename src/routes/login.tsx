import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { ShieldCheck, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

const schema = z.object({
  email: z.string().trim().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const Route = createFileRoute("/login")({ component: LoginPage });

function LoginPage() {
  const { login, loginDemo } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse({ email, password });
    if (!parsed.success) {
      const f = parsed.error.flatten().fieldErrors;
      setErrors({ email: f.email?.[0], password: f.password?.[0] });
      return;
    }
    setErrors({});
    setLoading(true);
    // MOCK login — accepts any credentials, no network calls.
    await new Promise((r) => setTimeout(r, 400));
    login(email);
    toast.success("Welcome back");
    setTimeout(() => navigate({ to: "/dashboard" }), 0);
  }

  function demo() {
    loginDemo();
    toast.success("Signed in as Demo Agent");
    setTimeout(() => navigate({ to: "/dashboard" }), 0);
  }

  return <AuthCard title="Sign in to Cyber Command" subtitle="Any email works — this is a training sandbox.">
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={!!errors.email} />
        {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
      </div>
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <button type="button" onClick={() => toast("Demo mode — password reset disabled")} className="text-xs text-primary hover:underline">Forgot password?</button>
        </div>
        <Input id="password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} aria-invalid={!!errors.password} />
        {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? <><Loader2 className="animate-spin" /> Signing in…</> : "Sign in"}
      </Button>
      <Button type="button" variant="outline" className="w-full" onClick={demo}>Continue as Demo Agent</Button>
      <p className="text-center text-xs text-muted-foreground">
        No account? <Link to="/signup" className="text-primary hover:underline">Create one</Link>
      </p>
    </form>
  </AuthCard>;
}

export function AuthCard({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid place-items-center bg-background cyber-grid p-4">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center gap-2 justify-center mb-6">
          <ShieldCheck className="text-primary" />
          <span className="font-display font-semibold">Cyber Command</span>
        </Link>
        <Card className="bg-card/80 backdrop-blur border-border">
          <CardContent className="p-6">
            <h1 className="text-xl font-semibold">{title}</h1>
            <p className="text-sm text-muted-foreground mt-1 mb-5">{subtitle}</p>
            {children}
          </CardContent>
        </Card>
        <p className="mt-4 text-center text-xs text-muted-foreground">Prototype only · No real authentication</p>
      </div>
    </div>
  );
}
