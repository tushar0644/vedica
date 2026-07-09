'use client'

import { useState, FormEvent, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [appId, setAppId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [checkingSession, setCheckingSession] = useState(true)

  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch('/api/v1/application-form')
        if (res.ok) {
          const data = await res.json()
          if (data.forms && data.forms.length > 0) {
            const forms = [...data.forms]
            forms.sort((a: any, b: any) => b.name.localeCompare(a.name))
            const latestAppId = forms[0].name
            sessionStorage.setItem('application_id', latestAppId)
            router.replace('/schedule')
            return
          }
        }
      } catch (err) {
        console.error('Failed to auto-authenticate scheduler session:', err)
      } finally {
        setCheckingSession(false)
      }
    }
    checkSession()
  }, [router])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const form = new FormData()
      form.append('usr', email)
      form.append('pwd', password)

      const res = await fetch('/api/proxy/login', { method: 'POST', body: form })
      const data = await res.json()

      if (!res.ok) {
        // Frappe returns 401 for bad credentials; message may vary by user type
        setError(data.message || data.exc || 'Invalid email or password')
        setLoading(false)
        return
      }

      // Store application ID client-side (not sensitive)
      sessionStorage.setItem('application_id', appId.trim())
      router.push('/schedule')
    } catch {
      setError('Could not connect to server. Try again.')
      setLoading(false)
    }
  }

  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-brand-500 text-white text-xl font-bold mb-4">
            VS
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Vedica Scholars</h1>
          <p className="text-gray-500 mt-1">Sign in to schedule your interview</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Application ID
              </label>
              <input
                type="text"
                value={appId}
                onChange={e => setAppId(e.target.value)}
                placeholder="ADM-2026-00001"
                required
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
              />
              <p className="mt-1.5 text-xs text-gray-400">
                Your Application ID was emailed to you after registration.
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-brand-500 hover:bg-brand-600 text-white font-medium rounded-lg text-sm transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in…' : 'Continue'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
