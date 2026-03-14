# Godot Project Zero Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Publish a playable `GodotProjectZero` entry on the `JieDimension` GitHub Pages site using the smallest safe integration path available in the current environment.

**Architecture:** Reuse the existing Jekyll `games` collection. Add one new game markdown page plus one local screenshot asset. For this turn, embed the upstream playable build and preserve attribution instead of waiting for a slow local Godot 4.4 export pipeline.

**Tech Stack:** Jekyll, Markdown front matter, existing site layouts, static image assets

---

### Task 1: Add the design and plan docs

**Files:**
- Create: `D:/AI/JieDimension/docs/plans/2026-03-14-godot-project-zero-design.md`
- Create: `D:/AI/JieDimension/docs/plans/2026-03-14-godot-project-zero.md`

**Step 1: Write the docs**

Document the chosen embed-first deployment path and the blocked self-host path.

**Step 2: Verify files exist**

Run: `Get-ChildItem 'D:/AI/JieDimension/docs/plans'`
Expected: both plan files are listed

### Task 2: Add the game listing asset

**Files:**
- Create: `D:/AI/JieDimension/assets/images/games/dark-forest.png`
- Source: `D:/AI/_temp/GodotProjectZero/.github/docs/sc14_1.png`

**Step 1: Copy the upstream screenshot**

Run: `Copy-Item ...`

**Step 2: Verify the asset exists**

Run: `Get-Item 'D:/AI/JieDimension/assets/images/games/dark-forest.png'`
Expected: the copied image is present

### Task 3: Add the new game page

**Files:**
- Create: `D:/AI/JieDimension/_games/dark-forest.md`

**Step 1: Add front matter**

Include title, platform, image, status, date, and outbound links.

**Step 2: Add page body**

Include:
- short description
- iframe embed block
- fallback note for new-tab play
- licensing and attribution note

**Step 3: Verify the file content**

Run: `Get-Content 'D:/AI/JieDimension/_games/dark-forest.md'`
Expected: front matter and embed section render as intended

### Task 4: Build and verify the site

**Files:**
- Modify: none expected
- Verify: `D:/AI/JieDimension/_games/dark-forest.md`
- Verify: `D:/AI/JieDimension/assets/images/games/dark-forest.png`

**Step 1: Run the Jekyll build**

Run: `bundle exec jekyll build`
Expected: exit code 0

**Step 2: Check generated paths**

Run: inspect `_site/games/dark-forest/index.html`
Expected: page exists with iframe markup and image references

**Step 3: Review git diff**

Run: `git -C 'D:/AI/JieDimension' status --short`
Expected: only intended new files appear

### Task 5: Publish

**Files:**
- Commit: design docs, image, and game page

**Step 1: Commit**

```bash
git -C 'D:/AI/JieDimension' add docs/plans/2026-03-14-godot-project-zero-design.md docs/plans/2026-03-14-godot-project-zero.md assets/images/games/dark-forest.png _games/dark-forest.md
git -C 'D:/AI/JieDimension' commit -m "feat: add dark forest game page"
```

**Step 2: Push**

```bash
git -C 'D:/AI/JieDimension' push origin master
```

