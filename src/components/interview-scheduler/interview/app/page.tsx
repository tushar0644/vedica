import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

export default function Home() {
  const sid = cookies().get('frappe_sid')?.value
  if (sid && sid !== 'Guest') {
    redirect('/schedule')
  }
  redirect('/login')
}
