# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Sportify** is a Next.js 14 (App Router) web music player that uses the Spotify Web API and Web Playback SDK to let users search for and play music in the browser. It uses TypeScript and Tailwind CSS.

## Development Commands

```bash
# Install dependencies
npm install

# Start dev server (always access via http://127.0.0.1:3000, NOT localhost)
npm run dev

# Build for production (static export)
npm run build

# Lint
npm run lint
```

## Environment Setup

Copy `.env.local.example` to `.env.local` and fill in your Spotify Client ID:
```
NEXT_PUBLIC_SPOTIFY_CLIENT_ID=your_client_id_here
```

In your Spotify Developer Dashboard, add this redirect URI:
```
http://127.0.0.1:3000/callback
```

## Architecture

### Auth Flow (PKCE — no backend required)
- `src/lib/auth/pkce.ts` — generates code verifier/challenge using Web Crypto API
- `src/lib/auth/spotify-auth.ts` — builds Spotify auth URL, exchanges/refreshes tokens
- `src/lib/auth/token-store.ts` — sessionStorage helpers; tokens expire with a 60s buffer
- `src/contexts/auth-context.tsx` — `AuthProvider` with `isAuthenticated`, `login()`, `logout()`, `refreshIfNeeded()`

### Spotify API Client
- `src/lib/spotify/client.ts` — fetch wrapper: auto-attaches Bearer token, handles 401 retry after refresh, 429 exponential backoff (up to 3 retries, reads `Retry-After` header)
- `src/lib/spotify/api.ts` — typed wrappers for all endpoints used (search, player control, playback transfer)
- `src/lib/spotify/types.ts` — TypeScript interfaces matching the Spotify OpenAPI schema

### Web Playback SDK
- `src/contexts/player-context.tsx` — initializes `window.Spotify.Player`, transfers playback to this device on `ready`, exposes playback controls
- `src/types/spotify-sdk.d.ts` — TypeScript declarations for `window.Spotify` and `Spotify.Player`
- SDK loaded via `<Script strategy="lazyOnload">` in `src/app/layout.tsx`

### Pages
| Route | Purpose |
|-------|---------|
| `/` | Redirects to `/dashboard` or `/login` |
| `/login` | Login card with Spotify OAuth button |
| `/callback` | Handles OAuth redirect, validates PKCE state, exchanges code for tokens |
| `/dashboard` | Search interface with player bar |

### Key Patterns
- **Token refresh**: `refreshIfNeeded()` in auth context; `getOAuthToken` SDK callback also handles async refresh
- **Seek bar position**: `usePlayer()` hook (`src/hooks/use-player.ts`) drives a `localPosition` via `requestAnimationFrame` while playing — avoids 1s polling lag
- **Search debounce**: 400 ms timeout in `useSearch()` hook (`src/hooks/use-search.ts`)
- **Scopes requested**: `streaming user-read-email user-read-private user-read-playback-state user-modify-playback-state user-read-currently-playing`

### Design Tokens (Tailwind)
| Token | Value | Use |
|-------|-------|-----|
| `sp-bg` | `#181818` | Page background |
| `sp-surface` | `#282828` | Cards, bars |
| `sp-elevated` | `#333333` | Hover state |
| `sp-text` | `#cccccc` | Body text |
| `sp-muted` | `#b3b3b3` | Secondary text |
| `sp-accent` | `#75AADB` | Active/highlight |

## Notes
- Spotify Premium is required for in-browser playback via the Web Playback SDK
- Always use `http://127.0.0.1:3000` (not `localhost`) — Spotify rejects `localhost` redirect URIs
- The Client Secret is never used; PKCE removes the need for it
