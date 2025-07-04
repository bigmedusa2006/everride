"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ChevronDown,
  Calendar,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import { useBookingStore } from "@/stores/bookingStore";
import { useToast } from "@/hooks/use-toast";
import type { Booking, BookingStatus } from "@shared/schema";

interface BookingStatusMenuProps {
  booking: Booking;
  onComplete?: (booking: Booking) => void;
}

export function BookingStatusMenu({
  booking,
  onComplete,
}: BookingStatusMenuProps) {
  const { updateBooking } = useBookingStore();
  const { toast } = useToast();

  const statusConfig: Record<
    BookingStatus,
    { icon: React.ElementType; color: string; label: string }
  > = {
    scheduled: { icon: Calendar, color: "bg-blue-500", label: "Scheduled" },
    confirmed: { icon: CheckCircle, color: "bg-green-500", label: "Confirmed" },
    completed: {
      icon: CheckCircle,
      color: "bg-emerald-500",
      label: "Completed",
    },
    cancelled: { icon: XCircle, color: "bg-red-500", label: "Cancelled" },
    "no-show": {
      icon: AlertTriangle,
      color: "bg-orange-500",
      label: "No Show",
    },
  };

  const currentStatus = statusConfig[booking.status] || statusConfig.scheduled;

  const handleStatusChange = async (newStatus: BookingStatus) => {
    try {
      const updatedBooking = { ...booking, status: newStatus };
      await updateBooking(booking.id, updatedBooking);

      if (newStatus === "completed" && onComplete) {
        onComplete(booking);
      }

      toast({
        title: "Status Updated",
        description: `Booking status changed to ${statusConfig[newStatus]?.label || newStatus}`,
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Could not update booking status",
        variant: "destructive",
      });
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <DropdownMenu>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0 flex items-center justify-center">
                <div
                  className={`w-3 h-3 rounded-full ${currentStatus.color}`}
                />
                <ChevronDown className="h-3 w-3 ml-1" />
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <DropdownMenuContent align="end" className="w-40">
            {(Object.keys(statusConfig) as BookingStatus[]).map((status) => {
              const config = statusConfig[status];
              const Icon = config.icon;
              return (
                <DropdownMenuItem
                  key={status}
                  onClick={() => handleStatusChange(status)}
                  className="flex items-center gap-2"
                >
                  <div className={`w-2 h-2 rounded-full ${config.color}`} />
                  <Icon className="h-3 w-3" />
                  <span className="text-xs">{config.label}</span>
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
        <TooltipContent>Change Status</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
