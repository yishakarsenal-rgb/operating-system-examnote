"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  trueFalseQuestions,
  choiceQuestions,
  shortAnswerQuestions,
  type TrueFalseQuestion,
  type ChoiceQuestion,
  type ShortAnswerQuestion,
} from "@/lib/os-questions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  Clock,
  Play,
  Check,
  X,
  RotateCcw,
  AlertTriangle,
  Trophy,
  Shuffle,
} from "lucide-react";

const TF_COUNT = 10;
const MC_COUNT = 20;
const SA_COUNT = 20;
const EXAM_MINUTES = 90;

type TFItem = { kind: "tf"; q: TrueFalseQuestion };
type MCItem = { kind: "mc"; q: ChoiceQuestion };
type SAItem = { kind: "sa"; q: ShortAnswerQuestion };
type ExamItem = TFItem | MCItem | SAItem;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildExam(): ExamItem[] {
  const tf: ExamItem[] = shuffle(trueFalseQuestions)
    .slice(0, TF_COUNT)
    .map((q) => ({ kind: "tf", q }));
  const mc: ExamItem[] = shuffle(choiceQuestions)
    .slice(0, MC_COUNT)
    .map((q) => ({ kind: "mc", q }));
  const sa: ExamItem[] = shuffle(shortAnswerQuestions)
    .slice(0, SA_COUNT)
    .map((q) => ({ kind: "sa", q }));
  // Keep sections grouped (like a real paper) but randomize within each section.
  return [...tf, ...mc, ...sa];
}

