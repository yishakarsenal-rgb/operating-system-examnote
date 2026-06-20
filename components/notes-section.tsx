"use client"

import { units } from "@/lib/os-notes"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const unitColors = [
  "var(--color-accent-notes)",
  "var(--color-accent-tf)",
  "var(--color-accent-mc)",
  "var(--color-accent-sa)",
  "var(--color-accent-exam)",
  "var(--color-chart-2)",
  "var(--color-chart-4)",
]

export function NotesSection() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-balance">
          Study Notes
        </h2>
        <p className="mt-1 text-muted-foreground leading-relaxed">
          Condensed, exam-ready notes for all seven units. Tap a topic to expand
          it.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {units.map((unit, idx) => {
          const color = unitColors[idx % unitColors.length]
          return (
            <Card
              key={unit.id}
              className="overflow-hidden border-l-4"
              style={{ borderLeftColor: color }}
            >
              <CardHeader className="gap-1">
                <div className="flex items-center gap-3">
                  <Badge
                    className="shrink-0 border-transparent font-mono text-white"
                    style={{ backgroundColor: color }}
                  >
                    Unit {unit.number}
                  </Badge>
                  <CardTitle className="text-lg leading-tight text-balance">
                    {unit.title}
                  </CardTitle>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {unit.summary}
                </p>
              </CardHeader>
              <CardContent>
                <Accordion type="multiple" className="w-full">
                  {unit.sections.map((section, i) => (
                    <AccordionItem
                      key={section.heading}
                      value={`${unit.id}-${i}`}
                    >
                      <AccordionTrigger className="text-left font-medium">
                        {section.heading}
                      </AccordionTrigger>
                      <AccordionContent>
                        <ul className="flex flex-col gap-2">
                          {section.points.map((point, j) => (
                            <li
                              key={j}
                              className="flex gap-2 text-sm leading-relaxed text-foreground/90"
                            >
                              <span
                                aria-hidden="true"
                                className="mt-2 size-1.5 shrink-0 rounded-full"
                                style={{ backgroundColor: color }}
                              />
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
