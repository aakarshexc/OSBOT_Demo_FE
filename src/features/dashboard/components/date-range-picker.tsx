import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/utils/utils"
import { CalendarIcon } from "lucide-react"
import moment from "moment"
import * as React from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface DatePickerProps {
  date?: Date
  onSelect: (date: Date | undefined) => void
  placeholder?: string
}

function DatePicker({ date, onSelect, placeholder }: DatePickerProps) {
  const [currentMonth, setCurrentMonth] = React.useState<Date>(date || new Date())

  // Update currentMonth if date prop changes drastically (optional, keeps calendar in sync)
  React.useEffect(() => {
    if (date) {
      setCurrentMonth(date)
    }
  }, [date])

  const handleMonthChange = (monthStr: string) => {
    const newViewDate = new Date(currentMonth)
    const newMonth = parseInt(monthStr)
    newViewDate.setMonth(newMonth)
    setCurrentMonth(newViewDate)

    // Trigger selection change immediately
    const targetDate = date ? new Date(date) : new Date(newViewDate)
    // Update year/month of the target date
    targetDate.setFullYear(newViewDate.getFullYear())
    targetDate.setMonth(newMonth)

    // Handle day overflow (e.g. Jan 31 -> Feb)
    if (date) {
      const originalDay = date.getDate()
      const daysInNewMonth = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0).getDate()
      if (originalDay > daysInNewMonth) {
        targetDate.setDate(daysInNewMonth)
      }
    } else {
      targetDate.setDate(1) // Default to 1st if nothing selected
    }

    onSelect(targetDate)
  }

  const handleYearChange = (yearStr: string) => {
    const newViewDate = new Date(currentMonth)
    const newYear = parseInt(yearStr)
    newViewDate.setFullYear(newYear)
    setCurrentMonth(newViewDate)

    // Trigger selection change immediately
    const targetDate = date ? new Date(date) : new Date(newViewDate)
    targetDate.setFullYear(newYear)

    // Handle day overflow for leap years etc
    if (date) {
      const originalDay = date.getDate()
      // We need to re-check the month validity for the new year (e.g. Feb 29 2024 -> Feb 2025)
      const daysInNewMonth = new Date(newYear, targetDate.getMonth() + 1, 0).getDate()
      if (originalDay > daysInNewMonth) {
        targetDate.setDate(daysInNewMonth)
      }
    } else {
      targetDate.setDate(1)
    }

    onSelect(targetDate)
  }

  // Generate years (e.g., current year - 10 to current year + 10)
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i)

  const months = [
    { value: "0", label: "January" },
    { value: "1", label: "February" },
    { value: "2", label: "March" },
    { value: "3", label: "April" },
    { value: "4", label: "May" },
    { value: "5", label: "June" },
    { value: "6", label: "July" },
    { value: "7", label: "August" },
    { value: "8", label: "September" },
    { value: "9", label: "October" },
    { value: "10", label: "November" },
    { value: "11", label: "December" },
  ]

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[140px] justify-start text-left font-normal h-8 rounded-full",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? moment(date).format("MMM DD, YYYY") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex items-center gap-2 p-3 border-b">
          <Select value={currentMonth.getMonth().toString()} onValueChange={handleMonthChange}>
            <SelectTrigger className="h-8 w-[120px]">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              {months.map((month) => (
                <SelectItem key={month.value} value={month.value}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={currentMonth.getFullYear().toString()} onValueChange={handleYearChange}>
            <SelectTrigger className="h-8 w-[90px]">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Calendar
          mode="single"
          date={date}
          onSelect={(d) => {
            onSelect(d)
            if (d) setCurrentMonth(d)
          }}
          month={currentMonth}
          onMonthChange={setCurrentMonth}
          className="p-3 pointer-events-auto"
        />
      </PopoverContent>
    </Popover>
  )
}

type DatePreset = 'last30' | 'last90' | 'custom'

interface DateRangePickerProps {
  dateFrom: Date | undefined
  dateTo: Date | undefined
  onDateFromChange: (date: Date | undefined) => void
  onDateToChange: (date: Date | undefined) => void
}

export function DateRangePicker({
  dateFrom,
  dateTo,
  onDateFromChange,
  onDateToChange,
}: DateRangePickerProps) {
  const [preset, setPreset] = React.useState<DatePreset | null>(null)
  const [isCustomOpen, setIsCustomOpen] = React.useState(true)

  // Check if current dates match a preset
  React.useEffect(() => {
    if (dateFrom && dateTo) {
      const today = new Date()
      today.setHours(23, 59, 59, 999)
      
      const endDate = new Date(dateTo)
      endDate.setHours(23, 59, 59, 999)
      
      const startDate = new Date(dateFrom)
      startDate.setHours(0, 0, 0, 0)
      
      // Check if end date is today (within 1 day tolerance)
      const endDiff = Math.abs(today.getTime() - endDate.getTime())
      const oneDayMs = 24 * 60 * 60 * 1000
      
      if (endDiff < oneDayMs) {
        const daysDiff = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
        if (daysDiff >= 29 && daysDiff <= 30) {
          setPreset('last30')
          setIsCustomOpen(false)
          return
        } else if (daysDiff >= 89 && daysDiff <= 90) {
          setPreset('last90')
          setIsCustomOpen(false)
          return
        }
      }
      // Set to custom if dates don't match presets
      setPreset('custom')
      setIsCustomOpen(true)
    } else {
      // If no dates, show custom picker
      setIsCustomOpen(true)
    }
  }, [dateFrom, dateTo])

  const handlePresetSelect = (selectedPreset: DatePreset) => {
    const today = new Date()
    today.setHours(23, 59, 59, 999)
    
    const startDate = new Date(today)
    
    if (selectedPreset === 'last30') {
      startDate.setDate(today.getDate() - 29) // 30 days including today
      startDate.setHours(0, 0, 0, 0)
      onDateFromChange(startDate)
      onDateToChange(today)
      setPreset('last30')
      setIsCustomOpen(false)
    } else if (selectedPreset === 'last90') {
      startDate.setDate(today.getDate() - 89) // 90 days including today
      startDate.setHours(0, 0, 0, 0)
      onDateFromChange(startDate)
      onDateToChange(today)
      setPreset('last90')
      setIsCustomOpen(false)
    } else {
      setPreset('custom')
      setIsCustomOpen(true)
    }
  }

  const handleCustomDateChange = () => {
    setPreset('custom')
  }

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
      {/* Quick Preset Buttons */}
      <div className="flex items-center gap-1 bg-muted/40 p-1 rounded-full border border-border/60 shadow-sm">
        <Button
          variant={preset === 'last30' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => handlePresetSelect('last30')}
          className={cn(
            "h-8 px-3 text-xs font-semibold transition-all rounded-full",
            preset === 'last30' 
              ? "bg-primary text-primary-foreground shadow-sm" 
              : "text-muted-foreground hover:text-foreground hover:bg-background/80"
          )}
        >
          Last 30 Days
        </Button>
        <Button
          variant={preset === 'last90' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => handlePresetSelect('last90')}
          className={cn(
            "h-8 px-3 text-xs font-semibold transition-all rounded-full",
            preset === 'last90' 
              ? "bg-primary text-primary-foreground shadow-sm" 
              : "text-muted-foreground hover:text-foreground hover:bg-background/80"
          )}
        >
          Last 90 Days
        </Button>
        <Button
          variant={preset === 'custom' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => handlePresetSelect('custom')}
          className={cn(
            "h-8 px-3 text-xs font-semibold transition-all rounded-full",
            preset === 'custom' 
              ? "bg-primary text-primary-foreground shadow-sm" 
              : "text-muted-foreground hover:text-foreground hover:bg-background/80"
          )}
        >
          Custom Range
        </Button>
      </div>

      {/* Display selected range when preset is active */}
      {(preset === 'last30' || preset === 'last90') && dateFrom && dateTo && (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 dark:bg-primary/20 border border-primary/20 text-sm font-medium text-primary">
          <CalendarIcon className="h-4 w-4 shrink-0" />
          <span className="tabular-nums whitespace-nowrap">
            {moment(dateFrom).format("MMM DD, YYYY")} - {moment(dateTo).format("MMM DD, YYYY")}
          </span>
        </div>
      )}

      {/* Custom Date Range Picker */}
      {(preset === 'custom' || preset === null || isCustomOpen) && (
        <div className="flex items-center gap-2 bg-background/50 p-1 rounded-full border shadow-sm">
          <DatePicker
            date={dateFrom}
            onSelect={(date) => {
              onDateFromChange(date)
              handleCustomDateChange()
            }}
            placeholder="Start Date"
          />
          <span className="text-muted-foreground text-sm font-medium">to</span>
          <DatePicker
            date={dateTo}
            onSelect={(date) => {
              onDateToChange(date)
              handleCustomDateChange()
            }}
            placeholder="End Date"
          />
        </div>
      )}
    </div>
  )
}
