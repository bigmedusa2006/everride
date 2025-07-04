
"use client"

import * as React from "react"
import { useState, useMemo } from "react"
import { format } from "date-fns"
import { DateRange } from "react-day-picker"
import {
  ArrowUpDown,
  Download,
  Search,
  Calendar as CalendarIcon,
  DollarSign,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useDriverSession } from "@/contexts/DriverSessionContext"
import type { Trip } from "@/contexts/DriverSessionContext"


type SortKey = keyof Trip | 'totalFare';

type SortConfig = {
  key: SortKey | null
  direction: "ascending" | "descending"
}

export function EarningsHistoryCard() {
  const { state } = useDriverSession()
  const [searchQuery, setSearchQuery] = useState("")
  const [date, setDate] = React.useState<DateRange | undefined>(undefined)
  const [fareRange, setFareRange] = useState({ min: "", max: "" })
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "startTime",
    direction: "descending",
  })
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const filteredTrips = useMemo(() => {
    let filtered: Trip[] = [...state.currentTrips].filter((trip) => {
      const searchLower = searchQuery.toLowerCase()
      const matchesSearch =
        trip.id.toLowerCase().includes(searchLower) ||
        (trip.pickupLocation || '').toLowerCase().includes(searchLower) ||
        (trip.dropoffLocation || '').toLowerCase().includes(searchLower)

      const tripDate = new Date(trip.startTime)
      const matchesDate =
        !date ||
        !date.from ||
        (tripDate >= date.from &&
          (!date.to || tripDate <= date.to))

      const totalFare = trip.fare + trip.tip
      const minFare = fareRange.min ? parseFloat(fareRange.min) : -Infinity
      const maxFare = fareRange.max ? parseFloat(fareRange.max) : Infinity
      const matchesFare = totalFare >= minFare && totalFare <= maxFare

      return matchesSearch && matchesDate && matchesFare
    })

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aVal: any;
        let bVal: any;
        
        if (sortConfig.key === 'totalFare') {
          aVal = a.fare + a.tip;
          bVal = b.fare + b.tip;
        } else {
          aVal = a[sortConfig.key as keyof Trip];
          bVal = b[sortConfig.key as keyof Trip];
        }

        if (aVal === undefined || bVal === undefined) return 0
        if (aVal < bVal) {
          return sortConfig.direction === "ascending" ? -1 : 1
        }
        if (aVal > bVal) {
          return sortConfig.direction === "ascending" ? 1 : -1
        }
        return 0
      })
    }

    return filtered
  }, [searchQuery, date, fareRange, sortConfig, state.currentTrips])

  const requestSort = (key: SortKey) => {
    let direction: "ascending" | "descending" = "ascending"
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending"
    }
    setSortConfig({ key, direction })
  }

  const handleExport = () => {
    const headers = ['Trip ID', 'Date', 'Time', 'Pickup', 'Dropoff', 'Base Fare', 'Tip', 'Total', 'Duration (min)', 'Type', 'Notes']
    const rows = filteredTrips.map(trip => [
      trip.id,
      format(new Date(trip.startTime), "yyyy-MM-dd"),
      format(new Date(trip.startTime), "HH:mm"),
      `"${(trip.pickupLocation || '').replace(/"/g, '""')}"`,
      `"${(trip.dropoffLocation || '').replace(/"/g, '""')}"`,
      trip.fare.toFixed(2),
      trip.tip.toFixed(2),
      (trip.fare + trip.tip).toFixed(2),
      trip.durationSeconds ? Math.round(trip.durationSeconds / 60) : '',
      trip.designationType,
      trip.notes ? `"${trip.notes.replace(/"/g, '""')}"` : ''
    ].join(','))

    const csvContent = [headers.join(','), ...rows].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `earnings-history-${format(new Date(), "yyyy-MM-dd")}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const paginatedTrips = filteredTrips.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )
  const totalPages = Math.ceil(filteredTrips.length / itemsPerPage)

  const totalEarnings = filteredTrips.reduce((sum, trip) => sum + trip.fare + trip.tip, 0)
  const totalTrips = filteredTrips.length
  const averagePerTrip = totalTrips > 0 ? totalEarnings / totalTrips : 0

  return (
    <div className="space-y-4">
      {/* Summary Stats - Compact for mobile */}
      <div className="grid grid-cols-3 gap-2">
        <Card className="border-0 shadow-none bg-background/50">
          <CardContent className="p-3">
            <div className="flex flex-col items-center gap-1">
              <DollarSign className="h-4 w-4 text-chart-2" />
              <span className="text-xs text-muted-foreground">Earnings</span>
              <span className="text-sm font-semibold text-chart-2">${totalEarnings.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-none bg-background/50">
          <CardContent className="p-3">
            <div className="flex flex-col items-center gap-1">
              <TrendingUp className="h-4 w-4 text-chart-4" />
              <span className="text-xs text-muted-foreground">Trips</span>
              <span className="text-sm font-semibold text-chart-4">{totalTrips}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-none bg-background/50">
          <CardContent className="p-3">
            <div className="flex flex-col items-center gap-1">
              <DollarSign className="h-4 w-4 text-chart-3" />
              <span className="text-xs text-muted-foreground">Avg/Trip</span>
              <span className="text-sm font-semibold text-chart-3">${averagePerTrip.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters - Stacked on mobile */}
      <Card className="border-0 shadow-none bg-background/50">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Search className="h-4 w-4" />
            Filter Earnings
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0 space-y-3">
          <div className="space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search trips..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-9 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="date" className="text-xs">Date range</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant={"outline"}
                    size="sm"
                    className={cn(
                      "w-full justify-start text-left font-normal h-9",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date?.from ? (
                      date.to ? (
                        <>
                          {format(date.from, "MMM d")} -{" "}
                          {format(date.to, "MMM d")}
                        </>
                      ) : (
                        format(date.from, "MMM d")
                      )
                    ) : (
                      <span className="text-xs">Pick dates</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={date?.from}
                    selected={date}
                    onSelect={setDate}
                    numberOfMonths={1}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label className="text-xs">Fare range</Label>
              <div className="flex items-center gap-1">
                <Input
                  type="number"
                  placeholder="Min"
                  value={fareRange.min}
                  onChange={(e) =>
                    setFareRange({ ...fareRange, min: e.target.value })
                  }
                  className="h-9 text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <Input
                  type="number"
                  placeholder="Max"
                  value={fareRange.max}
                  onChange={(e) =>
                    setFareRange({ ...fareRange, max: e.target.value })
                  }
                  className="h-9 text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trip History - Simplified for mobile */}
      <Card className="border-0 shadow-none bg-background/50">
        <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-sm font-medium">Trip History</CardTitle>
            <CardDescription className="text-xs">
              Showing {paginatedTrips.length} of {filteredTrips.length}
            </CardDescription>
          </div>
          <Button 
            onClick={handleExport} 
            variant="ghost" 
            size="sm" 
            className="h-8 px-2 text-xs"
          >
            <Download className="h-3.5 w-3.5 mr-1.5" />
            Export
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="rounded-lg border">
            <Table>
              <TableHeader className="bg-background/75">
                <TableRow className="h-10">
                  <TableHead className="p-2 w-[120px]">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-xs h-8 px-2"
                      onClick={() => requestSort("startTime")}
                    >
                      Date
                      <ArrowUpDown className="ml-1 h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead className="p-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-xs h-8 px-2"
                      onClick={() => requestSort("pickupLocation")}
                    >
                      Route
                      <ArrowUpDown className="ml-1 h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead className="p-2 text-right w-[100px]">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-xs h-8 px-2"
                      onClick={() => requestSort("totalFare")}
                    >
                      Total
                      <ArrowUpDown className="ml-1 h-3 w-3" />
                    </Button>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedTrips.length > 0 ? (
                  paginatedTrips.map((trip) => (
                    <TableRow key={trip.id} className="h-14 hover:bg-background/50">
                      <TableCell className="p-2">
                        <div className="text-xs font-medium" suppressHydrationWarning>
                          {format(new Date(trip.startTime), "MMM d")}
                        </div>
                        <div className="text-xs text-muted-foreground" suppressHydrationWarning>
                          {format(new Date(trip.startTime), "h:mm a")}
                        </div>
                      </TableCell>
                      <TableCell className="p-2">
                        <div className="space-y-0.5">
                          <div className="text-xs font-medium line-clamp-1">{trip.pickupLocation || 'Live Trip'}</div>
                          <div className="text-xs text-muted-foreground line-clamp-1">→ {trip.dropoffLocation || 'N/A'}</div>
                        </div>
                      </TableCell>
                      <TableCell className="p-2 text-right">
                        <div className="text-sm font-medium text-chart-2">
                          ${(trip.fare + trip.tip).toFixed(2)}
                        </div>
                        <div className="flex gap-1 justify-end">
                           <Badge 
                            variant="outline"
                            className={cn(
                              "text-xs h-5 px-1.5",
                              trip.designationType === 'prime' 
                                ? 'border-yellow-500 text-yellow-700 bg-yellow-50 dark:bg-yellow-950 dark:text-yellow-300' 
                                : 'border-blue-500 text-blue-700 bg-blue-50 dark:bg-blue-950 dark:text-blue-300'
                            )}
                          >
                            {trip.designationType === 'prime' ? 'Prime' : 'Platform'}
                          </Badge>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center text-sm">
                      No trips found for the selected filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>

        {/* Compact Pagination */}
        {totalPages > 1 && (
          <CardContent className="p-4 pt-0">
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="h-8 px-2.5"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="h-8 px-2.5"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  )
}
