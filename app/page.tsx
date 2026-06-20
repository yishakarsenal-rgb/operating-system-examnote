import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { NotesSection } from "@/components/notes-section"
import { TrueFalseQuiz } from "@/components/true-false-quiz"
import { MultipleChoiceQuiz } from "@/components/multiple-choice-quiz"
import { ShortAnswerQuiz } from "@/components/short-answer-quiz"
import { MockExam } from "@/components/mock-exam"
import { ThemeToggle } from "@/components/theme-toggle"
import { Background3D } from "@/components/background-3d"
import {
  BookOpen,
  CircleHelp,
  ListChecks,
  PenLine,
  Timer,
} from "lucide-react"

const tabs = [
  {
    value: "notes",
    label: "Notes",
    icon: BookOpen,
    color: "var(--color-accent-notes)",
  },
  {
    value: "tf",
    label: "True/False",
    icon: CircleHelp,
    color: "var(--color-accent-tf)",
  },
  {
    value: "mc",
    label: "Choice",
    icon: ListChecks,
    color: "var(--color-accent-mc)",
  },
  {
    value: "sa",
    label: "Short",
    icon: PenLine,
    color: "var(--color-accent-sa)",
  },
  {
    value: "exam",
    label: "Mock Exam",
    icon: Timer,
    color: "var(--color-accent-exam)",
  },
] as const

export default function Page() {
  return (
    <main className="relative mx-auto min-h-dvh w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <Background3D />
      <header className="relative overflow-hidden rounded-2xl border bg-card/80 p-6 shadow-sm backdrop-blur-md sm:p-8">
        {/* Colorful accent banner */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-1.5"
          style={{
            background:
              "linear-gradient(90deg, var(--color-accent-notes), var(--color-accent-tf), var(--color-accent-mc), var(--color-accent-sa), var(--color-accent-exam))",
          }}
        />
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <BookOpen className="size-5" />
            </span>
            <span className="font-mono text-sm font-medium uppercase tracking-wider text-primary">
              Operating Systems
            </span>
          </div>
          <ThemeToggle />
        </div>

        <h1 className="mt-5 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          Final Exam Prep
        </h1>
        <p className="mt-3 max-w-prose text-muted-foreground leading-relaxed text-pretty">
          Everything you need to study for your OS final, organized to match the
          exam format: 7 units of study notes, plus practice questions —{" "}
          <span className="font-medium text-foreground">10 True/False</span>,{" "}
          <span className="font-medium text-foreground">20 Multiple Choice</span>
          , and{" "}
          <span className="font-medium text-foreground">20 Short Answer</span> —
          plus a timed, randomized{" "}
          <span className="font-medium text-foreground">full mock exam</span>.
        </p>

        {/* Quick format chips */}
        <div className="mt-5 flex flex-wrap gap-2">
          {tabs.map((t) => (
            <span
              key={t.value}
              className="flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium"
              style={{
                color: t.color,
                borderColor: t.color,
                backgroundColor: `color-mix(in oklch, ${t.color} 10%, transparent)`,
              }}
            >
              <t.icon className="size-3.5" />
              {t.label}
            </span>
          ))}
        </div>
      </header>

      <Tabs defaultValue="notes" className="mt-8 w-full gap-6">
        <TabsList className="grid h-auto w-full grid-cols-3 gap-1.5 bg-muted/50 p-1.5 backdrop-blur-md sm:grid-cols-5">
          {tabs.map((t) => (
            <TabsTrigger
              key={t.value}
              value={t.value}
              className="group gap-1.5 py-2 data-[state=active]:shadow-sm"
              style={
                {
                  "--tab-color": t.color,
                } as React.CSSProperties
              }
            >
              <t.icon
                className="size-4 text-[var(--tab-color)] transition-transform group-data-[state=active]:scale-110"
              />
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="notes">
          <NotesSection />
        </TabsContent>
        <TabsContent value="tf">
          <TrueFalseQuiz />
        </TabsContent>
        <TabsContent value="mc">
          <MultipleChoiceQuiz />
        </TabsContent>
        <TabsContent value="sa">
          <ShortAnswerQuiz />
        </TabsContent>
        <TabsContent value="exam">
          <MockExam />
        </TabsContent>
      </Tabs>

      <footer className="mt-12 border-t pt-6 text-center text-sm text-muted-foreground">
        Good luck on your exam. Review the notes, then test yourself on each
        question type.
      </footer>
    </main>
  )
}
