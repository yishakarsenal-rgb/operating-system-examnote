'use client'

import { useState } from 'react'
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
  ChevronLeft,
  ChevronRight,
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
    label: "Multiple Choice",
    icon: ListChecks,
    color: "var(--color-accent-mc)",
  },
  {
    value: "sa",
    label: "Short Answer",
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
  const [activeTab, setActiveTab] = useState("notes")
  const [sidebarMinimized, setSidebarMinimized] = useState(false)

  const renderContent = () => {
    switch (activeTab) {
      case "notes":
        return <NotesSection />
      case "tf":
        return <TrueFalseQuiz />
      case "mc":
        return <MultipleChoiceQuiz />
      case "sa":
        return <ShortAnswerQuiz />
      case "exam":
        return <MockExam />
      default:
        return <NotesSection />
    }
  }

  return (
    <div className="relative min-h-dvh w-full bg-background">
      <Background3D />

      {/* Header */}
      <header className="relative z-20 border-b bg-card/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
              <BookOpen className="size-5" />
            </span>
            <div>
              <p className="font-mono text-xs font-medium uppercase tracking-wider text-primary">
                Operating Systems
              </p>
              <h1 className="text-lg font-semibold tracking-tight sm:text-xl">
                Final Exam Prep
              </h1>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Layout: Sidebar + Content */}
      <main className="relative z-10 mx-auto flex max-w-7xl gap-4 px-4 py-8 sm:px-6 lg:px-8">
        {/* Sidebar */}
        <aside className={`flex-shrink-0 transition-all duration-300 ${sidebarMinimized ? "w-20" : "w-full max-w-xs"}`}>
          <div className="sticky top-8 space-y-3">
            {/* Minimize Toggle Button */}
            <div className={`flex ${sidebarMinimized ? "justify-center" : "justify-between"} items-center px-4 py-3`}>
              {!sidebarMinimized && (
                <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Sections
                </h2>
              )}
              <button
                onClick={() => setSidebarMinimized(!sidebarMinimized)}
                className="p-1.5 rounded-lg border transition-all duration-200 hover:bg-muted"
                title={sidebarMinimized ? "Expand sidebar" : "Minimize sidebar"}
              >
                {sidebarMinimized ? (
                  <ChevronRight className="size-4" />
                ) : (
                  <ChevronLeft className="size-4" />
                )}
              </button>
            </div>

            {/* Navigation Buttons */}
            <nav className="space-y-2">
              {tabs.map((t) => {
                const isActive = activeTab === t.value
                return (
                  <button
                    key={t.value}
                    onClick={() => setActiveTab(t.value)}
                    className="group relative w-full rounded-lg border px-4 py-3 text-left transition-all duration-200"
                    style={{
                      backgroundColor: isActive
                        ? `color-mix(in oklch, ${t.color} 15%, transparent)`
                        : "transparent",
                      borderColor: isActive ? t.color : "var(--color-border)",
                      padding: sidebarMinimized ? "0.75rem" : "0.75rem 1rem",
                    }}
                    title={sidebarMinimized ? t.label : undefined}
                  >
                    <div className={`flex ${sidebarMinimized ? "justify-center" : "items-center gap-3"}`}>
                      <t.icon
                        className="size-5 flex-shrink-0 transition-transform"
                        style={{
                          color: t.color,
                          transform: isActive ? "scale(1.1)" : "scale(1)",
                        }}
                      />
                      {!sidebarMinimized && (
                        <span
                          className="font-medium text-sm"
                          style={{
                            color: isActive ? t.color : "var(--color-foreground)",
                          }}
                        >
                          {t.label}
                        </span>
                      )}
                    </div>
                    {isActive && (
                      <div
                        className="absolute inset-y-0 left-0 w-1 rounded-l-lg"
                        style={{ backgroundColor: t.color }}
                      />
                    )}
                  </button>
                )
              })}
            </nav>
          </div>
        </aside>

        {/* Content Area */}
        <div className="min-w-0 flex-1">
          <div className="rounded-xl border bg-card/80 p-6 backdrop-blur-md sm:p-8">
            {renderContent()}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t bg-card/50 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 text-sm text-muted-foreground sm:grid-cols-3">
            <div>
              <p className="font-semibold text-foreground">Study Material</p>
              <p className="mt-1">Comprehensive Operating Systems exam preparation covering 7 core units with integrated practice assessments.</p>
            </div>
            <div>
              <p className="font-semibold text-foreground">Features</p>
              <ul className="mt-1 space-y-0.5">
                <li>• 35 True/False Questions</li>
                <li>• 40 Multiple Choice Questions</li>
                <li>• 33 Short Answer Questions</li>
                <li>• Timed Mock Exam</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-foreground">About</p>
              <p className="mt-1">Developed by <span className="font-medium text-foreground">Yishak</span></p>
              <p className="mt-2 text-xs">© {new Date().getFullYear()}. All rights reserved.</p>
            </div>
          </div>
          <div className="mt-6 border-t pt-4 text-center text-xs text-muted-foreground">
            <p>This platform is designed to facilitate exam preparation. Review all course materials in conjunction with official study guides.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
