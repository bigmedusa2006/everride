
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Clock, AlertTriangle } from "lucide-react"

interface ShiftExtensionDialogProps {
  open: boolean
  onExtend: () => void
  onDecline: () => void
  currentHours: number
  maxAllowedHours: number
}

export function ShiftExtensionDialog({ 
  open, 
  onExtend, 
  onDecline, 
  currentHours, 
  maxAllowedHours 
}: ShiftExtensionDialogProps) {
  const extensionHours = Math.min(2, maxAllowedHours - currentHours)
  
  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="max-w-md mx-auto bg-card">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Clock className="w-5 h-5 text-primary" />
            Shift Duration Complete
          </DialogTitle>
          <DialogDescription>
            Your planned {currentHours}-hour shift is complete. Would you like to extend?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          <div className="flex items-center gap-2 p-3 bg-amber-100/10 dark:bg-amber-900/20 rounded-lg border border-amber-500/20">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span className="text-sm text-amber-600 dark:text-amber-400">
              BC Commercial Vehicle Rules: Max {maxAllowedHours}h per shift
            </span>
          </div>

          <div className="text-center space-y-2">
            <div className="text-2xl font-bold text-primary">+{extensionHours} Hours</div>
            <div className="text-sm text-muted-foreground">
              Extension available (Total: {currentHours + extensionHours}h)
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-4">
            <Button 
              variant="outline"
              onClick={onDecline}
              className="h-12"
            >
              End Shift
            </Button>
            <Button 
              onClick={onExtend}
              className="h-12"
            >
              Extend +{extensionHours}h
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
