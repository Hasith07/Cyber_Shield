import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";
import { AuthGuard } from "@/components/app/AuthGuard";

export const Route = createFileRoute("/_auth")({ component: AuthLayout });

function AuthLayout() {
  return (
    <AuthGuard>
      <AppShell><Outlet /></AppShell>
    </AuthGuard>
  );
}
