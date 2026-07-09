// MOCK PROGRESS storage — all scores/streaks/completions live in localStorage.
import { scenarios } from "./mock-data";

const KEY = "pas.progress.v1";

export interface AttemptRecord {
  scenarioId: string;
  correct: boolean;
  points: number;
  at: string;
}

export interface QuizResult {
  score: number;
  total: number;
  at: string;
}

export interface Progress {
  attempts: AttemptRecord[];
  quizResults: QuizResult[];
  articlesRead: string[];
  customScenarios: { id: string; title: string; category: string; difficulty: string; isPhishing: boolean }[];
  settings: {
    notifications: boolean;
    emailDigest: boolean;
    timedQuiz: boolean;
  };
}

const DEFAULT: Progress = {
  attempts: [],
  quizResults: [],
  articlesRead: [],
  customScenarios: [],
  settings: { notifications: true, emailDigest: false, timedQuiz: true },
};

export function readProgress(): Progress {
  if (typeof window === "undefined") return DEFAULT;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT;
    return { ...DEFAULT, ...JSON.parse(raw) };
  } catch {
    return DEFAULT;
  }
}

export function writeProgress(p: Progress) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(p));
  window.dispatchEvent(new Event("pas:progress-updated"));
}

export function recordAttempt(a: AttemptRecord) {
  const p = readProgress();
  // Deduplicate: last attempt per scenario wins
  const filtered = p.attempts.filter((x) => x.scenarioId !== a.scenarioId);
  filtered.push(a);
  p.attempts = filtered;
  writeProgress(p);
}

export function recordQuiz(r: QuizResult) {
  const p = readProgress();
  p.quizResults.push(r);
  writeProgress(p);
}

export function markArticleRead(id: string) {
  const p = readProgress();
  if (!p.articlesRead.includes(id)) {
    p.articlesRead.push(id);
    writeProgress(p);
  }
}

export function addCustomScenario(s: Progress["customScenarios"][number]) {
  const p = readProgress();
  p.customScenarios.push(s);
  writeProgress(p);
}

export function updateSettings(patch: Partial<Progress["settings"]>) {
  const p = readProgress();
  p.settings = { ...p.settings, ...patch };
  writeProgress(p);
}

export function resetProgress() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
  window.dispatchEvent(new Event("pas:progress-updated"));
}

export function computeStats(p: Progress) {
  const totalScenarios = scenarios.length;
  const completed = p.attempts.length;
  const passed = p.attempts.filter((a) => a.correct).length;
  const failed = completed - passed;
  const score = p.attempts.reduce((s, a) => s + (a.correct ? a.points : 0), 0);
  const quizScore = p.quizResults.reduce((s, r) => s + r.score, 0);
  const totalScore = score + quizScore * 2;
  // Streak: consecutive correct from most recent
  const sorted = [...p.attempts].sort((a, b) => (a.at < b.at ? 1 : -1));
  let streak = 0;
  for (const a of sorted) {
    if (a.correct) streak++;
    else break;
  }
  const byCategory: Record<string, { correct: number; total: number }> = {
    email: { correct: 0, total: 0 },
    sms: { correct: 0, total: 0 },
    url: { correct: 0, total: 0 },
    social: { correct: 0, total: 0 },
  };
  for (const a of p.attempts) {
    const sc = scenarios.find((s) => s.id === a.scenarioId);
    if (!sc) continue;
    byCategory[sc.category].total++;
    if (a.correct) byCategory[sc.category].correct++;
  }
  const badges: string[] = [];
  if (passed >= 1) badges.push("First Catch");
  if (passed >= 5) badges.push("Sharp Eye");
  if (passed >= 10) badges.push("Vigilant");
  if (streak >= 3) badges.push("On a Roll");
  if (p.quizResults.some((r) => r.score === r.total)) badges.push("Perfect Quiz");
  if (p.articlesRead.length >= 3) badges.push("Scholar");
  return { totalScenarios, completed, passed, failed, score, totalScore, streak, byCategory, badges };
}
