"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Clock, BookOpen, Brain, RefreshCw, TrendingUp, TrendingDown, Lightbulb } from "lucide-react"

function generateStudyPlan(exams) {
  if (!exams || exams.length === 0) return []

  const latestExam = exams[exams.length - 1]
  const previousExam = exams.length > 1 ? exams[exams.length - 2] : null

  // Calculate study plan for each subject
  const studyPlan = latestExam.subjects.map((subject) => {
    const prevSubject = previousExam?.subjects.find((s) => s.name === subject.name)
    const trend = prevSubject ? subject.percentage - prevSubject.percentage : 0
    
    // Determine performance level
    let level, baseTime, action, priority
    if (subject.percentage < 50) {
      level = "Weak"
      baseTime = 120 // 2 hours
      action = "Revise + Practice"
      priority = 1
    } else if (subject.percentage < 75) {
      level = "Medium"
      baseTime = 75 // 1.25 hours
      action = "Practice"
      priority = 2
    } else {
      level = "Strong"
      baseTime = 45 // 45 minutes
      action = "Revision"
      priority = 3
    }

    // Adjust time based on trend
    let timeAdjustment = 0
    let adjustmentReason = null
    if (prevSubject) {
      if (trend < -10) {
        timeAdjustment = 30
        adjustmentReason = "Focus increased due to performance drop"
      } else if (trend < -5) {
        timeAdjustment = 15
        adjustmentReason = "Slight increase due to decline"
      } else if (trend > 10) {
        timeAdjustment = -20
        adjustmentReason = "Time reduced due to improvement"
      } else if (trend > 5) {
        timeAdjustment = -10
        adjustmentReason = "Slight reduction due to progress"
      }
    }

    const studyTime = Math.max(30, baseTime + timeAdjustment)

    return {
      subject: subject.name,
      percentage: subject.percentage,
      level,
      studyTime,
      action,
      priority,
      trend,
      adjustmentReason,
    }
  })

  // Sort by priority (weak subjects first)
  return studyPlan.sort((a, b) => a.priority - b.priority)
}

function formatTime(minutes) {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hours > 0 && mins > 0) return `${hours}h ${mins}m`
  if (hours > 0) return `${hours}h`
  return `${mins}m`
}

function getActionIcon(action) {
  if (action.includes("Revise")) return <BookOpen className="h-4 w-4" />
  if (action.includes("Practice")) return <Brain className="h-4 w-4" />
  return <RefreshCw className="h-4 w-4" />
}

function getLevelColor(level) {
  if (level === "Weak") return "bg-destructive/20 text-destructive border-destructive/30"
  if (level === "Medium") return "bg-warning/20 text-warning border-warning/30"
  return "bg-success/20 text-success border-success/30"
}

export function StudyPlan({ exams }) {
  const studyPlan = generateStudyPlan(exams)
  const totalTime = studyPlan.reduce((sum, s) => sum + s.studyTime, 0)

  if (studyPlan.length === 0) {
    return (
      <Card className="border-border/50 bg-card">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-foreground">Adaptive Study Plan</CardTitle>
              <CardDescription>Personalized daily study schedule based on your performance</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex h-[200px] items-center justify-center text-muted-foreground">
            Add exam results to generate your personalized study plan
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border/50 bg-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-foreground">Adaptive Study Plan</CardTitle>
              <CardDescription>Personalized daily study schedule based on your performance</CardDescription>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-primary">{formatTime(totalTime)}</p>
            <p className="text-sm text-muted-foreground">Total daily study</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Time Distribution Visual */}
        <div className="flex h-3 overflow-hidden rounded-full bg-secondary">
          {studyPlan.map((item, index) => (
            <div
              key={index}
              className={`${
                item.level === "Weak" ? "bg-destructive" : item.level === "Medium" ? "bg-warning" : "bg-success"
              }`}
              style={{ width: `${(item.studyTime / totalTime) * 100}%` }}
              title={`${item.subject}: ${formatTime(item.studyTime)}`}
            />
          ))}
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-destructive" /> Weak (Focus More)
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-warning" /> Medium (Balance)
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-success" /> Strong (Maintain)
          </span>
        </div>

        {/* Study Schedule */}
        <div className="space-y-3 pt-2">
          {studyPlan.map((item, index) => (
            <div
              key={index}
              className="rounded-lg border border-border/50 bg-secondary/30 p-4 transition-colors hover:bg-secondary/50"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                      item.level === "Weak" ? "bg-destructive/10 text-destructive" : 
                      item.level === "Medium" ? "bg-warning/10 text-warning" : 
                      "bg-success/10 text-success"
                    }`}
                  >
                    {getActionIcon(item.action)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-foreground">{item.subject}</p>
                      <Badge variant="outline" className={getLevelColor(item.level)}>
                        {item.level}
                      </Badge>
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{item.action}</span>
                      <span className="opacity-50">•</span>
                      <span>{item.percentage.toFixed(0)}% current score</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-primary">{formatTime(item.studyTime)}</p>
                  {item.trend !== 0 && (
                    <div className="flex items-center justify-end gap-1 text-xs">
                      {item.trend > 0 ? (
                        <TrendingUp className="h-3 w-3 text-success" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-destructive" />
                      )}
                      <span className={item.trend > 0 ? "text-success" : "text-destructive"}>
                        {item.trend > 0 ? "+" : ""}{item.trend.toFixed(0)}%
                      </span>
                    </div>
                  )}
                </div>
              </div>
              {item.adjustmentReason && (
                <div className="mt-3 flex items-center gap-2 rounded-md bg-primary/5 px-3 py-2 text-xs text-primary">
                  <Lightbulb className="h-3 w-3" />
                  {item.adjustmentReason}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
