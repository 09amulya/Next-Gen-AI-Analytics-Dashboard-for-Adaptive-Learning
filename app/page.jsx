"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { MarksInputForm } from "@/components/marks-input-form"
import { PerformanceChart } from "@/components/performance-chart"
import { SubjectAnalysis } from "@/components/subject-analysis"
import { StudyPlan } from "@/components/study-plan"
import { AIInsights } from "@/components/ai-insights"
import { StatsOverview } from "@/components/stats-overview"
import { ExamHistory } from "@/components/exam-history"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { PlusCircle, LayoutDashboard, Target, Clock, Sparkles, X } from "lucide-react"

// Sample data for demonstration
const sampleExams = [
  {
    id: 1,
    name: "Mid-Term Exam",
    date: "2024-02-15T00:00:00.000Z",
    maxMarks: 100,
    subjects: [
      { name: "Mathematics", marks: 72, percentage: 72 },
      { name: "Physics", marks: 65, percentage: 65 },
      { name: "Chemistry", marks: 58, percentage: 58 },
      { name: "English", marks: 85, percentage: 85 },
      { name: "Computer Science", marks: 92, percentage: 92 },
    ],
  },
  {
    id: 2,
    name: "Final Exam",
    date: "2024-05-20T00:00:00.000Z",
    maxMarks: 100,
    subjects: [
      { name: "Mathematics", marks: 78, percentage: 78 },
      { name: "Physics", marks: 70, percentage: 70 },
      { name: "Chemistry", marks: 52, percentage: 52 },
      { name: "English", marks: 88, percentage: 88 },
      { name: "Computer Science", marks: 95, percentage: 95 },
    ],
  },
]

export default function Home() {
  const [exams, setExams] = useState([])
  const [showInputForm, setShowInputForm] = useState(false)
  const [selectedExamId, setSelectedExamId] = useState(null)
  const [activeTab, setActiveTab] = useState("dashboard")

  // Load sample data on mount
  useEffect(() => {
    // Check if user has existing data, otherwise load sample
    const savedExams = localStorage.getItem("studyai-exams")
    if (savedExams) {
      setExams(JSON.parse(savedExams))
    } else {
      setExams(sampleExams)
    }
  }, [])

  // Save exams to localStorage whenever they change
  useEffect(() => {
    if (exams.length > 0) {
      localStorage.setItem("studyai-exams", JSON.stringify(exams))
    }
  }, [exams])

  const handleAddExam = (examData) => {
    setExams([...exams, examData])
    setShowInputForm(false)
    setSelectedExamId(examData.id)
  }

  const handleDeleteExam = (examId) => {
    setExams(exams.filter((e) => e.id !== examId))
    if (selectedExamId === examId) {
      setSelectedExamId(null)
    }
  }

  const handleSelectExam = (examId) => {
    setSelectedExamId(examId === selectedExamId ? null : examId)
  }

  const handleLoadSampleData = () => {
    setExams(sampleExams)
  }

  const handleClearData = () => {
    setExams([])
    localStorage.removeItem("studyai-exams")
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
              Academic Performance Dashboard
            </h2>
            <p className="mt-1 text-muted-foreground">
              Track your progress and get personalized study recommendations
            </p>
          </div>
          <div className="flex gap-3">
            {exams.length === 0 && (
              <Button variant="outline" onClick={handleLoadSampleData}>
                Load Sample Data
              </Button>
            )}
            {exams.length > 0 && (
              <Button variant="outline" onClick={handleClearData}>
                Clear All Data
              </Button>
            )}
            <Button onClick={() => setShowInputForm(!showInputForm)} className="gap-2">
              {showInputForm ? (
                <>
                  <X className="h-4 w-4" />
                  Cancel
                </>
              ) : (
                <>
                  <PlusCircle className="h-4 w-4" />
                  Add Exam Results
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Input Form */}
        {showInputForm && (
          <div className="mb-8">
            <MarksInputForm onSubmit={handleAddExam} existingExams={exams} />
          </div>
        )}

        {/* Stats Overview */}
        <section id="dashboard" className="mb-8">
          <StatsOverview exams={exams} />
        </section>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-none lg:flex">
            <TabsTrigger value="dashboard" className="gap-2">
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden sm:inline">Performance</span>
            </TabsTrigger>
            <TabsTrigger value="analysis" className="gap-2">
              <Target className="h-4 w-4" />
              <span className="hidden sm:inline">Analysis</span>
            </TabsTrigger>
            <TabsTrigger value="study-plan" className="gap-2">
              <Clock className="h-4 w-4" />
              <span className="hidden sm:inline">Study Plan</span>
            </TabsTrigger>
            <TabsTrigger value="insights" className="gap-2">
              <Sparkles className="h-4 w-4" />
              <span className="hidden sm:inline">AI Insights</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <PerformanceChart exams={exams} />
              </div>
              <div>
                <ExamHistory
                  exams={exams}
                  onDelete={handleDeleteExam}
                  onSelect={handleSelectExam}
                  selectedExamId={selectedExamId}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6" id="analysis">
            <SubjectAnalysis exams={exams} />
          </TabsContent>

          <TabsContent value="study-plan" className="space-y-6" id="study-plan">
            <StudyPlan exams={exams} />
          </TabsContent>

          <TabsContent value="insights" className="space-y-6" id="insights">
            <AIInsights exams={exams} />
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        {exams.length > 0 && activeTab === "dashboard" && (
          <section className="mt-8 grid gap-6 lg:grid-cols-2">
            <div className="rounded-xl border border-border/50 bg-card p-6">
              <h3 className="text-lg font-semibold text-foreground">Quick Analysis</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                View detailed breakdowns of your subject performance
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setActiveTab("analysis")}
              >
                View Subject Analysis
              </Button>
            </div>
            <div className="rounded-xl border border-border/50 bg-card p-6">
              <h3 className="text-lg font-semibold text-foreground">Study Recommendations</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Get a personalized study plan based on your performance
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setActiveTab("study-plan")}
              >
                View Study Plan
              </Button>
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="mt-12 border-t border-border/50 pt-8 text-center text-sm text-muted-foreground">
          <p>StudyAI - AI-Based Adaptive Learning Dashboard</p>
          <p className="mt-1">Analyze your performance and get personalized study recommendations</p>
        </footer>
      </main>
    </div>
  )
}
