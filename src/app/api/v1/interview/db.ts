import fs from "fs/promises";
import path from "path";
import axios from "axios";
import { getBackendCookieHeader } from "@/actions/auth/get-auth";
import { listApplicationForms } from "@/actions/application-forms/list.action";
import { InterviewDate, InterviewBooking, InterviewSlot, InterviewMode } from "@/types/interview";

const DB_PATH = path.join(process.cwd(), "src/app/api/v1/interview/data.json");
const BASE_URL = process.env.BACKEND_URL || "https://vedica.origensystems.com";

interface DBData {
  bookings: Record<string, InterviewBooking>;
  applications?: Record<string, Record<string, string>>;
}

// 1. Read Local Fallback DB
export async function readDB(): Promise<DBData> {
  try {
    const raw = await fs.readFile(DB_PATH, "utf-8");
    return JSON.parse(raw) as DBData;
  } catch (err) {
    return { bookings: {} };
  }
}

// 2. Write Local Fallback DB
export async function writeDB(data: DBData): Promise<void> {
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
}

// 3. Helper to resolve application ID for current user
export async function getApplicationId(): Promise<string | null> {
  try {
    const res = await listApplicationForms();
    if (res.success && res.forms && res.forms.length > 0) {
      const sorted = [...res.forms].sort((a, b) => b.name.localeCompare(a.name));
      return sorted[0].name;
    }
  } catch (e) {
    console.error("[INTERVIEW][DB][APP_ID_ERROR]", e);
  }
  return null;
}

// 4. Format UTC string to local 12-hour format (e.g. "10:45 AM")
export function formatUTCToLocalTime(utcStr: string): string {
  try {
    // Replace space with T for ISO format
    let isoStr = utcStr.replace(" ", "T");
    if (!isoStr.includes("Z") && !isoStr.includes("+") && !isoStr.includes("-")) {
      isoStr += "+00:00"; // Assume UTC if no offset
    }
    const date = new Date(isoStr);
    if (isNaN(date.getTime())) {
      return utcStr;
    }
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch (e) {
    return utcStr;
  }
}

// 5. Parse local time (e.g., "09:30 AM") on a date to UTC string "YYYY-MM-DD HH:MM:SS+00:00"
export function parseLocalTimeToUTC(dateStr: string, timeStr: string, minutesDuration: number = 0): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  
  // Parse "09:30 AM"
  const match = timeStr.match(/^(\d+):(\d+)\s*(AM|PM)$/i);
  if (!match) {
    throw new Error(`Invalid time format: ${timeStr}`);
  }
  
  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const ampm = match[3].toUpperCase();
  
  if (ampm === "PM" && hours < 12) hours += 12;
  if (ampm === "AM" && hours === 12) hours = 0;
  
  // Create date in local timezone
  const localDate = new Date(year, month - 1, day, hours, minutes, 0);
  
  // Apply duration offset if ending time
  const targetDate = minutesDuration > 0 
    ? new Date(localDate.getTime() + minutesDuration * 60 * 1000) 
    : localDate;
    
  const pad = (n: number) => String(n).padStart(2, "0");
  const utcYear = targetDate.getUTCFullYear();
  const utcMonth = pad(targetDate.getUTCMonth() + 1);
  const utcDay = pad(targetDate.getUTCDate());
  const utcHours = pad(targetDate.getUTCHours());
  const utcMinutes = pad(targetDate.getUTCMinutes());
  const utcSeconds = pad(targetDate.getUTCSeconds());
  
  return `${utcYear}-${utcMonth}-${utcDay} ${utcHours}:${utcMinutes}:${utcSeconds}+00:00`;
}

// Slot times list (fallback)
const FALLBACK_SLOT_TIMES = [
  "09:00 AM",
  "09:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "02:00 PM",
  "02:30 PM",
  "03:00 PM",
  "03:30 PM",
  "04:00 PM",
];

// Helper to format date as YYYY-MM-DD
export function formatDateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// 6. Fetch Active Interview Booking (Hybrid)
export async function getActiveBooking(email: string): Promise<InterviewBooking | null> {
  try {
    const cookie = await getBackendCookieHeader();
    const appId = await getApplicationId();
    
    if (cookie && appId) {
      const response = await axios.get(`${BASE_URL}/api/method/get_current_interview`, {
        params: { application: appId },
        headers: {
          Cookie: cookie,
          Authorization: process.env.AUTHORIZATION,
        },
      });

      const msg = response.data.message;
      if (msg && msg.name) {
        return {
          referenceNumber: msg.name,
          candidateName: msg.candidate_name || msg.title || "Candidate",
          applicationNumber: msg.application || appId,
          programApplied: "Vedica Scholars Programme",
          email: msg.email_id || email,
          phone: msg.mobile_number || "",
          date: msg.date,
          time: formatUTCToLocalTime(msg.start_time),
          timezone: "IST (UTC+5:30)",
          mode: (msg.interview_mode || "Online") as InterviewMode,
        };
      }
    }
  } catch (err: any) {
    console.error("[INTERVIEW][DB][GET_ACTIVE_BACKEND_ERROR]", err.response?.data || err.message);
  }

  // Fallback to local DB
  const db = await readDB();
  return db.bookings[email] || null;
}

