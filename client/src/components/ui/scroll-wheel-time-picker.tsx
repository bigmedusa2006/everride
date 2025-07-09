"use client"

import * as React from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type ScrollWheelTimePickerProps = {
    value: string;
    onChange: (time: string) => void;
    className?: string;
}

export function ScrollWheelTimePicker({ value, onChange, className }: ScrollWheelTimePickerProps) {
    const timeOptions = Array.from({ length: 48 }, (_, i) => {
        const hour = Math.floor(i / 2);
        const minute = (i % 2) * 30;
        const date = new Date();
        date.setHours(hour, minute, 0, 0);
        
        const displayHour = date.getHours() % 12 === 0 ? 12 : date.getHours() % 12;
        const displayMinute = date.getMinutes().toString().padStart(2, '0');
        const period = date.getHours() >= 12 ? 'PM' : 'AM';

        return `${displayHour}:${displayMinute} ${period}`;
    });

  return (
    <Select onValueChange={onChange} value={value}>
      <SelectTrigger className="w-full h-12 text-base">
        <SelectValue placeholder="Select a time" />
      </SelectTrigger>
      <SelectContent>
        {timeOptions.map((time) => (
          <SelectItem key={time} value={time}>
            {time}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
