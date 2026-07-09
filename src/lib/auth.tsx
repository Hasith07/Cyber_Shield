// MOCK AUTH — this is entirely client-side. No credentials leave the browser.
// The "session" is a JSON blob in localStorage. Any email/password combination
// that passes basic validation is accepted. This is a training prototype only.
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export interface Session {
  name: string;
  email: string;
  role: "user" | "admin";
  createdAt: string;
  avatarColor: string;
}

const SESSION_KEY = "pas.session";
const AVATAR_COLORS = ["#22D3EE", "#10B981", "#F59E0B", "#EF4444", "#A78BFA", "#F472B6"];

interface AuthCtx {
  session: Session | null;
  ready: boolean;
  login: (email: string, name?: string) => Session;
  loginDemo: () => Session;
  logout: () => void;
  update: (patch: Partial<Session>) => void;
}

const Ctx = createContext<AuthCtx | null>(null);

function readSession(): Session | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setSession(readSession());
    setReady(true);
  }, []);

  function persist(s: Session | null) {
    setSession(s);
    if (typeof window !== "undefined") {
      if (s) localStorage.setItem(SESSION_KEY, JSON.stringify(s));
      else localStorage.removeItem(SESSION_KEY);
    }
  }

  function login(email: string, name?: string): Session {
    const lower = email.toLowerCase();
    const role: "user" | "admin" = lower.includes("admin") ? "admin" : "user";
    const displayName = name?.trim() || email.split("@")[0].replace(/[._-]/g, " ");
    const s: Session = {
      email,
      name: displayName.replace(/\b\w/g, (c) => c.toUpperCase()),
      role,
      createdAt: new Date().toISOString(),
      avatarColor: AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)],
    };
    persist(s);
    return s;
  }

  function loginDemo(): Session {
    return login("demo.agent@cybercommand.example", "Demo Agent");
  }

  function logout() { persist(null); }
  function update(patch: Partial<Session>) {
    if (!session) return;
    persist({ ...session, ...patch });
  }

  return <Ctx.Provider value={{ session, ready, login, loginDemo, logout, update }}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
