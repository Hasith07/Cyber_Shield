import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthCard } from "./login";

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name"),
  email: z.string().trim().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const Route = createFileRoute("/signup")({ component: SignupPage });

function SignupPage() {
  const { login, loginDemo } = useAuth();
  const navigate = useNavigate();
  const [values, setValues] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof typeof values, string>>>({});
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      const f = parsed.error.flatten().fieldErrors;
      setErrors({ name: f.name?.[0], email: f.email?.[0], password: f.password?.[0] });
      return;
    }
    setErrors({});
    setLoading(true);
    // MOCK signup — no network, just persist a session.
    await new Promise((r) => setTimeout(r, 500));
    login(values.email, values.name);
    toast.success("Account created — welcome aboard");
    setTimeout(() => navigate({ to: "/dashboard" }), 0);
  }

  return <AuthCard title="Create your training account" subtitle="Everything is stored in your browser. Nothing is sent anywhere.">
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="space-y-1.5">
        <Label htmlFor="name">Full name</Label>
        <Input id="name" value={values.name} onChange={(e) => setValues({ ...values, name: e.target.value })} aria-invalid={!!errors.name} />
        {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" value={values.email} onChange={(e) => setValues({ ...values, email: e.target.value })} aria-invalid={!!errors.email} />
        {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
        <p className="text-[11px] text-muted-foreground">Tip: include "admin" in your email to see the admin view.</p>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" value={values.password} onChange={(e) => setValues({ ...values, password: e.target.value })} aria-invalid={!!errors.password} />
        {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? <><Loader2 className="animate-spin" /> Creating…</> : "Create account"}
      </Button>
      <Button type="button" variant="outline" className="w-full" onClick={() => { 
        loginDemo(); 
        toast.success("Signed in as Demo Agent");
        setTimeout(() => navigate({ to: "/dashboard" }), 0);
      }}>
        Skip — try demo account
      </Button>
      <p className="text-center text-xs text-muted-foreground">
        Already have one? <Link to="/login" className="text-primary hover:underline">Sign in</Link>
      </p>
    </form>
  </AuthCard>;
}
