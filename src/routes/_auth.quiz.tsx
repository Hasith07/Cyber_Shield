import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CheckCircle2, XCircle, Timer, RefreshCw } from "lucide-react";
import { quizBank, type QuizQuestion } from "@/lib/mock-data";
import { readProgress, recordQuiz, updateSettings } from "@/lib/progress";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/_auth/quiz")({ component: Quiz });

function shuffled<T>(arr: T[]) { return [...arr].sort(() => Math.random() - 0.5); }

function Quiz() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [i, setI] = useState(0);
  const [choice, setChoice] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [timed, setTimed] = useState(true);
  const [remaining, setRemaining] = useState(20);

  useEffect(() => {
    const p = readProgress();
    setTimed(p.settings.timedQuiz);
    setQuestions(shuffled(quizBank).slice(0, 12));
  }, []);

  useEffect(() => {
    if (!timed || done || choice !== null) return;
    setRemaining(20);
    const t = setInterval(() => setRemaining((r) => (r <= 1 ? 0 : r - 1)), 1000);
    return () => clearInterval(t);
  }, [i, timed, done, choice]);

  useEffect(() => {
    if (timed && remaining === 0 && choice === null && !done && questions.length > 0) {
      setChoice(-1);
    }
  }, [remaining, timed, choice, done, questions.length]);

  if (questions.length === 0) return null;
  const q = questions[i];

  function pick(idx: number) {
    if (choice !== null) return;
    setChoice(idx);
    if (idx === q.correct) setScore((s) => s + 1);
  }

  function next() {
    if (i + 1 >= questions.length) {
      recordQuiz({ score: score + (choice === q.correct ? 0 : 0), total: questions.length, at: new Date().toISOString() });
      // Note: score already incremented above when correct
      setDone(true);
      toast.success("Quiz complete");
    } else {
      setI(i + 1);
      setChoice(null);
    }
  }

  function retake() {
    setQuestions(shuffled(quizBank).slice(0, 12));
    setI(0); setChoice(null); setScore(0); setDone(false);
  }

  if (done) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div className="max-w-xl mx-auto space-y-4">
        <Card>
          <CardHeader><CardTitle>Quiz results</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="text-5xl font-bold text-gradient-cyber">{score}/{questions.length}</div>
            <Progress value={pct} />
            <p className="text-sm text-muted-foreground">
              {pct >= 80 ? "Excellent — you're spotting the patterns." : pct >= 50 ? "Solid start. Review the library and try again." : "Worth another pass — head to the library for a refresher."}
            </p>
            <div className="flex gap-2">
              <Button onClick={retake}><RefreshCw /> Retake quiz</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Quiz Center</h1>
        <div className="flex items-center gap-2">
          <Switch id="timed" checked={timed} onCheckedChange={(v) => { setTimed(v); updateSettings({ timedQuiz: v }); }} />
          <Label htmlFor="timed" className="text-sm">Timed</Label>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Progress value={((i + (choice !== null ? 1 : 0)) / questions.length) * 100} className="flex-1" />
        <span className="text-xs text-muted-foreground">Q{i + 1}/{questions.length}</span>
        {timed && choice === null && <span className="text-xs inline-flex items-center gap-1 text-warning"><Timer className="size-3" /> {remaining}s</span>}
      </div>
      <Card>
        <CardHeader><CardTitle className="text-base">{q.q}</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {q.options.map((opt, idx) => {
            const isCorrect = idx === q.correct;
            const isPicked = choice === idx;
            const show = choice !== null;
            return (
              <button key={idx} disabled={show} onClick={() => pick(idx)}
                className={`w-full text-left rounded-md border px-3 py-2 text-sm transition-colors ${
                  show && isCorrect ? "border-success/60 bg-success/10" :
                  show && isPicked && !isCorrect ? "border-danger/60 bg-danger/10" :
                  "border-border hover:bg-accent"
                }`}>
                <span className="inline-flex items-center gap-2">
                  {show && isCorrect && <CheckCircle2 className="size-4 text-success" />}
                  {show && isPicked && !isCorrect && <XCircle className="size-4 text-danger" />}
                  {opt}
                </span>
              </button>
            );
          })}
          {choice !== null && (
            <div className="rounded-md bg-accent/60 p-3 text-sm mt-2">
              <div className="font-medium mb-1">Why:</div>{q.explain}
            </div>
          )}
        </CardContent>
      </Card>
      <div className="flex justify-end">
        <Button onClick={next} disabled={choice === null}>{i + 1 === questions.length ? "See results" : "Next question"}</Button>
      </div>
    </div>
  );
}
