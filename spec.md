# Build the Best Leader

## Current State
- Full 5-step game flow: Start → Team Name → Trait Selection → Results → Leaderboard
- Backend stores `TeamEntry` with `totalScore: Nat` (unsigned) — corrupts negative scores
- Frontend polls leaderboard every 5 seconds via `refetchInterval`
- No host/projection view
- No URL-based direct leaderboard access

## Requested Changes (Diff)

### Add
- Host view accessible via `?host=true` URL param — fullscreen leaderboard auto-updates, no play-again button, designed for projection
- Start screen "Host View" link that opens `?host=true` in a new tab
- Faster polling (2s instead of 5s) when on the leaderboard or host view
- Rank number column on leaderboard (1, 2, 3... not just medals)

### Modify
- Backend: change `totalScore` from `Nat` to `Int` so negative scores store and retrieve correctly
- Frontend `useSubmitEntry`: pass `totalScore` as `bigint` directly (already done), but must match new `Int` backend type
- `useGetLeaderboard`: reduce refetchInterval to 2000ms for near-real-time feel
- Leaderboard display: show explicit rank number alongside medal emoji for top 3
- Footer note: update from "Auto-updates every 5 seconds" to "Auto-updates every 2 seconds"

### Remove
- Nothing removed

## Implementation Plan
1. Update backend `main.mo`: change `totalScore: Nat` → `totalScore: Int` in `TeamEntry` type and `submitEntry` signature; fix compare logic to use `Int` comparison
2. Regenerate `backend.d.ts` to reflect `totalScore: bigint` (already bigint in TS, no change needed in frontend types)
3. Update `useQueries.ts`: reduce `refetchInterval` to 2000
4. Update `App.tsx`:
   - Add `?host=true` detection at app root — render `HostView` fullscreen if present
   - Add "Host View" button on StartScreen that opens `?host=true`
   - Update leaderboard subtitle text
   - `HostView` component: fullscreen dark leaderboard, no game nav, polls every 2s, shows rank + team + score
