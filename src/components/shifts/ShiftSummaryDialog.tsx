
'use client';

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Copy, X } from "lucide-react"
import type { ShiftSummaryData } from "@/contexts/DriverSessionContext"

interface ShiftSummaryDialogProps {
  open: boolean
  onClose: () => void
  onConfirmClose: () => void
  summaryData: ShiftSummaryData
}

export function ShiftSummaryDialog({ 
  open, 
  onClose, 
  onConfirmClose, 
  summaryData 
}: ShiftSummaryDialogProps) {

  const handleCopySummary = () => {
    const summaryText = `
🚗 SHIFT SUMMARY 
📅 ${new Date(summaryData.shiftStartTime).toLocaleDateString()}

⏱️ Time Breakdown:
• Total Shift Time: ${summaryData.totalTime}
• Active Earning Time: ${summaryData.activeTime}
• Break Time: ${summaryData.breakTime}
• Efficiency: ${((parseFloat(summaryData.activeTime.split(':')[0]) + parseFloat(summaryData.activeTime.split(':')[1])/60) / (parseFloat(summaryData.totalTime.split(':')[0]) + parseFloat(summaryData.totalTime.split(':')[1])/60) * 100).toFixed(1)}%

📊 Performance:
• Total Rides: ${summaryData.totalTrips}
• Gross Earnings: $${summaryData.totalEarnings.toFixed(2)}
• Total Expenses: $${summaryData.totalExpenses.toFixed(2)}
• Net Earnings: $${summaryData.netEarnings.toFixed(2)}
• Net Hourly Rate: $${summaryData.hourlyRate.toFixed(2)}/hr

🎯 Goals:
• Daily Goal: $${summaryData.dailyGoal.toFixed(2)}
• Remaining: $${Math.max(0, summaryData.dailyGoal - summaryData.netEarnings).toFixed(2)}
• Progress: ${(summaryData.netEarnings / summaryData.dailyGoal * 100).toFixed(1)}%

💰 Tips & Earnings:
• Total Tips: $${summaryData.totalTips.toFixed(2)}
• Average Trip Value: $${summaryData.avgTripValue.toFixed(2)}
    `.trim()

    navigator.clipboard.writeText(summaryText)
  }

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="max-w-lg mx-auto bg-card">
        <DialogHeader className="relative">
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-6 w-6 p-0"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
          <DialogTitle className="text-xl font-bold pr-8">
            🚗 Shift Summary
          </DialogTitle>
          <div className="text-sm text-muted-foreground">
            {new Date(summaryData.shiftStartTime).toLocaleDateString()} • {summaryData.totalTime}
          </div>
        </DialogHeader>

        <div className="space-y-4 max-h-96 overflow-y-auto p-1">
          {/* Time Breakdown */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3">⏱️ Time Breakdown</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-muted-foreground">Total Shift</div>
                  <div className="font-bold">{summaryData.totalTime}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Active Earning</div>
                  <div className="font-bold text-chart-2">{summaryData.activeTime}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Financial Summary */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3">💰 Financial Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Gross Earnings:</span>
                  <span className="font-bold text-chart-2">${summaryData.totalEarnings.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Expenses:</span>
                  <span className="font-bold text-destructive">${summaryData.totalExpenses.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg">
                  <span className="font-semibold">Net Earnings:</span>
                  <span className="font-bold">${summaryData.netEarnings.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Hourly Rate:</span>
                  <span className="font-bold">${summaryData.hourlyRate.toFixed(2)}/hr</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3">📊 Performance</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-muted-foreground">Total Trips</div>
                  <div className="font-bold">{summaryData.totalTrips}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Avg Trip Value</div>
                  <div className="font-bold">${summaryData.avgTripValue.toFixed(2)}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Goal Progress */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3">🎯 Goal Progress</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Daily Goal:</span>
                  <span className="font-bold">${summaryData.dailyGoal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Progress:</span>
                  <span className="font-bold">
                    {(summaryData.netEarnings / summaryData.dailyGoal * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button 
            variant="outline"
            onClick={handleCopySummary}
            className="flex items-center gap-2"
          >
            <Copy className="w-4 h-4" />
            Copy
          </Button>
          <Button 
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Continue Viewing
          </Button>
          <Button 
            onClick={onConfirmClose}
            className="flex-1 bg-destructive hover:bg-destructive/90 text-destructive-foreground"
          >
            Close & Reset
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
