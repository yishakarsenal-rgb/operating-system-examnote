"use client"

import { useState } from "react"
import { trueFalseQuestions } from "@/lib/os-questions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Check, X, RotateCcw } from "lucide-react"
import { cn } from "@/lib/utils"

export function TrueFalseQuiz() {
  const [answers, setAnswers] = useState<Record<string, boolean>>({})

  const answeredCount = Object.keys(answers).length
  const total = trueFalseQuestions.length
  const correctCount = trueFalseQuestions.filter(
    (q) => answers[q.id] === q.answer,
  ).length

  function selectAnswer(id: string, value: boolean) {
    if (answers[id] !== undefined) return
    setAnswers((prev) => ({ ...prev, [id]: value }))
  }

  return (
    <div className="flex flex-col gap-6">
      <QuizHeader
        title="True / False"
        description={`${total} questions. Decide whether each statement is true or false.`}
        answered={answeredCount}
        total={total}
        correct={correctCount}
        onReset={() => setAnswers({})}
      />

      <div className="flex flex-col gap-4">
        {trueFalseQuestions.map((q, index) => {
          const selected = answers[q.id]
          const isAnswered = selected !== undefined
          const isCorrect = selected === q.answer

          return (
            <Card key={q.id}>
              <CardHeader className="gap-2">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="font-mono">
                    Q{index + 1}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Unit {q.unit}
                  </Badge>
                </div>
                <CardTitle className="text-base font-medium leading-relaxed">
                  {q.statement}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <div className="flex gap-3">
                  {[true, false].map((value) => {
                    const isThis = selected === value
                    const showCorrect = isAnswered && value === q.answer
                    const showWrong = isThis && !isCorrect
                    return (
                      <Button
                        key={String(value)}
                        variant="outline"
                        disabled={isAnswered}
                        onClick={() => selectAnswer(q.id, value)}
                        className={cn(
                          "flex-1 disabled:opacity-100",
                          showCorrect &&
                            "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
                          showWrong &&
                            "border-destructive bg-destructive/10 text-destructive",
                        )}
                      >
                        {value ? "True" : "False"}
                      </Button>
                    )
                  })}
                </div>
                {isAnswered && (
                  <Explanation isCorrect={isCorrect} text={q.explanation} />
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

export function QuizHeader({
  title,
  description,
  answered,
  total,
  correct,
  onReset,
}: {
  title: string
  description: string
  answered: number
  total: number
  correct: number
  onReset: () => void
}) {
  const pct = total > 0 ? (answered / total) * 100 : 0
  return (
    <div className="flex flex-col gap-4 rounded-lg border bg-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
          <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={onReset} className="gap-2">
          <RotateCcw className="size-4" />
          Reset
        </Button>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Answered {answered} / {total}
          </span>
          <span className="font-medium">
            Score: {correct} / {answered || 0}
          </span>
        </div>
        <Progress value={pct} />
      </div>
    </div>
  )
}

export function Explanation({
  isCorrect,
  text,
}: {
  isCorrect: boolean
  text: string
}) {
  return (
    <div
      className={cn(
        "flex gap-2 rounded-md border p-3 text-sm leading-relaxed",
        isCorrect
          ? "border-emerald-500/30 bg-emerald-500/5"
          : "border-destructive/30 bg-destructive/5",
      )}
    >
      <span className="mt-0.5 shrink-0">
        {isCorrect ? (
          <Check className="size-4 text-emerald-600 dark:text-emerald-400" />
        ) : (
          <X className="size-4 text-destructive" />
        )}
      </span>
      <span className="text-foreground/90">
        <span className="font-medium">
          {isCorrect ? "Correct. " : "Not quite. "}
        </span>
        {text}
      </span>
    </div>
  )
}
