'use client'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December']

interface Props {
  year: number
  month: number       // 0-indexed
  availableDays: string[]   // e.g. ['Monday', 'Wednesday']
  availableDates: string[]  // e.g. ['2026-07-02']
  selectedDate: string | null
  onDateSelect: (date: string) => void
  onPrevMonth: () => void
  onNextMonth: () => void
}

function pad(n: number) { return String(n).padStart(2, '0') }

export default function CalendarGrid({
  year, month, availableDays, availableDates, selectedDate,
  onDateSelect, onPrevMonth, onNextMonth,
}: Props) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const prevDisabled = year < today.getFullYear() || (year === today.getFullYear() && month <= today.getMonth())

  function isAvailable(day: number) {
    const d = new Date(year, month, day)
    if (d <= today) return false
    const dateStr = `${year}-${pad(month + 1)}-${pad(day)}`
    if (availableDates.includes(dateStr)) return true
    const dayName = DAY_NAMES[d.getDay()]
    return availableDays.includes(dayName)
  }

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  return (
    <div className="select-none">
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onPrevMonth}
          disabled={prevDisabled}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition text-gray-600"
        >
          ‹
        </button>
        <span className="font-semibold text-gray-900">
          {MONTHS[month]} {year}
        </span>
        <button
          onClick={onNextMonth}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition text-gray-600"
        >
          ›
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS.map(d => (
          <div key={d} className="text-center text-xs font-medium text-gray-400 py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Date grid */}
      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((day, i) => {
          if (!day) return <div key={i} />

          const dateStr = `${year}-${pad(month + 1)}-${pad(day)}`
          const available = isAvailable(day)
          const selected = selectedDate === dateStr
          const isPast = new Date(year, month, day) <= today

          return (
            <button
              key={i}
              onClick={() => available && onDateSelect(dateStr)}
              disabled={!available}
              className={[
                'mx-auto w-9 h-9 rounded-full text-sm font-medium transition flex items-center justify-center',
                selected
                  ? 'bg-brand-500 text-white'
                  : available
                  ? 'text-brand-600 hover:bg-brand-50 font-semibold cursor-pointer'
                  : isPast
                  ? 'text-gray-300 cursor-default'
                  : 'text-gray-300 cursor-default',
              ].join(' ')}
            >
              {day}
            </button>
          )
        })}
      </div>
    </div>
  )
}
