"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Minus, Target } from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts"

function getPerformanceLevel(percentage) {
  if (percentage < 50) return { level: "Weak", color: "bg-destructive", textColor: "text-destructive" }
  if (percentage < 75) return { level: "Medium", color: "bg-warning", textColor: "text-warning" }
  return { level: "Strong", color: "bg-success", textColor: "text-success" }
}

function getBarColor(percentage) {
  if (percentage < 50) return "#f87171"
  if (percentage < 75) return "#fbbf24"
  return "#4ade80"
}

export function SubjectAnalysis({ exams }) {
  if (!exams || exams.length === 0) {
    return (
      <Card className="border-border/50 bg-card">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Target className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-foreground">Subject Analysis</CardTitle>
              <CardDescription>Compare your performance across subjects</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex h-[200px] items-center justify-center text-muted-foreground">
            Add exam results to see subject analysis
          </div>
        </CardContent>
      </Card>
    )
  }

  const latestExam = exams[exams.length - 1]
  const previousExam = exams.length > 1 ? exams[exams.length - 2] : null

  // Calculate trends for each subject
  const subjectsWithTrends = latestExam.subjects.map((subject) => {
    const prevSubject = previousExam?.subjects.find((s) => s.name === subject.name)
    const trend = prevSubject ? subject.percentage - prevSubject.percentage : 0
    return {
      ...subject,
      trend,
      ...getPerformanceLevel(subject.percentage),
    }
  })

  // Sort by percentage (weakest first)
  const sortedSubjects = [...subjectsWithTrends].sort((a, b) => a.percentage - b.percentage)

  // Chart data
  const chartData = sortedSubjects.map((s) => ({
    name: s.name.length > 10 ? s.name.substring(0, 10) + "..." : s.name,
    fullName: s.name,
    percentage: s.percentage,
  }))

  return (
    <Card className="border-border/50 bg-card">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Target className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-foreground">Subject Analysis</CardTitle>
            <CardDescription>
              Latest exam: {latestExam.name}
              {previousExam && ` vs ${previousExam.name}`}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Bar Chart */}
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" horizontal={false} />
            <XAxis type="number" domain={[0, 100]} stroke="#666" fontSize={12} tickFormatter={(v) => `${v}%`} />
            <YAxis type="category" dataKey="name" stroke="#666" fontSize={12} width={100} />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(23, 23, 33, 0.95)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
                color: "#fff",
              }}
              formatter={(value, name, props) => [`${value}%`, props.payload.fullName]}
            />
            <Bar dataKey="percentage" radius={[0, 4, 4, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.percentage)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {/* Subject Cards */}
        <div className="space-y-3">
          {sortedSubjects.map((subject, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-lg bg-secondary/50 p-3"
            >
              <div className="flex items-center gap-3">
                <div className={`h-2 w-2 rounded-full ${subject.color}`} />
                <div>
                  <p className="font-medium text-foreground">{subject.name}</p>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">{subject.marks}/{latestExam.maxMarks}</span>
                    <Badge variant="outline" className={subject.textColor}>
                      {subject.level}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-24">
                  <Progress value={subject.percentage} className="h-2" />
                </div>
                <span className="w-12 text-right font-mono text-sm text-foreground">
                  {subject.percentage.toFixed(0)}%
                </span>
                {previousExam && (
                  <div className="flex items-center gap-1">
                    {subject.trend > 0 ? (
                      <TrendingUp className="h-4 w-4 text-success" />
                    ) : subject.trend < 0 ? (
                      <TrendingDown className="h-4 w-4 text-destructive" />
                    ) : (
                      <Minus className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span
                      className={`text-xs ${
                        subject.trend > 0 ? "text-success" : subject.trend < 0 ? "text-destructive" : "text-muted-foreground"
                      }`}
                    >
                      {subject.trend > 0 ? "+" : ""}
                      {subject.trend.toFixed(0)}%
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
