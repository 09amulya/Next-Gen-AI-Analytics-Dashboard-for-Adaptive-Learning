"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, Target, Lightbulb } from "lucide-react"

function generateInsights(exams) {
  if (!exams || exams.length === 0) return []

  const insights = []
  const latestExam = exams[exams.length - 1]
  const previousExam = exams.length > 1 ? exams[exams.length - 2] : null

  // Calculate overall stats
  const overallAvg = latestExam.subjects.reduce((sum, s) => sum + s.percentage, 0) / latestExam.subjects.length
  
  // Find weak subjects
  const weakSubjects = latestExam.subjects.filter((s) => s.percentage < 50)
  const mediumSubjects = latestExam.subjects.filter((s) => s.percentage >= 50 && s.percentage < 75)
  const strongSubjects = latestExam.subjects.filter((s) => s.percentage >= 75)

  // Overall performance insight
  if (overallAvg >= 75) {
    insights.push({
      type: "success",
      icon: CheckCircle2,
      title: "Excellent Performance",
      message: `Your overall average of ${overallAvg.toFixed(1)}% shows strong academic standing. Keep up the great work!`,
    })
  } else if (overallAvg >= 50) {
    insights.push({
      type: "info",
      icon: Target,
      title: "Room for Improvement",
      message: `Your overall average is ${overallAvg.toFixed(1)}%. Focus on weak areas to push your scores higher.`,
    })
  } else {
    insights.push({
      type: "warning",
      icon: AlertTriangle,
      title: "Needs Attention",
      message: `Your overall average of ${overallAvg.toFixed(1)}% indicates you need to dedicate more study time across subjects.`,
    })
  }

  // Weak subjects insight
  if (weakSubjects.length > 0) {
    insights.push({
      type: "warning",
      icon: AlertTriangle,
      title: "Focus Areas Detected",
      message: `${weakSubjects.map((s) => s.name).join(", ")} ${weakSubjects.length === 1 ? "needs" : "need"} immediate attention. Consider allocating extra study time.`,
      subjects: weakSubjects.map((s) => s.name),
    })
  }

  // Trend analysis
  if (previousExam) {
    const prevAvg = previousExam.subjects.reduce((sum, s) => sum + s.percentage, 0) / previousExam.subjects.length
    const trend = overallAvg - prevAvg

    if (trend > 5) {
      insights.push({
        type: "success",
        icon: TrendingUp,
        title: "Positive Trend",
        message: `Great progress! Your overall performance improved by ${trend.toFixed(1)}% compared to the previous exam.`,
      })
    } else if (trend < -5) {
      insights.push({
        type: "warning",
        icon: TrendingDown,
        title: "Performance Dip Detected",
        message: `Your performance dropped by ${Math.abs(trend).toFixed(1)}%. Review your study habits and consider adjusting your approach.`,
      })
    }

    // Find most improved and most declined subjects
    const subjectChanges = latestExam.subjects.map((s) => {
      const prev = previousExam.subjects.find((ps) => ps.name === s.name)
      return {
        name: s.name,
        change: prev ? s.percentage - prev.percentage : 0,
      }
    }).filter((s) => s.change !== 0)

    const mostImproved = subjectChanges.find((s) => s.change === Math.max(...subjectChanges.map((x) => x.change)))
    const mostDeclined = subjectChanges.find((s) => s.change === Math.min(...subjectChanges.map((x) => x.change)))

    if (mostImproved && mostImproved.change > 5) {
      insights.push({
        type: "success",
        icon: TrendingUp,
        title: "Most Improved Subject",
        message: `${mostImproved.name} showed the best improvement with a ${mostImproved.change.toFixed(1)}% increase. Your efforts are paying off!`,
      })
    }

    if (mostDeclined && mostDeclined.change < -5) {
      insights.push({
        type: "warning",
        icon: TrendingDown,
        title: "Subject Requiring Attention",
        message: `${mostDeclined.name} declined by ${Math.abs(mostDeclined.change).toFixed(1)}%. Consider revising fundamentals and practicing more problems.`,
      })
    }
  }

  // Strong subjects celebration
  if (strongSubjects.length > 0) {
    insights.push({
      type: "info",
      icon: CheckCircle2,
      title: "Strong Foundation",
      message: `You're excelling in ${strongSubjects.map((s) => s.name).join(", ")}. Maintain your revision schedule to keep these scores high.`,
    })
  }

  // Study tip
  insights.push({
    type: "tip",
    icon: Lightbulb,
    title: "Study Tip",
    message: getRandomStudyTip(),
  })

  return insights
}

function getRandomStudyTip() {
  const tips = [
    "Use the Pomodoro technique: 25 minutes of focused study followed by a 5-minute break.",
    "Teach concepts to others - explaining helps solidify your understanding.",
    "Practice active recall by testing yourself instead of just re-reading notes.",
    "Create mind maps to visualize connections between topics.",
    "Review material before sleep - it helps with memory consolidation.",
    "Break complex problems into smaller, manageable steps.",
    "Use spaced repetition for subjects requiring memorization.",
    "Take handwritten notes - it improves retention compared to typing.",
  ]
  return tips[Math.floor(Math.random() * tips.length)]
}

function getInsightStyle(type) {
  switch (type) {
    case "success":
      return {
        bg: "bg-success/10",
        border: "border-success/20",
        icon: "text-success",
        badge: "bg-success/20 text-success border-success/30",
      }
    case "warning":
      return {
        bg: "bg-destructive/10",
        border: "border-destructive/20",
        icon: "text-destructive",
        badge: "bg-destructive/20 text-destructive border-destructive/30",
      }
    case "tip":
      return {
        bg: "bg-primary/10",
        border: "border-primary/20",
        icon: "text-primary",
        badge: "bg-primary/20 text-primary border-primary/30",
      }
    default:
      return {
        bg: "bg-secondary",
        border: "border-border",
        icon: "text-muted-foreground",
        badge: "bg-secondary text-muted-foreground",
      }
  }
}

export function AIInsights({ exams }) {
  const insights = generateInsights(exams)

  if (insights.length === 0) {
    return (
      <Card className="border-border/50 bg-card">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-foreground">AI Insights</CardTitle>
              <CardDescription>Intelligent analysis of your academic performance</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex h-[200px] items-center justify-center text-muted-foreground">
            Add exam results to receive personalized insights
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border/50 bg-card">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-foreground">AI Insights</CardTitle>
            <CardDescription>Intelligent analysis of your academic performance</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {insights.map((insight, index) => {
          const style = getInsightStyle(insight.type)
          const Icon = insight.icon
          
          return (
            <div
              key={index}
              className={`rounded-lg border p-4 ${style.bg} ${style.border}`}
            >
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 ${style.icon}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-foreground">{insight.title}</p>
                    {insight.type === "success" && (
                      <Badge variant="outline" className={style.badge}>Positive</Badge>
                    )}
                    {insight.type === "warning" && (
                      <Badge variant="outline" className={style.badge}>Action Needed</Badge>
                    )}
                    {insight.type === "tip" && (
                      <Badge variant="outline" className={style.badge}>Tip</Badge>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{insight.message}</p>
                </div>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
