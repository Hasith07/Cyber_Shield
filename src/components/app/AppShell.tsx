import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Mail, MessageSquare, Globe, BookOpen, Trophy, User, ShieldCheck, LogOut, Menu, Sun, Moon, ShieldAlert, ScrollText } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useTheme } from "@/lib/theme";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/simulations", label: "Simulations", icon: ShieldAlert },
  { to: "/quiz", label: "Quiz Center", icon: ScrollText },
  { to: "/library", label: "Learning Library", icon: BookOpen },
  { to: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { to: "/profile", label: "Profile", icon: User },
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  const { session, logout } = useAuth();
  const [theme, setTheme] = useTheme();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      {/* Sidebar (desktop) */}
      <aside className="hidden md:flex w-64 shrink-0 flex-col border-r border-border bg-sidebar">
        <div className="h-16 px-5 flex items-center gap-2 border-b border-border">
          <ShieldCheck className="text-primary" />
          <span className="font-display text-lg font-semibold">Cyber Command</span>
        </div>
        <NavList pathname={pathname} isAdmin={session?.role === "admin"} onNavigate={() => setOpen(false)} />
        <div className="mt-auto p-3 border-t border-border">
          <UserCard />
          <div className="mt-2 flex gap-1">
            <Button variant="ghost" size="sm" className="flex-1" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              {theme === "dark" ? <Sun /> : <Moon />}<span className="ml-1">{theme === "dark" ? "Light" : "Dark"}</span>
            </Button>
            <Button variant="ghost" size="sm" className="flex-1" onClick={logout} asChild>
              <Link to="/"><LogOut /><span className="ml-1">Sign out</span></Link>
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 inset-x-0 z-40 h-14 px-4 flex items-center justify-between border-b border-border bg-sidebar/95 backdrop-blur">
        <Link to="/dashboard" className="flex items-center gap-2">
          <ShieldCheck className="text-primary" />
          <span className="font-display font-semibold">Cyber Command</span>
        </Link>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Open menu"><Menu /></Button>
          </SheetTrigger>
          <SheetContent side="left" className="bg-sidebar p-0 w-72">
            <SheetHeader className="h-14 px-5 border-b border-border flex-row items-center">
              <SheetTitle className="flex items-center gap-2 text-left">
                <ShieldCheck className="text-primary" />Cyber Command
              </SheetTitle>
            </SheetHeader>
            <NavList pathname={pathname} isAdmin={session?.role === "admin"} onNavigate={() => setOpen(false)} />
            <div className="p-3 border-t border-border">
              <UserCard />
              <div className="mt-2 flex gap-1">
                <Button variant="ghost" size="sm" className="flex-1" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                  {theme === "dark" ? <Sun /> : <Moon />}<span className="ml-1">{theme === "dark" ? "Light" : "Dark"}</span>
                </Button>
                <Button variant="ghost" size="sm" className="flex-1" onClick={() => { logout(); setOpen(false); }} asChild>
                  <Link to="/"><LogOut /><span className="ml-1">Sign out</span></Link>
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <main className="flex-1 min-w-0 pt-14 md:pt-0">
        <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}

function NavList({ pathname, isAdmin, onNavigate }: { pathname: string; isAdmin: boolean; onNavigate: () => void }) {
  const items = [...NAV, ...(isAdmin ? [{ to: "/admin" as const, label: "Admin", icon: ShieldCheck }] : [])];
  return (
    <nav className="p-3 flex flex-col gap-1 overflow-y-auto">
      {items.map((it) => {
        const active = pathname === it.to || (it.to !== "/dashboard" && pathname.startsWith(it.to));
        const Icon = it.icon;
        return (
          <Link
            key={it.to}
            to={it.to}
            onClick={onNavigate}
            className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
              active ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
            }`}
          >
            <Icon className="size-4" />{it.label}
          </Link>
        );
      })}
    </nav>
  );
}

function UserCard() {
  const { session } = useAuth();
  if (!session) return null;
  const initials = session.name.split(" ").map((s) => s[0]).slice(0, 2).join("").toUpperCase();
  return (
    <div className="flex items-center gap-3 rounded-md p-2 bg-accent/40">
      <div className="w-9 h-9 rounded-full grid place-items-center text-sm font-semibold text-black" style={{ background: session.avatarColor }}>
        {initials}
      </div>
      <div className="min-w-0">
        <div className="text-sm font-medium truncate">{session.name}</div>
        <div className="text-xs text-muted-foreground truncate">{session.role === "admin" ? "Administrator" : "Trainee"}</div>
      </div>
    </div>
  );
}

// Reusable icon set for external usage
export const NavIcons = { Mail, MessageSquare, Globe };
