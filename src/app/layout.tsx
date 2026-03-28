import type { Metadata } from 'next'
import Script from 'next/script'
import { AuthProvider } from '@/contexts/auth-context'
import { PlayerProvider } from '@/contexts/player-context'
import './globals.css'

export const metadata: Metadata = {
  title: 'Sportify',
  description: 'Spotify web music player',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-sp-bg text-sp-text antialiased">
        <AuthProvider>
          <PlayerProvider>
            {children}
          </PlayerProvider>
        </AuthProvider>
        <Script
          src="https://sdk.scdn.co/spotify-player.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  )
}
