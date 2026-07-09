import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BookOpen, CheckCircle2 } from "lucide-react";
import { articles } from "@/lib/mock-data";
import { markArticleRead, readProgress } from "@/lib/progress";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_auth/library")({ component: Library });

function Library() {
  const [read, setRead] = useState<string[]>([]);
  useEffect(() => { setRead(readProgress().articlesRead); }, []);
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <BookOpen className="text-primary" />
        <h1 className="text-2xl font-semibold">Learning Library</h1>
      </div>
      <p className="text-sm text-muted-foreground">Short, practical articles on spotting phishing.</p>
      <Accordion type="single" collapsible className="space-y-2">
        {articles.map((a) => (
          <AccordionItem key={a.id} value={a.id} className="rounded-xl border border-border bg-card px-4">
            <AccordionTrigger onClick={() => { markArticleRead(a.id); setRead((r) => r.includes(a.id) ? r : [...r, a.id]); }}>
              <div className="flex items-center gap-3 text-left">
                <span className="font-medium">{a.title}</span>
                <Badge variant="outline">{a.tag}</Badge>
                {read.includes(a.id) && <span className="text-xs inline-flex items-center gap-1 text-success"><CheckCircle2 className="size-3.5" /> read</span>}
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground space-y-2">
              <p className="text-foreground/90 font-medium">{a.summary}</p>
              <p>{a.body}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