// 7. Get Available slots for a date (Hybrid)
export async function getSlotsForDate(dateStr: string): Promise<InterviewSlot[]> {
  try {
    const cookie = await getBackendCookieHeader();
    const appId = await getApplicationId();

    if (cookie && appId) {
      const response = await axios.get(`${BASE_URL}/api/method/get_available_interview_slots`, {
        params: {
          application: appId,
          date: dateStr,
          user_timezone_offset: "-330",
        },
        headers: {
          Cookie: cookie,
          Authorization: process.env.AUTHORIZATION,
        },
      });

      const msg = response.data.message || {};
      const slotsRaw = msg.all_available_slots_for_data || [];
      if (Array.isArray(slotsRaw)) {
        return slotsRaw.map((slot: any) => {
          const formattedTime = formatUTCToLocalTime(slot.start_time);
          const remainingSeats = slot.remaining_seats ?? 3;
          
          let slotAvailability: InterviewSlot["availability"] = "available";
          if (remainingSeats === 0) {
            slotAvailability = "full";
          } else if (remainingSeats === 1) {
            slotAvailability = "limited";
          }

          return {
            time: formattedTime,
            remainingSeats,
            totalSeats: slot.total_seats ?? 3,
            availability: slotAvailability,
          };
        });
      }
    }
  } catch (err: any) {
    console.error("[INTERVIEW][DB][GET_SLOTS_BACKEND_ERROR]", err.response?.data || err.message);
  }

  // Fallback to local schedule generation ONLY on failure/unauthenticated
  const schedule = await getDynamicSchedule();
  const matched = schedule.find((d) => d.date === dateStr);
  return matched ? matched.slots : [];
}

// 8. Generate dynamic schedules (Hybrid)
export async function getDynamicSchedule(): Promise<InterviewDate[]> {
  try {
    const cookie = await getBackendCookieHeader();
    const appId = await getApplicationId();

    if (cookie && appId) {
      const todayStr = formatDateString(new Date());
      const response = await axios.get(`${BASE_URL}/api/method/get_available_interview_slots`, {
        params: {
          application: appId,
          date: todayStr,
          user_timezone_offset: "-330",
        },
        headers: {
          Cookie: cookie,
          Authorization: process.env.AUTHORIZATION,
        },
      });

      const availableDatesList = response.data.message?.available_dates || [];
      if (Array.isArray(availableDatesList) && availableDatesList.length > 0) {
        return availableDatesList.map((dateVal: string) => {
          return {
            date: dateVal,
            availability: "available",
            slots: [], // Slots will be fetched dynamically via getSlotsForDate
          };
        });
      }
    }
  } catch (err: any) {
    console.error("[INTERVIEW][DB][GET_DATES_BACKEND_ERROR]", err.response?.data || err.message);
  }

  // Fallback to local schedule generation if backend fails or returns no dates
  const { bookings } = await readDB();
  const schedule: InterviewDate[] = [];
  const today = new Date();

  // Create a 14-day schedule starting from tomorrow
  for (let i = 1; i <= 14; i++) {
    const current = new Date(today);
    current.setDate(today.getDate() + i);

    const dateStr = formatDateString(current);
    const dayOfWeek = current.getDay(); // 0 is Sunday, 6 is Saturday

    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    // Generate slots
    const slots: InterviewSlot[] = FALLBACK_SLOT_TIMES.map((time) => {
      let totalSeats = 3;
      
      if (i === 2) {
        if (time === "09:00 AM" || time === "10:00 AM") {
          totalSeats = 3;
        } else if (time === "11:00 AM" || time === "02:00 PM") {
          totalSeats = 1;
        } else {
          totalSeats = 0;
        }
      } else if (i === 3) {
        totalSeats = 0;
      }

      // Count actual local bookings
      const actualBookings = Object.values(bookings).filter(
        (b) => b.date === dateStr && b.time === time
      ).length;

      const remainingSeats = Math.max(0, totalSeats - actualBookings);

      let slotAvailability: InterviewSlot["availability"] = "available";
      if (isWeekend) {
        slotAvailability = "disabled";
      } else if (remainingSeats === 0) {
        slotAvailability = "full";
      } else if (remainingSeats === 1) {
        slotAvailability = "limited";
      }

      return {
        time,
        totalSeats,
        remainingSeats,
        availability: slotAvailability,
      };
    });

    let dayAvailability: InterviewDate["availability"] = "available";
    if (isWeekend) {
      dayAvailability = "disabled";
    } else {
      const allSlots = slots.length;
      const fullSlots = slots.filter((s) => s.availability === "full").length;
      const limitedSlots = slots.filter((s) => s.availability === "limited").length;

      if (fullSlots === allSlots) {
        dayAvailability = "full";
      } else if (limitedSlots > 0 || fullSlots > 0) {
        dayAvailability = "limited";
      }
    }

    schedule.push({
      date: dateStr,
      availability: dayAvailability,
      slots,
    });
  }

  return schedule;
}