function formatTime(secs: number): string {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

type Phase = "intro" | "active" | "results";

export function MockExam() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [items, setItems] = useState<ExamItem[]>([]);
  const [tfAnswers, setTfAnswers] = useState<Record<string, boolean>>({});
  const [mcAnswers, setMcAnswers] = useState<Record<string, number>>({});
  const [saSelfGrade, setSaSelfGrade] = useState<Record<string, boolean>>({});
  const [secondsLeft, setSecondsLeft] = useState(EXAM_MINUTES * 60);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const finishExam = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    setPhase("results");
  }, []);

  // countdown timer
  useEffect(() => {
    if (phase !== "active") return;
    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          finishExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase, finishExam]);

  function startExam() {
    setItems(buildExam());
    setTfAnswers({});
    setMcAnswers({});
    setSaSelfGrade({});
    setSecondsLeft(EXAM_MINUTES * 60);
    setPhase("active");
  }

  const tfItems = items.filter((i): i is TFItem => i.kind === "tf");
  const mcItems = items.filter((i): i is MCItem => i.kind === "mc");
  const saItems = items.filter((i): i is SAItem => i.kind === "sa");

  const objectiveTotal = tfItems.length + mcItems.length;
  const objectiveAnswered =
    Object.keys(tfAnswers).length + Object.keys(mcAnswers).length;

  const tfCorrect = tfItems.filter(
    (i) => tfAnswers[i.q.id] === i.q.answer,
  ).length;
  const mcCorrect = mcItems.filter(
    (i) => mcAnswers[i.q.id] === i.q.answerIndex,
  ).length;
  const saCorrect = saItems.filter((i) => saSelfGrade[i.q.id]).length;

  if (phase === "intro") {
    return <ExamIntro onStart={startExam} />;
  }

  if (phase === "results") {
    return (
      <ExamResults
        tfItems={tfItems}
        mcItems={mcItems}
        saItems={saItems}
        tfAnswers={tfAnswers}
        mcAnswers={mcAnswers}
        saSelfGrade={saSelfGrade}
        tfCorrect={tfCorrect}
        mcCorrect={mcCorrect}
        saCorrect={saCorrect}
        timeUsed={EXAM_MINUTES * 60 - secondsLeft}
        onRestart={startExam}
        onExit={() => setPhase("intro")}
      />
    );
  }

  const lowTime = secondsLeft <= 300;
  let counter = 0;

  return (
    <div className="flex flex-col gap-6">
      {/* sticky exam status bar */}
      <div className="sticky top-0 z-10 -mx-4 flex flex-wrap items-center justify-between gap-3 border-b bg-background/95 px-4 py-3 backdrop-blur sm:mx-0 sm:rounded-lg sm:border sm:px-5">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-1.5 font-mono text-lg font-semibold tabular-nums",
              lowTime
                ? "bg-destructive/10 text-destructive"
                : "bg-secondary text-foreground",
            )}
          >
            <Clock className="size-4" />
            {formatTime(secondsLeft)}
          </span>
          {lowTime && (
            <span className="hidden items-center gap-1 text-xs font-medium text-destructive sm:flex">
              <AlertTriangle className="size-3.5" />
              Time running out
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">
            {objectiveAnswered}/{objectiveTotal} answered
          </span>
          <Button size="sm" onClick={finishExam} className="gap-2">
            Submit exam
          </Button>
        </div>
      </div>

      {/* section 1 True / False */}
      <SectionHeading
        number="Section A"
        title="True / False"
        meta={`${tfItems.length} questions · 1 mark each`}
      />
      <div className="flex flex-col gap-4">
        {tfItems.map((item) => {
          counter += 1;
          const num = counter;
          const selected = tfAnswers[item.q.id];
          return (
            <Card key={item.q.id}>
              <CardHeader className="gap-2">
                <QuestionMeta num={num} unit={item.q.unit} type="T/F" />
                <CardTitle className="text-base font-medium leading-relaxed">
                  {item.q.statement}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3">
                  {[true, false].map((value) => (
                    <Button
                      key={String(value)}
                      variant="outline"
                      onClick={() =>
                        setTfAnswers((p) => ({ ...p, [item.q.id]: value }))
                      }
                      className={cn(
                        "flex-1",
                        selected === value &&
                          "border-primary bg-primary/10 text-primary",
                      )}
                    >
                      {value ? "True" : "False"}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* section 2 Multiple Choice */}
      <SectionHeading
        number="Section B"
        title="Multiple Choice"
        meta={`${mcItems.length} questions · 1 mark each`}
      />
      <div className="flex flex-col gap-4">
        {mcItems.map((item) => {
          counter += 1;
          const num = counter;
          const selected = mcAnswers[item.q.id];
          const letters = ["A", "B", "C", "D", "E"];
          return (
            <Card key={item.q.id}>
              <CardHeader className="gap-2">
                <QuestionMeta num={num} unit={item.q.unit} type="MCQ" />
                <CardTitle className="text-base font-medium leading-relaxed">
                  {item.q.question}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2">
                  {item.q.options.map((option, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() =>
                        setMcAnswers((p) => ({ ...p, [item.q.id]: i }))
                      }
                      className={cn(
                        "flex items-center gap-3 rounded-md border bg-background p-3 text-left text-sm transition-colors hover:border-primary/50 hover:bg-accent/50",
                        selected === i && "border-primary bg-primary/10",
                      )}
                    >
                      <span
                        className={cn(
                          "flex size-6 shrink-0 items-center justify-center rounded-full border text-xs font-medium",
                          selected === i &&
                            "border-primary bg-primary text-primary-foreground",
                        )}
                      >
                        {letters[i]}
                      </span>
                      <span className="text-foreground/90">{option}</span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* section 3 Short Answer */}
      <SectionHeading
        number="Section C"
        title="Short Answer"
        meta={`${saItems.length} questions · self-graded`}
      />
      <div className="flex flex-col gap-4">
        {saItems.map((item) => {
          counter += 1;
          const num = counter;
          return (
            <Card key={item.q.id}>
              <CardHeader className="gap-2">
                <QuestionMeta num={num} unit={item.q.unit} type="Short" />
                <CardTitle className="text-base font-medium leading-relaxed">
                  {item.q.question}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <textarea
                  rows={3}
                  placeholder="Type your answer here. You'll compare it to the model answer when you submit."
                  className="w-full resize-y rounded-md border bg-background p-3 text-sm leading-relaxed outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="flex flex-col items-center gap-3 rounded-lg border bg-card p-6 text-center">
        <p className="text-sm text-muted-foreground">
          Finished? Submit to grade your True/False and Multiple Choice answers
          and self-check your Short Answers against model answers.
        </p>
        <Button onClick={finishExam} size="lg">
          Submit exam
        </Button>
      </div>
    </div>
  );
}

function ExamIntro({ onStart }: { onStart: () => void }) {
  const tfAvail = trueFalseQuestions.length;
  const mcAvail = choiceQuestions.length;
  const saAvail = shortAnswerQuestions.length;
  return (
    <Card className="overflow-hidden">
      <CardHeader className="gap-3">
        <div className="flex size-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Trophy className="size-6" />
        </div>
        <CardTitle className="text-2xl tracking-tight">
          Full Mock Exam
        </CardTitle>
        <p className="text-sm text-muted-foreground leading-relaxed text-pretty">
          A timed, randomized exam that mirrors your real final. Each attempt
          pulls a fresh random set of questions from the bank, so you can
          practice over and over.
        </p>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat
            label="Duration"
            value={`${EXAM_MINUTES} min`}
            icon={<Clock className="size-4" />}
          />
          <Stat label="True/False" value={`${TF_COUNT}`} />
          <Stat label="Multiple Choice" value={`${MC_COUNT}`} />
          <Stat label="Short Answer" value={`${SA_COUNT}`} />
        </div>
        <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <Shuffle className="mt-0.5 size-4 shrink-0 text-primary" />
            Questions are randomly drawn and shuffled from a bank of {
              tfAvail
            }{" "}
            T/F, {mcAvail} MCQ, and {saAvail} short-answer questions.
          </li>
          <li className="flex items-start gap-2">
            <Clock className="mt-0.5 size-4 shrink-0 text-primary" />A{" "}
            {EXAM_MINUTES}-minute countdown auto-submits when it reaches zero.
          </li>
          <li className="flex items-start gap-2">
            <Check className="mt-0.5 size-4 shrink-0 text-primary" />
            T/F and MCQ are auto-graded; short answers are self-graded against
            model answers.
          </li>
        </ul>
        <Button size="lg" onClick={onStart} className="gap-2 self-start">
          <Play className="size-4" />
          Start mock exam
        </Button>
      </CardContent>
    </Card>
  );
}

function ExamResults({
  tfItems,
  mcItems,
  saItems,
  tfAnswers,
  mcAnswers,
  saSelfGrade,
  tfCorrect,
  mcCorrect,
  saCorrect,
  timeUsed,
  onRestart,
  onExit,
}: {
  tfItems: TFItem[];
  mcItems: MCItem[];
  saItems: SAItem[];
  tfAnswers: Record<string, boolean>;
  mcAnswers: Record<string, number>;
  saSelfGrade: Record<string, boolean>;
  tfCorrect: number;
  mcCorrect: number;
  saCorrect: number;
  timeUsed: number;
  onRestart: () => void;
  onExit: () => void;
}) {
  const [saGrade, setSaGrade] = useState<Record<string, boolean>>(saSelfGrade);

  const objectiveTotal = tfItems.length + mcItems.length;
  const objectiveScore = tfCorrect + mcCorrect;
  const saGradedCorrect = saItems.filter((i) => saGrade[i.q.id]).length;
  const totalPossible = tfItems.length + mcItems.length + saItems.length;
  const totalScore = objectiveScore + saGradedCorrect;
  const pct = Math.round((totalScore / totalPossible) * 100);
  const letters = ["A", "B", "C", "D", "E"];

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="gap-2">
          <CardTitle className="text-2xl tracking-tight">
            Exam Results
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Time used: {formatTime(timeUsed)}. Grade your short answers below to
            update your total.
          </p>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <div className="flex flex-col items-center gap-3 rounded-lg border bg-secondary/40 p-6">
            <span className="text-5xl font-semibold tracking-tight tabular-nums">
              {pct}%
            </span>
            <span className="text-sm text-muted-foreground">
              {totalScore} / {totalPossible} marks
            </span>
            <Progress value={pct} className="max-w-xs" />
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <ScoreCard
              label="True / False"
              correct={tfCorrect}
              total={tfItems.length}
            />
            <ScoreCard
              label="Multiple Choice"
              correct={mcCorrect}
              total={mcItems.length}
            />
            <ScoreCard
              label="Short Answer"
              correct={saGradedCorrect}
              total={saItems.length}
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <Button onClick={onRestart} className="gap-2">
              <RotateCcw className="size-4" />
              New random exam
            </Button>
            <Button variant="outline" onClick={onExit}>
              Back to overview
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* review True / False */}
      <SectionHeading number="Review A" title="True / False" meta="" />
      <div className="flex flex-col gap-4">
        {tfItems.map((item, idx) => {
          const chosen = tfAnswers[item.q.id];
          const correct = chosen === item.q.answer;
          const answered = chosen !== undefined;
          return (
            <ReviewCard
              key={item.q.id}
              num={idx + 1}
              unit={item.q.unit}
              type="T/F"
              prompt={item.q.statement}
              correct={correct}
              answered={answered}
              yourAnswer={answered ? (chosen ? "True" : "False") : "No answer"}
              correctAnswer={item.q.answer ? "True" : "False"}
              explanation={item.q.explanation}
            />
          );
        })}
      </div>

      {/* review multiple choice */}
      <SectionHeading number="Review B" title="Multiple Choice" meta="" />
      <div className="flex flex-col gap-4">
        {mcItems.map((item, idx) => {
          const chosen = mcAnswers[item.q.id];
          const answered = chosen !== undefined;
          const correct = chosen === item.q.answerIndex;
          return (
            <ReviewCard
              key={item.q.id}
              num={idx + 1}
              unit={item.q.unit}
              type="MCQ"
              prompt={item.q.question}
              correct={correct}
              answered={answered}
              yourAnswer={
                answered
                  ? `${letters[chosen]}. ${item.q.options[chosen]}`
                  : "No answer"
              }
              correctAnswer={`${letters[item.q.answerIndex]}. ${
                item.q.options[item.q.answerIndex]
              }`}
              explanation={item.q.explanation}
            />
          );
        })}
      </div>

      {/* review short answer  self grade */}
      <SectionHeading
        number="Review C"
        title="Short Answer (self-grade)"
        meta="Mark each as correct if your answer matched the key"
      />
      <div className="flex flex-col gap-4">
        {saItems.map((item, idx) => {
          const graded = saGrade[item.q.id];
          return (
            <Card key={item.q.id}>
              <CardHeader className="gap-2">
                <QuestionMeta num={idx + 1} unit={item.q.unit} type="Short" />
                <CardTitle className="text-base font-medium leading-relaxed">
                  {item.q.question}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <div className="rounded-md border border-primary/20 bg-primary/5 p-3 text-sm leading-relaxed text-foreground/90">
                  <span className="font-medium text-primary">
                    Model answer:{" "}
                  </span>
                  {item.q.answer}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setSaGrade((p) => ({ ...p, [item.q.id]: true }))
                    }
                    className={cn(
                      "gap-2",
                      graded === true &&
                        "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
                    )}
                  >
                    <Check className="size-4" />I got it right
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setSaGrade((p) => ({ ...p, [item.q.id]: false }))
                    }
                    className={cn(
                      "gap-2",
                      graded === false &&
                        "border-destructive bg-destructive/10 text-destructive",
                    )}
                  >
                    <X className="size-4" />
                    Missed it
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function SectionHeading({
  number,
  title,
  meta,
}: {
  number: string;
  title: string;
  meta: string;
}) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-2 border-b pb-2">
      <div className="flex items-baseline gap-2">
        <span className="font-mono text-xs font-medium uppercase tracking-wider text-primary">
          {number}
        </span>
        <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
      </div>
      {meta && <span className="text-xs text-muted-foreground">{meta}</span>}
    </div>
  );
}

function QuestionMeta({
  num,
  unit,
  type,
}: {
  num: number;
  unit: number;
  type: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <Badge variant="secondary" className="font-mono">
        Q{num}
      </Badge>
      <Badge variant="outline" className="text-xs">
        Unit {unit}
      </Badge>
      <Badge variant="outline" className="text-xs text-muted-foreground">
        {type}
      </Badge>
    </div>
  );
}

function Stat({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1 rounded-md border bg-secondary/40 p-3">
      <span className="flex items-center gap-1.5 text-2xl font-semibold tracking-tight">
        {icon}
        {value}
      </span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}

function ScoreCard({
  label,
  correct,
  total,
}: {
  label: string;
  correct: number;
  total: number;
}) {
  return (
    <div className="flex flex-col gap-1 rounded-md border bg-card p-4">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-xl font-semibold tabular-nums">
        {correct} / {total}
      </span>
    </div>
  );
}

function ReviewCard({
  num,
  unit,
  type,
  prompt,
  correct,
  answered,
  yourAnswer,
  correctAnswer,
  explanation,
}: {
  num: number;
  unit: number;
  type: string;
  prompt: string;
  correct: boolean;
  answered: boolean;
  yourAnswer: string;
  correctAnswer: string;
  explanation: string;
}) {
  return (
    <Card
      className={cn(
        "border-l-4",
        correct ? "border-l-emerald-500" : "border-l-destructive",
      )}
    >
      <CardHeader className="gap-2">
        <QuestionMeta num={num} unit={unit} type={type} />
        <CardTitle className="text-base font-medium leading-relaxed">
          {prompt}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 text-sm">
        <div
          className={cn(
            "flex items-center gap-2 rounded-md border p-2.5",
            correct
              ? "border-emerald-500/30 bg-emerald-500/5"
              : "border-destructive/30 bg-destructive/5",
          )}
        >
          {correct ? (
            <Check className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <X className="size-4 shrink-0 text-destructive" />
          )}
          <span className="text-foreground/90">
            <span className="font-medium">Your answer: </span>
            {yourAnswer}
          </span>
        </div>
        {!correct && (
          <div className="rounded-md border border-emerald-500/30 bg-emerald-500/5 p-2.5">
            <span className="font-medium text-emerald-700 dark:text-emerald-400">
              Correct answer:{" "}
            </span>
            <span className="text-foreground/90">{correctAnswer}</span>
          </div>
        )}
        <p className="text-muted-foreground leading-relaxed">{explanation}</p>
      </CardContent>
    </Card>
  );
}
