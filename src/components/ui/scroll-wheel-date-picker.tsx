"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

type ScrollWheelDatePickerProps = {
    value?: Date;
    onChange: (date?: Date) => void;
    className?: string;
    minDate?: Date;
    maxDate?: Date;
}

export function ScrollWheelDatePicker({ value, onChange, className, minDate, maxDate }: ScrollWheelDatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal h-12 text-base",
            !value && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={value}
          onSelect={onChange}
          initialFocus
          disabled={(date) =>
            (minDate && date < minDate) || (maxDate && date > maxDate) || false
          }
        />
      </PopoverContent>
    </Popover>
  )
}
