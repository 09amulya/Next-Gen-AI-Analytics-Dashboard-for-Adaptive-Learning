"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { History, Trash2, Calendar, BarChart3 } from "lucide-react"

export function ExamHistory({ exams, onDelete, onSelect, selectedExamId }) {
  if (!exams || exams.length === 0) {
    return (
      <Card className="border-border/50 bg-card">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <History className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-foreground">Exam History</CardTitle>
              <CardDescription>View and manage your past exams</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex h-[150px] items-center justify-center text-muted-foreground">
            No exams recorded yet
          </div>
        </CardContent>
      </Card>
    )
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <Card className="border-border/50 bg-card">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <History className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-foreground">Exam History</CardTitle>
            <CardDescription>{exams.length} exam{exams.length !== 1 ? "s" : ""} recorded</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {[...exams].reverse().map((exam) => {
          const avg = exam.subjects.reduce((sum, s) => sum + s.percentage, 0) / exam.subjects.length
          const isSelected = selectedExamId === exam.id

          return (
            <div
              key={exam.id}
              className={`flex items-center justify-between rounded-lg border p-3 transition-colors cursor-pointer ${
                isSelected
                  ? "border-primary bg-primary/5"
                  : "border-border/50 bg-secondary/30 hover:bg-secondary/50"
              }`}
              onClick={() => onSelect && onSelect(exam.id)}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{exam.name}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {formatDate(exam.date)}
                    <span className="opacity-50">•</span>
                    {exam.subjects.length} subjects
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge
                  variant="outline"
                  className={
                    avg >= 75
                      ? "bg-success/10 text-success border-success/30"
                      : avg >= 50
                      ? "bg-warning/10 text-warning border-warning/30"
                      : "bg-destructive/10 text-destructive border-destructive/30"
                  }
                >
                  {avg.toFixed(1)}%
                </Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation()
                    onDelete && onDelete(exam.id)
                  }}
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
