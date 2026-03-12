import * as React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/utils/utils'
import { Button } from '@/components/ui/button'

interface CalendarProps {
  date?: Date
  onSelect?: (date: Date | undefined) => void
  mode?: 'single' | 'range'
  selected?: { from?: Date; to?: Date }
  onSelectRange?: (range: { from?: Date; to?: Date }) => void
  className?: string
  minDate?: Date
  maxDate?: Date
  month?: Date
  onMonthChange?: (date: Date) => void
}

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay()
}

function isSameDay(date1: Date | undefined, date2: Date | undefined): boolean {
  if (!date1 || !date2) return false
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

function isInRange(
  date: Date,
  from: Date | undefined,
  to: Date | undefined
): boolean {
  if (!from || !to) return false
  return date >= from && date <= to
}

export function Calendar({
  date,
  onSelect,
  mode = 'single',
  selected,
  onSelectRange,
  className,
  minDate,
  maxDate,
  month,
  onMonthChange,
}: CalendarProps) {
  const [currentDate, setCurrentDate] = React.useState(
    month || date || selected?.from || new Date()
  )
  const [hoveredDate, setHoveredDate] = React.useState<Date | undefined>()

  // Sync with external month prop
  React.useEffect(() => {
    if (month) {
      setCurrentDate(month)
    }
  }, [month])

  // Normalize min/max dates for comparison
  const normalizedMinDate = React.useMemo(() => {
    if (!minDate) return undefined
    const normalized = new Date(minDate)
    normalized.setHours(0, 0, 0, 0)
    return normalized
  }, [minDate])

  const normalizedMaxDate = React.useMemo(() => {
    if (!maxDate) return undefined
    const normalized = new Date(maxDate)
    normalized.setHours(0, 0, 0, 0)
    return normalized
  }, [maxDate])

  const year = currentDate.getFullYear()
  const displayMonth = currentDate.getMonth() // Renamed to avoid shadowning month prop
  const daysInMonth = getDaysInMonth(year, displayMonth)
  const firstDay = getFirstDayOfMonth(year, displayMonth)

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(year, displayMonth, day)
    clickedDate.setHours(0, 0, 0, 0) // Normalize time to avoid timezone issues

    if (mode === 'single') {
      onSelect?.(clickedDate)
    } else if (mode === 'range' && onSelectRange) {
      if (!selected?.from || (selected.from && selected.to)) {
        // Start new selection
        onSelectRange({ from: clickedDate, to: undefined })
      } else if (selected.from && !selected.to) {
        // Complete the range
        if (clickedDate < selected.from) {
          onSelectRange({ from: clickedDate, to: selected.from })
        } else {
          onSelectRange({ from: selected.from, to: clickedDate })
        }
      }
    }
  }

  const updateMonth = (newDate: Date) => {
    setCurrentDate(newDate)
    onMonthChange?.(newDate)
  }

  const handlePrevMonth = () => {
    updateMonth(new Date(year, displayMonth - 1, 1))
  }

  const handleNextMonth = () => {
    updateMonth(new Date(year, displayMonth + 1, 1))
  }

  const handleToday = () => {
    const today = new Date()
    updateMonth(today)
    if (mode === 'single') {
      onSelect?.(today)
    } else if (mode === 'range' && onSelectRange) {
      onSelectRange({ from: today, to: undefined })
    }
  }

  const days = []
  // Empty cells for days before the first day of the month
  for (let i = 0; i < firstDay; i++) {
    days.push(null)
  }
  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day)
  }

  return (
    <div className={cn('p-3', className)}>
      <div className='flex items-center justify-between mb-4'>
        <Button
          variant='ghost'
          size='icon'
          onClick={handlePrevMonth}
          className='h-7 w-7 hover:bg-primary/10 hover:text-primary'
        >
          <ChevronLeft className='h-4 w-4' />
        </Button>
        <div className='text-sm font-medium'>
          {MONTHS[displayMonth]} {year}
        </div>
        <Button
          variant='ghost'
          size='icon'
          onClick={handleNextMonth}
          className='h-7 w-7 hover:bg-primary/10 hover:text-primary'
        >
          <ChevronRight className='h-4 w-4' />
        </Button>
      </div>

      <div className='grid grid-cols-7 gap-1 mb-2'>
        {DAYS.map((day) => (
          <div
            key={day}
            className='text-center text-xs font-medium text-muted-foreground p-1'
          >
            {day}
          </div>
        ))}
      </div>

      <div className='grid grid-cols-7 gap-1'>
        {days.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} className='p-1' />
          }

          const dayDate = new Date(year, displayMonth, day)
          dayDate.setHours(0, 0, 0, 0) // Normalize time to avoid timezone issues
          const isToday = isSameDay(dayDate, new Date())
          const isSelected =
            mode === 'single'
              ? date && isSameDay(dayDate, date)
              : selected?.from && isSameDay(dayDate, selected.from)
          const isEndSelected =
            mode === 'range' && selected?.to && isSameDay(dayDate, selected.to)
          const isInSelectedRange =
            mode === 'range' &&
            isInRange(dayDate, selected?.from, selected?.to)
          const isHovered =
            mode === 'range' &&
            selected?.from &&
            !selected?.to &&
            hoveredDate &&
            isInRange(dayDate, selected.from, hoveredDate)

          // Check if date is disabled due to min/max constraints
          const isDisabled =
            (normalizedMinDate && dayDate < normalizedMinDate) ||
            (normalizedMaxDate && dayDate > normalizedMaxDate)

          return (
            <button
              key={day}
              type='button'
              onClick={() => !isDisabled && handleDateClick(day)}
              onMouseEnter={() => !isDisabled && setHoveredDate(dayDate)}
              disabled={isDisabled}
              className={cn(
                'p-1 text-sm rounded-md transition-colors',
                !isDisabled && 'hover:bg-primary/20 hover:text-white',
                isDisabled && 'opacity-50 cursor-not-allowed',
                isToday && 'font-semibold',
                isSelected &&
                'bg-primary text-white hover:bg-primary/90 hover:text-white',
                isEndSelected &&
                'bg-primary text-white hover:bg-primary/90 hover:text-white',
                isInSelectedRange &&
                !isSelected &&
                !isEndSelected &&
                'bg-primary/20 text-white',
                isHovered &&
                !isSelected &&
                !isDisabled &&
                'bg-primary/20 text-white'
              )}
            >
              {day}
            </button>
          )
        })}
      </div>

      <div className='mt-4 pt-4 border-t'>
        <Button
          variant='outline'
          size='sm'
          onClick={handleToday}
          className='w-full'
        >
          Today
        </Button>
      </div>
    </div>
  )
}
