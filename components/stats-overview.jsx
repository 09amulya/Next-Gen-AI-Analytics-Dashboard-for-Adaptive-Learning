"use client"

import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown, BookOpen, Award, Target, Clock } from "lucide-react"

export function StatsOverview({ exams }) {
  if (!exams || exams.length === 0) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Overall Average", icon: Award, value: "--", sub: "No data yet" },
          { label: "Total Exams", icon: BookOpen, value: "0", sub: "Add your first exam" },
          { label: "Subjects Tracked", icon: Target, value: "0", sub: "Start tracking" },
          { label: "Study Time/Day", icon: Clock, value: "--", sub: "Generate a plan" },
        ].map((stat, index) => (
          <Card key={index} className="border-border/50 bg-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
              </div>
              <div className="mt-4">
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="mt-1 text-xs text-muted-foreground/70">{stat.sub}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const latestExam = exams[exams.length - 1]
  const previousExam = exams.length > 1 ? exams[exams.length - 2] : null

  // Calculate stats
  const latestAvg = latestExam.subjects.reduce((sum, s) => sum + s.percentage, 0) / latestExam.subjects.length
  const previousAvg = previousExam
    ? previousExam.subjects.reduce((sum, s) => sum + s.percentage, 0) / previousExam.subjects.length
    : latestAvg

  const trend = latestAvg - previousAvg
  const allSubjects = [...new Set(exams.flatMap((e) => e.subjects.map((s) => s.name)))]
  
  // Calculate study time
  const weakSubjects = latestExam.subjects.filter((s) => s.percentage < 50).length
  const mediumSubjects = latestExam.subjects.filter((s) => s.percentage >= 50 && s.percentage < 75).length
  const strongSubjects = latestExam.subjects.filter((s) => s.percentage >= 75).length
  const totalStudyMins = weakSubjects * 120 + mediumSubjects * 75 + strongSubjects * 45

  const formatTime = (mins) => {
    const h = Math.floor(mins / 60)
    const m = mins % 60
    if (h > 0 && m > 0) return `${h}h ${m}m`
    if (h > 0) return `${h}h`
    return `${m}m`
  }

  const stats = [
    {
      label: "Overall Average",
      icon: Award,
      value: `${latestAvg.toFixed(1)}%`,
      sub: previousExam ? `${trend >= 0 ? "+" : ""}${trend.toFixed(1)}% from last` : "First exam",
      trend: previousExam ? trend : null,
    },
    {
      label: "Total Exams",
      icon: BookOpen,
      value: exams.length.toString(),
      sub: `Latest: ${latestExam.name}`,
      trend: null,
    },
    {
      label: "Subjects Tracked",
      icon: Target,
      value: allSubjects.length.toString(),
      sub: `${weakSubjects} weak, ${mediumSubjects} medium, ${strongSubjects} strong`,
      trend: null,
    },
    {
      label: "Recommended Study",
      icon: Clock,
      value: formatTime(totalStudyMins),
      sub: "Daily study time",
      trend: null,
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index} className="border-border/50 bg-card transition-colors hover:border-primary/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <stat.icon className="h-5 w-5 text-primary" />
              </div>
              {stat.trend !== null && (
                <div
                  className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs ${
                    stat.trend >= 0 ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
                  }`}
                >
                  {stat.trend >= 0 ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {Math.abs(stat.trend).toFixed(1)}%
                </div>
              )}
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="mt-1 text-xs text-muted-foreground/70">{stat.sub}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
