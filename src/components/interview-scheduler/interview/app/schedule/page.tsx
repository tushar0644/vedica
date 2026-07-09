'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import CalendarGrid from '@/components/CalendarGrid'

// ── Types ────────────────────────────────────────────────────────────────────

interface Slot { start_time: string; end_time: string }

interface SlotsResponse {
  no_interviewer_available?: boolean
  is_invalid_date?: boolean
  all_available_slots_for_data?: Slot[]
  available_days?: string[]
  available_dates?: string[]
  duration?: number
}

interface CurrentInterview {
  has_current_interview: boolean
  interview?: string
  interview_date?: string
  interview_time?: string
  meeting_link?: string
  workflow_state?: string
  assigned_interviewer?: string
}

interface BookedResult {
  interview: string
  interview_date: string
  interview_time: string
  meeting_link: string
  assigned_interviewer: string
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function tzOffset() { return -new Date().getTimezoneOffset() }

function utcToLocal(utcStr: string): Date {
  return new Date(utcStr.replace(' ', 'T') + 'Z')
}

function fmtTime(utcStr: string) {
  return utcToLocal(utcStr).toLocaleTimeString('en-IN', {
    hour: '2-digit', minute: '2-digit', hour12: true,
  })
}

function fmtDateDisplay(dateStr: string) {
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })
}

