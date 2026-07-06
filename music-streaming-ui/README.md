# Melodex — Music Streaming App (Frontend)

A Spotify-style music streaming web app frontend, built with **React 18 + TypeScript + Vite**,
**MUI v7**, **Material React Table**, **React Hook Form + Yup**, and **Redux Toolkit**.

This is the headless-API client for the `MusicStreamingSystem` ASP.NET Core (.NET 8) backend.
There is no real audio playback — play/pause is a UI-only state toggle, as specified.

## Getting started

```bash
npm install
cp .env.example .env   # adjust VITE_API_BASE_URL if your API runs on a different port
npm run dev
```

The app expects the backend to be running and reachable at `VITE_API_BASE_URL`
(defaults to `http://localhost:5295/api`, matching the backend's `launchSettings.json`
HTTP profile). Make sure CORS on the backend allows `http://localhost:5173`.

```bash
npm run build     # type-checks (tsc -b) and produces a production build in dist/
npm run lint       # eslint
npm run preview    # preview the production build
```

## Feature overview

- **Auth** — Login / Register screens, JWT stored in `localStorage`, attached to every
  request via an axios interceptor. New accounts get the `User` role by default; the
  `Admin` role must currently be granted directly in the database (the backend has no
  "promote to admin" endpoint).
- **Home** — Popular artists + a "New Albums" rail (aggregated client-side across artists,
  see note below).
- **Artists** — Browse all artists; artist detail page lists their albums.
- **Album detail** — Cover, year, tracklist with durations (`mm:ss`), "Add to playlist"
  per song.
- **Search** — Debounced search-by-title against `GET /api/Song?search=`.
- **Playlists** — Create / rename / delete playlists, add/remove songs, "Add to playlist"
  modal reachable from album and search views.
- **Admin** (visible only when logged in as `Admin`) — CRUD for Artists, Albums, and
  Songs, each backed by `material-react-table` and validated `react-hook-form` + `yup`
  dialogs, including image upload for artist/album covers.
- **Player bar** — Shows the "now playing" song with play/pause/next/previous controls.
  No audio actually plays, per the assignment brief — it's state only.

## Notes on the backend contract

A few gaps exist in the currently-implemented backend controllers relative to the
original spec, which this frontend works around without needing backend changes:

- There is no `GET /api/Album` (all albums) endpoint — only `GET /api/Album/{artistId}`
  and `GET /api/Album/details/{albumId}`. The Home page and Admin "Manage Albums" page
  fetch each artist's albums and merge them client-side.
- `GET /api/Album/details/{albumId}` does not return the album's track list (the
  underlying `AlbumResponse` DTO has no `Songs` collection). The Album Details page
  works around this by fetching `GET /api/Song` and filtering by matching
  `artistName` + `albumName`, since songs aren't tagged with an `albumId` in the
  response either. If you control the backend, exposing `Songs` on the album-details
  endpoint (the `sp_GetAlbumById` stored procedure already returns a second result set
  for this) or adding an `albumId` filter to `GET /api/Song` would let this be done
  more robustly.
- `GET /api/Playlist` (the list endpoint) does not reliably return each playlist's
  song list, so playlist cards show a song count only when the API happens to include
  it; open a playlist for the authoritative list.

## Project structure

```
src/
  api/            axios client + one module per resource (artist/album/song/playlist/auth)
  app/            redux store
  components/     cards, tables, dialogs, playlist widgets, the player, shared UI
  hooks/          useAuth, useDebounce
  layouts/        MainLayout (sidebar + topbar + player bar)
  pages/          one folder per route
  redux/          auth slice, player slice
  routes/         route guards + route table
  theme/          MUI dark theme
  types/          TypeScript types matching the backend DTOs
  utils/          constants, formatDuration
```
