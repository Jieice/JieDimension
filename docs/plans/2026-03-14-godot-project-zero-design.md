# Godot Project Zero Web Entry Design

## Goal

Add `GodotProjectZero` to the existing `JieDimension` GitHub Pages site as a playable game entry under the `games` collection, while keeping changes small and consistent with the current Jekyll structure.

## Context

- Host repo: `D:/AI/JieDimension`
- Upstream source: `D:/AI/_temp/GodotProjectZero`
- The site already exposes game detail pages from `_games/*.md`
- A full self-hosted Godot Web export is currently blocked by tooling and bandwidth:
  - local Godot 4.3 exists, but the upstream project targets Godot 4.4
  - the repo does not include populated `.godot/imported` artifacts
  - downloading official Godot 4.4.1 assets from GitHub is reachable but too slow to finish in a reasonable cycle on this machine

## Approaches Considered

### 1. Full self-hosted export now

Pros:
- Best long-term ownership
- Runs fully from `www.jiece.art`

Cons:
- Requires Godot 4.4.x editor plus matching export templates
- Current network throughput makes that path too slow for this turn

### 2. Embed the upstream playable web build inside a new local game page

Pros:
- Immediately playable from `www.jiece.art`
- Fits the existing `_games` collection without changing site architecture
- Keeps attribution and upstream licensing intact

Cons:
- Runtime remains upstream-hosted for now
- Depends on third-party availability

### 3. Link-out only

Pros:
- Lowest effort

Cons:
- Fails the user's stated goal of playing from their own site

## Chosen Design

Use approach 2 for this turn.

Implementation will:

- add a new `_games/dark-forest.md` entry
- copy one upstream screenshot into `assets/images/games/dark-forest.png`
- embed the official playable page in an iframe
- provide explicit fallback links for new-tab play and source attribution
- document that a later pass can replace the iframe with a self-hosted export once Godot 4.4 tooling is available locally

## Error Handling

- If the iframe fails or is blocked, the page still offers a direct play link
- If upstream availability changes, the page still preserves the project listing and source link

## Testing

- Build the Jekyll site locally
- Confirm the new game card appears in `/games/`
- Confirm `/games/dark-forest/` renders and the iframe/link section appears
- Confirm the copied image resolves from the site build