function fmtInterviewDate(dateStr: string, timeStr: string) {
  // timeStr is UTC HH:MM:SS
  const utc = new Date(`${dateStr}T${timeStr}Z`)
  return utc.toLocaleString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true,
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  })
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function SchedulePage() {
  const router = useRouter()
  const [appId, setAppId] = useState('')

  // Calendar state
  const now = new Date()
  const [calYear, setCalYear] = useState(now.getFullYear())
  const [calMonth, setCalMonth] = useState(now.getMonth())

  // Availability (fetched once to paint calendar)
  const [availDays, setAvailDays] = useState<string[]>([])
  const [availDates, setAvailDates] = useState<string[]>([])

  // Scheduling flow
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [dateSlots, setDateSlots] = useState<Slot[] | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null)
  const [booking, setBooking] = useState(false)
  const [bookError, setBookError] = useState('')

  // Outcomes
  const [currentInterview, setCurrentInterview] = useState<CurrentInterview | null>(null)
  const [booked, setBooked] = useState<BookedResult | null>(null)
  const [pageError, setPageError] = useState('')
  const [loadingPage, setLoadingPage] = useState(true)

  // ── Init ──────────────────────────────────────────────────────────────────

  useEffect(() => {
    async function initSchedule() {
      let id = sessionStorage.getItem('application_id')

      if (!id) {
        try {
          const res = await fetch('/api/v1/application-form')
          if (res.ok) {
            const data = await res.json()
            if (data.forms && data.forms.length > 0) {
              const forms = [...data.forms]
              forms.sort((a: any, b: any) => b.name.localeCompare(a.name))
              const activeId = forms[0].name
              id = activeId
              sessionStorage.setItem('application_id', activeId)
            }
          }
        } catch (err) {
          console.error('Failed to auto-authenticate scheduler session:', err)
        }
      }

      if (!id) {
        router.replace('/login')
        return
      }

      setAppId(id)

      try {
        const interviewRes = await fetch(`/api/proxy/get_current_interview?application=${encodeURIComponent(id)}`)
        const data = await interviewRes.json()
        const msg: CurrentInterview = data.message
        setCurrentInterview(msg)
        if (!msg.has_current_interview) {
          const slotsRes = await fetch(
            `/api/proxy/get_available_interview_slots?application=${encodeURIComponent(id)}&date=${toDateString(new Date())}&user_timezone_offset=${tzOffset()}`
          )
          const slotsData = await slotsRes.json()
          const s: SlotsResponse = slotsData.message
          setAvailDays(s.available_days || [])
          setAvailDates(s.available_dates || [])
        }
      } catch (err) {
        setPageError('Could not load your interview status. Please refresh.')
      } finally {
        setLoadingPage(false)
      }
    }

    initSchedule()
  }, [router])

  // ── Helpers ───────────────────────────────────────────────────────────────

  function toDateString(d: Date) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  }

  const handleDateSelect = useCallback(async (date: string) => {
    setSelectedDate(date)
    setSelectedSlot(null)
    setDateSlots(null)
    setBookError('')
    setLoadingSlots(true)
    try {
      const r = await fetch(
        `/api/proxy/get_available_interview_slots?application=${encodeURIComponent(appId)}&date=${date}&user_timezone_offset=${tzOffset()}`
      )
      const d = await r.json()
      const s: SlotsResponse = d.message
      if (s.no_interviewer_available) {
        setDateSlots([])
      } else if (s.is_invalid_date) {
        setDateSlots([])
      } else {
        setDateSlots(s.all_available_slots_for_data || [])
        // Refresh available days/dates from response
        if (s.available_days) setAvailDays(s.available_days)
        if (s.available_dates) setAvailDates(s.available_dates)
      }
    } catch {
      setDateSlots([])
    } finally {
      setLoadingSlots(false)
    }
  }, [appId])

  async function handleBook() {
    if (!selectedSlot) return
    setBooking(true)
    setBookError('')
    try {
      const form = new FormData()
      form.append('application', appId)
      form.append('start_time', selectedSlot.start_time)
      form.append('user_timezone_offset', String(tzOffset()))

      const r = await fetch('/api/proxy/schedule_interview', { method: 'POST', body: form })
      const d = await r.json()
      if (!r.ok) {
        const msg = (d.exception as string || '').split(': ').slice(-1)[0] || 'Booking failed'
        setBookError(msg)
        return
      }
      setBooked(d.message)
    } catch {
      setBookError('Something went wrong. Please try again.')
    } finally {
      setBooking(false)
    }
  }

  function prevMonth() {
    if (calMonth === 0) { setCalYear(y => y - 1); setCalMonth(11) }
    else setCalMonth(m => m - 1)
    setSelectedDate(null); setDateSlots(null); setSelectedSlot(null)
  }

  function nextMonth() {
    if (calMonth === 11) { setCalYear(y => y + 1); setCalMonth(0) }
    else setCalMonth(m => m + 1)
    setSelectedDate(null); setDateSlots(null); setSelectedSlot(null)
  }

  // ── Render ────────────────────────────────────────────────────────────────

  if (loadingPage) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (pageError) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-red-600 mb-4">{pageError}</p>
          <button onClick={() => window.location.reload()}
            className="px-4 py-2 bg-brand-500 text-white rounded-lg text-sm">
            Retry
          </button>
        </div>
      </div>
    )
  }

  // ── Already booked ────────────────────────────────────────────────────────

  if (booked) {
    return <ConfirmationScreen result={booked} onDone={() => router.replace('/login')} />
  }

  if (currentInterview?.has_current_interview) {
    return (
      <AlreadyScheduled interview={currentInterview} onLogout={() => {
        sessionStorage.clear(); router.replace('/login')
      }} />
    )
  }

  // ── Scheduling UI (Calendly-like) ─────────────────────────────────────────

  const showSlots = selectedDate !== null

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className={[
        'bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden w-full transition-all duration-300',
        showSlots ? 'max-w-4xl' : 'max-w-2xl',
      ].join(' ')}>
        <div className="flex flex-col md:flex-row">

          {/* ── Left panel ─────────────────────────────────────────── */}
          <div className="w-full md:w-64 shrink-0 bg-gray-900 text-white p-7 flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-500 flex items-center justify-center font-bold text-sm shrink-0">
                VS
              </div>
              <div>
                <p className="text-xs text-gray-400">Vedica Scholars</p>
                <p className="text-sm font-semibold leading-tight">Programme</p>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-bold leading-snug mb-4">Admissions Interview</h2>
              <div className="space-y-3 text-sm text-gray-300">
                <div className="flex items-center gap-2">
                  <span>⏱</span>
                  <span>45 minutes</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>📹</span>
                  <span>Google Meet (link sent after booking)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>🌏</span>
                  <span>
                    {Intl.DateTimeFormat().resolvedOptions().timeZone} &nbsp;
                    (UTC{tzOffset() >= 0 ? '+' : ''}{(tzOffset() / 60).toFixed(1).replace('.0', '')})
                  </span>
                </div>
              </div>
            </div>

            {selectedDate && (
              <div className="mt-auto pt-4 border-t border-gray-700 text-xs text-gray-400">
                <p className="font-medium text-white text-sm mb-1">{fmtDateDisplay(selectedDate)}</p>
                {selectedSlot && (
                  <p className="text-brand-500 font-semibold text-sm">{fmtTime(selectedSlot.start_time)}</p>
                )}
              </div>
            )}
          </div>

          {/* ── Calendar ───────────────────────────────────────────── */}
          <div className="flex-1 p-7 border-r border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-5">Select a date</h3>
            <CalendarGrid
              year={calYear}
              month={calMonth}
              availableDays={availDays}
              availableDates={availDates}
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
              onPrevMonth={prevMonth}
              onNextMonth={nextMonth}
            />
          </div>

          {/* ── Time slots (visible after date selected) ────────────── */}
          {showSlots && (
            <div className="w-full md:w-52 p-7 border-t md:border-t-0 border-gray-100">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">
                {selectedDate
                  ? new Date(`${selectedDate}T00:00:00`).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })
                  : 'Available times'}
              </h3>

              {loadingSlots ? (
                <div className="flex justify-center py-8">
                  <div className="w-5 h-5 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : !dateSlots || dateSlots.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-8">
                  No slots available for this date.
                </p>
              ) : (
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {dateSlots.map((slot, i) => {
                    const isSelected = selectedSlot?.start_time === slot.start_time
                    return (
                      <button
                        key={i}
                        onClick={() => setSelectedSlot(isSelected ? null : slot)}
                        className={[
                          'w-full py-2.5 rounded-lg text-sm font-medium border transition',
                          isSelected
                            ? 'bg-brand-500 border-brand-500 text-white'
                            : 'border-brand-500 text-brand-600 hover:bg-brand-50',
                        ].join(' ')}
                      >
                        {fmtTime(slot.start_time)}
                      </button>
                    )
                  })}
                </div>
              )}

              {/* Confirm */}
              {selectedSlot && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  {bookError && (
                    <p className="text-xs text-red-500 mb-3 leading-snug">{bookError}</p>
                  )}
                  <button
                    onClick={handleBook}
                    disabled={booking}
                    className="w-full py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-lg text-sm font-semibold transition disabled:opacity-60"
                  >
                    {booking ? 'Scheduling…' : 'Confirm'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Sub-components ────────────────────────────────────────────────────────────

function ConfirmationScreen({ result, onDone }: { result: BookedResult; onDone: () => void }) {
  const dateTimeStr = fmtInterviewDate(result.interview_date, result.interview_time)

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-md border border-gray-200 max-w-md w-full p-8 text-center">
        <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5 text-2xl">
          ✓
        </div>
        <h1 className="text-xl font-bold text-gray-900 mb-1">Interview Scheduled!</h1>
        <p className="text-gray-500 text-sm mb-6">
          A calendar invite has been sent to your email.
        </p>

        <div className="bg-gray-50 rounded-xl p-5 text-left space-y-3 mb-6">
          <Row icon="📅" label="Date & Time" value={dateTimeStr} />
          <Row icon="⏱" label="Duration" value="45 minutes" />
          <Row icon="🎙️" label="Interview" value={result.interview} />
        </div>

        {result.meeting_link && (
          <a
            href={result.meeting_link}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-lg text-sm font-semibold transition mb-3"
          >
            Open Google Meet
          </a>
        )}

        <button onClick={onDone} className="text-sm text-gray-400 hover:text-gray-600 transition">
          Done
        </button>
      </div>
    </div>
  )
}

function AlreadyScheduled({ interview, onLogout }: { interview: CurrentInterview; onLogout: () => void }) {
  const dateTimeStr = interview.interview_date && interview.interview_time
    ? fmtInterviewDate(interview.interview_date, interview.interview_time)
    : '—'

  const stateColor: Record<string, string> = {
    'Interview Scheduled': 'bg-blue-100 text-blue-700',
    'Interview Completed': 'bg-green-100 text-green-700',
    'Interview Cancelled': 'bg-red-100 text-red-700',
  }
  const badgeClass = stateColor[interview.workflow_state || ''] || 'bg-gray-100 text-gray-600'

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-md border border-gray-200 max-w-md w-full overflow-hidden">
        <div className="bg-gray-900 text-white p-6 text-center">
          <div className="w-12 h-12 rounded-full bg-brand-500 flex items-center justify-center mx-auto mb-3 font-bold">
            VS
          </div>
          <h1 className="font-bold text-lg">Vedica Scholars Programme</h1>
          <p className="text-gray-400 text-sm mt-1">Admissions Interview</p>
        </div>

        <div className="p-6">
          <div className="flex justify-center mb-5">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${badgeClass}`}>
              {interview.workflow_state}
            </span>
          </div>

          <div className="space-y-3 mb-6">
            <Row icon="📅" label="Date & Time" value={dateTimeStr} />
            <Row icon="⏱" label="Duration" value="45 minutes" />
            <Row icon="📋" label="Interview ID" value={interview.interview || '—'} />
          </div>

          {interview.meeting_link && (
            <a
              href={interview.meeting_link}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-lg text-sm font-semibold transition text-center mb-3"
            >
              Join Google Meet
            </a>
          )}

          <button onClick={onLogout} className="w-full text-sm text-gray-400 hover:text-gray-600 transition py-2">
            Sign out
          </button>
        </div>
      </div>
    </div>
  )
}

function Row({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-base mt-0.5 shrink-0">{icon}</span>
      <div className="min-w-0">
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-sm font-medium text-gray-800 break-words">{value}</p>
      </div>
    </div>
  )
}


