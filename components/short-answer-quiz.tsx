"use client"

import { useState } from "react"
import { shortAnswerQuestions } from "@/lib/os-questions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, EyeOff } from "lucide-react"

export function ShortAnswerQuiz() {
  const [revealed, setRevealed] = useState<Record<string, boolean>>({})

  const allRevealed =
    Object.values(revealed).filter(Boolean).length ===
    shortAnswerQuestions.length

  function toggle(id: string) {
    setRevealed((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  function toggleAll() {
    if (allRevealed) {
      setRevealed({})
    } else {
      setRevealed(
        Object.fromEntries(shortAnswerQuestions.map((q) => [q.id, true])),
      )
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 rounded-lg border bg-card p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">
              Short Answer
            </h2>
            <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
              {shortAnswerQuestions.length} questions. Write or think through
              your answer, then reveal the model answer to check yourself.
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleAll}
            className="gap-2"
          >
            {allRevealed ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
            {allRevealed ? "Hide all" : "Reveal all"}
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {shortAnswerQuestions.map((q, index) => {
          const isRevealed = revealed[q.id]
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
                {isRevealed ? (
                  <div className="rounded-md border border-primary/20 bg-primary/5 p-3 text-sm leading-relaxed text-foreground/90">
                    <span className="font-medium text-primary">
                      Model answer:{" "}
                    </span>
                    {q.answer}
                  </div>
                ) : null}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggle(q.id)}
                  className="w-fit gap-2"
                >
                  {isRevealed ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                  {isRevealed ? "Hide answer" : "Show answer"}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
