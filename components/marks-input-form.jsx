"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Trash2, Upload, FileText } from "lucide-react"

const defaultSubjects = [
  { name: "Mathematics", marks: "" },
  { name: "Physics", marks: "" },
  { name: "Chemistry", marks: "" },
  { name: "English", marks: "" },
  { name: "Computer Science", marks: "" },
]

export function MarksInputForm({ onSubmit, existingExams = [] }) {
  const [examName, setExamName] = useState("")
  const [subjects, setSubjects] = useState(defaultSubjects)
  const [maxMarks, setMaxMarks] = useState(100)

  const handleSubjectChange = (index, field, value) => {
    const updated = [...subjects]
    updated[index][field] = value
    setSubjects(updated)
  }

  const addSubject = () => {
    setSubjects([...subjects, { name: "", marks: "" }])
  }

  const removeSubject = (index) => {
    if (subjects.length > 1) {
      setSubjects(subjects.filter((_, i) => i !== index))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const examData = {
      id: Date.now(),
      name: examName || `Exam ${existingExams.length + 1}`,
      date: new Date().toISOString(),
      maxMarks,
      subjects: subjects
        .filter((s) => s.name && s.marks)
        .map((s) => ({
          name: s.name,
          marks: parseInt(s.marks, 10),
          percentage: (parseInt(s.marks, 10) / maxMarks) * 100,
        })),
    }
    onSubmit(examData)
    setExamName("")
    setSubjects(defaultSubjects)
  }

  return (
    <Card className="border-border/50 bg-card">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-foreground">Add Exam Results</CardTitle>
            <CardDescription>Enter your marks manually or upload a marksheet</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="examName" className="text-foreground">Exam Name</Label>
              <Input
                id="examName"
                placeholder="e.g., Mid-Term Exam"
                value={examName}
                onChange={(e) => setExamName(e.target.value)}
                className="bg-secondary border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxMarks" className="text-foreground">Maximum Marks</Label>
              <Input
                id="maxMarks"
                type="number"
                value={maxMarks}
                onChange={(e) => setMaxMarks(parseInt(e.target.value, 10))}
                className="bg-secondary border-border"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-foreground">Subjects & Marks</Label>
              <Button type="button" variant="outline" size="sm" onClick={addSubject} className="gap-1">
                <Plus className="h-4 w-4" />
                Add Subject
              </Button>
            </div>
            
            <div className="space-y-3">
              {subjects.map((subject, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Input
                    placeholder="Subject name"
                    value={subject.name}
                    onChange={(e) => handleSubjectChange(index, "name", e.target.value)}
                    className="flex-1 bg-secondary border-border"
                  />
                  <Input
                    type="number"
                    placeholder="Marks"
                    value={subject.marks}
                    onChange={(e) => handleSubjectChange(index, "marks", e.target.value)}
                    className="w-24 bg-secondary border-border"
                    max={maxMarks}
                    min={0}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeSubject(index)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <Button type="submit" className="flex-1">
              <Upload className="mr-2 h-4 w-4" />
              Submit Results
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
