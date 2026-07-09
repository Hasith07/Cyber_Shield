// Theme controller — dark by default, toggle to light via .light on <html>.
import { useEffect, useState } from "react";

const KEY = "pas.theme";
export type Theme = "dark" | "light";

export function useTheme(): [Theme, (t: Theme) => void] {
  const [theme, setThemeState] = useState<Theme>("dark");
  useEffect(() => {
    const saved = (typeof window !== "undefined" && (localStorage.getItem(KEY) as Theme)) || "dark";
    setThemeState(saved);
    applyTheme(saved);
  }, []);
  function setTheme(t: Theme) {
    setThemeState(t);
    applyTheme(t);
    if (typeof window !== "undefined") localStorage.setItem(KEY, t);
  }
  return [theme, setTheme];
}

function applyTheme(t: Theme) {
  if (typeof document === "undefined") return;
  const el = document.documentElement;
  if (t === "light") el.classList.add("light");
  else el.classList.remove("light");
}
