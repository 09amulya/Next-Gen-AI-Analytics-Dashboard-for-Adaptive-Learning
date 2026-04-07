"use client"

import { GraduationCap, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
            <GraduationCap className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">StudyAI</h1>
            <p className="text-xs text-muted-foreground">Adaptive Learning Dashboard</p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          <a href="#dashboard" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Dashboard
          </a>
          <a href="#analysis" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Analysis
          </a>
          <a href="#study-plan" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Study Plan
          </a>
          <a href="#insights" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Insights
          </a>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Button variant="outline" size="sm">
            Export Report
          </Button>
          <Button size="sm">
            Add Results
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-border/50 bg-background p-4 md:hidden">
          <nav className="flex flex-col gap-4">
            <a href="#dashboard" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Dashboard
            </a>
            <a href="#analysis" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Analysis
            </a>
            <a href="#study-plan" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Study Plan
            </a>
            <a href="#insights" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Insights
            </a>
            <div className="flex gap-3 pt-2">
              <Button variant="outline" size="sm" className="flex-1">
                Export Report
              </Button>
              <Button size="sm" className="flex-1">
                Add Results
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
