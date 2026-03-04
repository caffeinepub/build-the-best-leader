# Build the Best Leader

## Current State
Full game app is working (start screen, team name, trait selection, results, leaderboard). The backend uses `mo:core/Map` with `Map.empty()` and calls `entries.add(...)` and `entries.clear()`. This is an immutable functional map -- mutations are not persisted between calls, so submitted entries are never stored and the leaderboard always returns empty.

## Requested Changes (Diff)

### Add
- Nothing new

### Modify
- Backend: Replace `mo:core/Map` (immutable) with `mo:base/HashMap` (mutable). Use `HashMap.HashMap` with `Text.equal` and `Text.hash`. Replace `entries.add(k, v)` with `entries.put(k, v)`. Replace `entries.values().toArray()` with `Iter.toArray(entries.vals())`. Replace `entries.clear()` with iterating keys and calling `entries.remove(key)`.

### Remove
- Nothing

## Implementation Plan
1. Regenerate Motoko backend using mutable `HashMap` from `mo:base` so that submitted team entries are actually persisted across canister calls.
2. Deploy.
