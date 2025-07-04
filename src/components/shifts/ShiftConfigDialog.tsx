
'use client';

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X } from "lucide-react"

export interface ShiftConfig {
  plannedDurationHours: number
  dailyGoal: number
  driverName: string
  vehicleOdometer?: number
  fuelLevel?: number
}

interface ShiftConfigDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onStartShift: (config: ShiftConfig) => void
}

export function ShiftConfigDialog({ open, onOpenChange, onStartShift }: ShiftConfigDialogProps) {
  const [plannedDurationHours, setPlannedDurationHours] = useState(8)
  const [customDuration, setCustomDuration] = useState("")
  const [isCustomMode, setIsCustomMode] = useState(false)

  const handleStartShift = () => {
    const finalDuration = isCustomMode ? parseFloat(customDuration) || 8 : plannedDurationHours
    onStartShift({
      plannedDurationHours: finalDuration,
      dailyGoal: 200, // Default goal
      driverName: "", // Default empty
    })
    onOpenChange(false)
  }

  const handleCustomDurationChange = (value: string) => {
    setCustomDuration(value)
    if (value && !isNaN(parseFloat(value))) {
      setPlannedDurationHours(parseFloat(value))
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[96vw] max-w-sm bg-card border border-border text-foreground shadow-lg p-4 [&>button]:hidden">
        <DialogHeader className="relative">
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-8 w-8 p-0 text-muted-foreground hover:bg-muted rounded-full"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4" />
          </Button>
          <DialogTitle className="text-base font-semibold text-left pr-8 mb-2">
            Start New Shift
          </DialogTitle>
          <DialogDescription className="text-left text-xs text-muted-foreground">
            Select duration (2-14h). Can extend later up to 14h max.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          {/* BC Rules Section */}
          <div className="bg-primary/10 rounded-lg p-3 border border-primary/30">
            <div className="text-xs font-medium text-primary mb-2">BC Commercial Rules:</div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs text-primary/90">
                <span className="w-3 h-3 text-accent flex-shrink-0">•</span>
                Max 13h driving in 14h window
              </div>
              <div className="flex items-center gap-2 text-xs text-primary/90">
                <span className="w-3 h-3 text-accent flex-shrink-0">•</span>
                8h rest required after shift
              </div>
            </div>
          </div>

          {/* Duration Selection */}
          <div>
            <div className="text-sm font-medium text-card-foreground mb-3">
              Select Duration (Hours)
            </div>
            <div className="grid grid-cols-3 gap-2">
              {/* Duration buttons - optimized for mobile touch */}
              {[2, 4, 6, 8, 10, 12].map((hours) => (
                <Button
                  key={hours}
                  type="button"
                  variant="ghost"
                  className={`h-12 text-base font-semibold rounded-lg border transition-all ${
                    !isCustomMode && plannedDurationHours === hours 
                      ? 'bg-accent text-accent-foreground border-accent shadow-md' 
                      : 'bg-muted/50 text-muted-foreground border-border hover:bg-muted'
                  }`}
                  onClick={() => {
                    setPlannedDurationHours(hours)
                    setIsCustomMode(false)
                    setCustomDuration("")
                  }}
                >
                  {hours}h
                </Button>
              ))}

              {/* 14h Max button spanning full width */}
              <Button
                type="button"
                variant="ghost"
                className={`h-12 text-base font-semibold rounded-lg border transition-all col-span-3 ${
                  !isCustomMode && plannedDurationHours === 14 
                    ? 'bg-accent text-accent-foreground border-accent shadow-md' 
                    : 'bg-muted/50 text-muted-foreground border-border hover:bg-muted'
                }`}
                onClick={() => {
                  setPlannedDurationHours(14)
                  setIsCustomMode(false)
                  setCustomDuration("")
                }}
              >
                14h (Maximum)
              </Button>
            </div>

            {/* Custom Duration Input */}
            <div className="mt-4 p-3 bg-muted/30 rounded-lg border border-border">
              <Label htmlFor="custom-duration" className="text-sm font-medium text-card-foreground mb-2 block">
                Custom Duration
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="custom-duration"
                  type="number"
                  min="0.5"
                  max="14"
                  step="0.5"
                  value={customDuration}
                  onChange={(e) => {
                    handleCustomDurationChange(e.target.value)
                    setIsCustomMode(true)
                  }}
                  placeholder="Enter hours (0.5-14)"
                  className={`flex-1 h-10 text-sm ${
                    isCustomMode 
                      ? 'border-accent bg-accent/10' 
                      : 'bg-background'
                  }`}
                />
                <span className="text-sm text-muted-foreground">hours</span>
              </div>
              {isCustomMode && customDuration && (
                <div className="mt-2 text-xs text-muted-foreground">
                  Selected: {customDuration} hours
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-4">
            <Button 
              variant="outline"
              onClick={() => onOpenChange(false)} 
              className="h-12 bg-card border border-border text-card-foreground hover:bg-muted font-medium"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleStartShift} 
              className="h-12 bg-accent hover:bg-accent/90 text-accent-foreground font-medium"
            >
              Start Shift
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
