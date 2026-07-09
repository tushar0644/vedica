import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Vedica Interview Scheduler',
  description: 'Schedule your admissions interview',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
