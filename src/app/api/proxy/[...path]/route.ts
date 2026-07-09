import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const BACKEND = process.env.FRAPPE_URL || 'https://vedica.origensystems.com'
const BACKEND_HOST = new URL(BACKEND).hostname

function buildHeaders(sid: string, csrf?: string): Record<string, string> {
  const cookieStr = csrf ? `sid=${sid}; csrftoken=${csrf}` : `sid=${sid}`
  const h: Record<string, string> = {
    Cookie: cookieStr,
    Host: BACKEND_HOST,
    'X-Forwarded-Host': BACKEND_HOST,
  }
  if (csrf) h['X-Frappe-CSRF-Token'] = csrf
  return h
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const jar = await cookies()
  const sid = jar.get('frappe_sid')?.value || 'Guest'
  const csrf = jar.get('frappe_csrf')?.value

  const resolvedParams = await params;
  const apiPath = resolvedParams.path.join('/')
  const search = new URL(request.url).search
  const url = `${BACKEND}/api/method/${apiPath}${search}`

  try {
    const res = await fetch(url, { headers: buildHeaders(sid, csrf), cache: 'no-store' })
    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch {
    return NextResponse.json({ message: 'Proxy error' }, { status: 502 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const jar = await cookies()
  const sid = jar.get('frappe_sid')?.value || 'Guest'
  const csrf = jar.get('frappe_csrf')?.value

  const resolvedParams = await params;
  const apiPath = resolvedParams.path.join('/')
  const url = `${BACKEND}/api/method/${apiPath}`

  const formData = await request.formData()
  const params2 = new URLSearchParams()
  formData.forEach((value, key) => params2.append(key, String(value)))

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        ...buildHeaders(sid, csrf),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params2.toString(),
      cache: 'no-store',
    })

    const text = await res.text()
    let data: unknown
    try { data = JSON.parse(text) } catch { data = { message: text } }

    const response = NextResponse.json(data, { status: res.status })

    const setCookieHeaders = res.headers.getSetCookie?.() ?? []
    for (const raw of setCookieHeaders) {
      const sidM = raw.match(/^sid=([^;]+)/i)
      const csrfM = raw.match(/^csrftoken=([^;]+)/i)
      if (sidM?.[1] && sidM[1] !== 'Guest') {
        response.cookies.set('frappe_sid', sidM[1], {
          httpOnly: true, sameSite: 'lax', maxAge: 86400, path: '/',
        })
      }
      if (csrfM?.[1]) {
        response.cookies.set('frappe_csrf', csrfM[1], {
          httpOnly: true, sameSite: 'lax', maxAge: 86400, path: '/',
        })
      }
    }

    return response
  } catch {
    return NextResponse.json({ message: 'Proxy error' }, { status: 502 })
  }
}
