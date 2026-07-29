---
title: "Classic Snake"
published: 2026-03-14
description: "Classic Snake, kept intentionally small: one grid, one food item, score tracking, game-over on wall or self collision, and instant restart."
image: "/assets/images/games/snake.svg"
tags: ["游戏", "Web"]
category: "游戏作品"
draft: false
---

Classic Snake, kept intentionally small: one grid, one food item, score tracking, game-over on wall or self collision, and instant restart.

## Play in the page

<div style="text-align: center; margin: 2rem 0;">
  <iframe
    src="/assets/games/snake/"
    width="100%"
    height="940"
    style="max-width: 980px; border: 1px solid var(--glass-border); border-radius: 16px; background: var(--bg-surface);"
    loading="lazy"
    title="Classic Snake">
  </iframe>
</div>

## Controls

- Arrow keys or `WASD` to steer
- `Space`, `Enter`, or the on-screen button to pause and resume
- `R` or the restart button to reset the run

## Manual checks

- Food should always spawn on an empty cell
- Reversing directly into the snake should be ignored
- Hitting a wall or the body should stop the game immediately
- Restart should reset score, length, food, and direction
