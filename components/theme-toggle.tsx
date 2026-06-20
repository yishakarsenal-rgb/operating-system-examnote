"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => setMounted(true), [])

  const isDark = resolvedTheme === "dark"

  return (
    <Button
      variant="outline"
      size="icon"
      aria-label="Toggle dark mode"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative shrink-0 border-border/60 bg-card/60 backdrop-blur"
    >
      {mounted ? (
        isDark ? (
          <Moon className="size-5 text-primary" />
        ) : (
          <Sun className="size-5 text-primary" />
        )
      ) : (
        <Sun className="size-5 opacity-0" />
      )}
    </Button>
  )
}
