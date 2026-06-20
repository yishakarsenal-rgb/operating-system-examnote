"use client"

import { useState } from "react"
import { choiceQuestions } from "@/lib/os-questions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { QuizHeader, Explanation } from "@/components/true-false-quiz"

export function MultipleChoiceQuiz() {
  const [answers, setAnswers] = useState<Record<string, number>>({})

  const answeredCount = Object.keys(answers).length
  const total = choiceQuestions.length
  const correctCount = choiceQuestions.filter(
    (q) => answers[q.id] === q.answerIndex,
  ).length

  function selectAnswer(id: string, index: number) {
    if (answers[id] !== undefined) return
    setAnswers((prev) => ({ ...prev, [id]: index }))
  }

  const letters = ["A", "B", "C", "D", "E"]

  return (
    <div className="flex flex-col gap-6">
      <QuizHeader
        title="Multiple Choice"
        description={`${total} questions. Select the single best answer for each.`}
        answered={answeredCount}
        total={total}
        correct={correctCount}
        onReset={() => setAnswers({})}
      />

      <div className="flex flex-col gap-4">
        {choiceQuestions.map((q, index) => {
          const selected = answers[q.id]
          const isAnswered = selected !== undefined
          const isCorrect = selected === q.answerIndex

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
                  {q.question}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                  {q.options.map((option, i) => {
                    const isThis = selected === i
                    const showCorrect = isAnswered && i === q.answerIndex
                    const showWrong = isThis && !isCorrect
                    return (
                      <button
                        key={i}
                        type="button"
                        disabled={isAnswered}
                        onClick={() => selectAnswer(q.id, i)}
                        className={cn(
                          "flex items-center gap-3 rounded-md border bg-background p-3 text-left text-sm transition-colors",
                          !isAnswered &&
                            "hover:border-primary/50 hover:bg-accent/50 cursor-pointer",
                          showCorrect &&
                            "border-emerald-500 bg-emerald-500/10",
                          showWrong && "border-destructive bg-destructive/10",
                        )}
                      >
                        <span
                          className={cn(
                            "flex size-6 shrink-0 items-center justify-center rounded-full border text-xs font-medium",
                            showCorrect &&
                              "border-emerald-500 bg-emerald-500 text-white",
                            showWrong &&
                              "border-destructive bg-destructive text-white",
                          )}
                        >
                          {showCorrect ? (
                            <Check className="size-3.5" />
                          ) : showWrong ? (
                            <X className="size-3.5" />
                          ) : (
                            letters[i]
                          )}
                        </span>
                        <span className="text-foreground/90">{option}</span>
                      </button>
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
