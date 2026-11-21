# GTA 6 Trophy Guide — make.fun entry (gta6-trophy-guide-01)

A complete, deterministic, offline-generated trophy guide website for GTA 6's
PSN-style trophy list: 55 trophies with per-trophy walkthroughs, difficulty and
time estimates, a 5-phase platinum roadmap, the 15 missable trophies flagged,
and a client-side localStorage checklist tracker.

## Run

Requires Node.js 22+ (uses built-in type stripping, stdlib only — zero dependencies).

```sh
node --experimental-strip-types main.ts
```

This regenerates the site into `build/`:

- `build/index.html` — all 55 trophies (1 platinum, 2 gold, 11 silver, 41 bronze),
  each with name, description, grade, points, secret/missable flags, category
  (story / grind / collectible / partner / heist / secret), difficulty 1-5,
  estimated minutes, and original walkthrough text. Includes the 5-phase platinum
  roadmap, a dedicated "15 missable trophies" section, and the checklist tracker.
- `build/style.css` — clean dark theme, responsive.

## Checklist tracker

Open `build/index.html` in any browser. Tick trophies off; progress is saved in
`localStorage` under the key `gta6-trophy-checklist`. A progress bar at the top
shows completion count and percentage; "Reset checklist" wipes it.

## Determinism

The generator uses no network, no clock, and no randomness — running it twice
produces byte-identical output.

## License

MIT — see [LICENSE](LICENSE).
