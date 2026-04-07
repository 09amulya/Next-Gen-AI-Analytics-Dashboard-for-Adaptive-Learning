"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

const COLORS = ["#7c8cff", "#4ade80", "#fbbf24", "#f87171", "#a78bfa"]

export function PerformanceChart({ exams }) {
  if (!exams || exams.length === 0) {
    return (
      <Card className="border-border/50 bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">Performance Over Time</CardTitle>
          <CardDescription>Track your academic progress across exams</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-[300px] items-center justify-center text-muted-foreground">
            Add exam results to see your performance chart
          </div>
        </CardContent>
      </Card>
    )
  }

  // Get all unique subjects across all exams
  const allSubjects = [...new Set(exams.flatMap((exam) => exam.subjects.map((s) => s.name)))]

  // Transform data for the chart
  const chartData = exams.map((exam) => {
    const dataPoint = { name: exam.name }
    exam.subjects.forEach((subject) => {
      dataPoint[subject.name] = subject.percentage
    })
    // Calculate overall average
    const avg = exam.subjects.reduce((sum, s) => sum + s.percentage, 0) / exam.subjects.length
    dataPoint["Overall"] = Math.round(avg * 10) / 10
    return dataPoint
  })

  // Calculate trend
  const latestOverall = chartData[chartData.length - 1]?.Overall || 0
  const previousOverall = chartData.length > 1 ? chartData[chartData.length - 2]?.Overall : latestOverall
  const trend = latestOverall - previousOverall

  return (
    <Card className="border-border/50 bg-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-foreground">Performance Over Time</CardTitle>
            <CardDescription>Track your academic progress across exams</CardDescription>
          </div>
          {exams.length > 1 && (
            <div className="flex items-center gap-2 rounded-lg bg-secondary px-3 py-2">
              {trend > 0 ? (
                <TrendingUp className="h-4 w-4 text-success" />
              ) : trend < 0 ? (
                <TrendingDown className="h-4 w-4 text-destructive" />
              ) : (
                <Minus className="h-4 w-4 text-muted-foreground" />
              )}
              <span className={`text-sm font-medium ${trend > 0 ? "text-success" : trend < 0 ? "text-destructive" : "text-muted-foreground"}`}>
                {trend > 0 ? "+" : ""}{trend.toFixed(1)}%
              </span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="name" 
              stroke="#666" 
              fontSize={12}
              tickLine={false}
            />
            <YAxis 
              stroke="#666" 
              fontSize={12}
              tickLine={false}
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(23, 23, 33, 0.95)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
                color: "#fff",
              }}
              formatter={(value) => [`${value}%`, ""]}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="Overall"
              stroke="#7c8cff"
              strokeWidth={3}
              dot={{ r: 6, fill: "#7c8cff" }}
              activeDot={{ r: 8 }}
            />
            {allSubjects.slice(0, 4).map((subject, index) => (
              <Line
                key={subject}
                type="monotone"
                dataKey={subject}
                stroke={COLORS[(index + 1) % COLORS.length]}
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ r: 4, fill: COLORS[(index + 1) % COLORS.length] }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
