'use client'

import { useAuthContext } from '@/contexts/auth-context'

export function LoginButton() {
  const { login } = useAuthContext()

  return (
    <button
      onClick={login}
      className="w-full bg-sp-accent text-sp-bg font-bold py-3 px-8 rounded-full
                 hover:bg-white transition-colors duration-150 text-sm uppercase tracking-widest"
    >
      Log in with Spotify
    </button>
  )
}
