'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { exchangeToken } from '@/lib/auth/spotify-auth'

export default function CallbackPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')
    const state = params.get('state')
    const errorParam = params.get('error')

    if (errorParam) {
      setError(`Spotify denied access: ${errorParam}`)
      return
    }

    const storedState = sessionStorage.getItem('pkce_state')
    if (!state || state !== storedState) {
      setError('Invalid state parameter. Possible CSRF attack.')
      return
    }

    if (!code) {
      setError('No authorization code received.')
      return
    }

    exchangeToken(code)
      .then(() => router.replace('/dashboard'))
      .catch((err: Error) => setError(err.message))
  }, [router])

  if (error) {
    return (
      <div className="min-h-screen bg-sp-bg flex items-center justify-center">
        <div className="bg-sp-surface rounded-xl p-8 max-w-sm w-full text-center">
          <p className="text-red-400 font-medium mb-4">Authentication failed</p>
          <p className="text-sp-muted text-sm mb-6">{error}</p>
          <a
            href="/login"
            className="text-sp-accent underline text-sm hover:text-white transition-colors"
          >
            Back to login
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-sp-bg flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-sp-accent border-t-transparent rounded-full animate-spin" />
        <p className="text-sp-muted text-sm">Connecting to Spotify…</p>
      </div>
    </div>
  )
}
