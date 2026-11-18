# Cadence — install on your Android phone

Cadence is a Progressive Web App: plain HTML/CSS/JS, **no build step, no account, no server-side anything**.
All workouts live in your phone's IndexedDB. After the first load it works with airplane mode on.

The one catch: Android Chrome only lets a site install as an app (and run offline) when it is served from
**https://** or **http://localhost**. Opening `index.html` straight from the Files app will *not* work.
Pick one of the two routes below.

---

## Route A — put the folder on free static hosting (about 5 minutes, easiest)

Hosting only serves the app's files once. Your workout data never leaves the phone.

**Netlify Drop (no account needed to try, or sign in for a permanent link)**
1. Unzip `cadence.zip` on a computer. You should see a folder containing `index.html`.
2. Open <https://app.netlify.com/drop> and drag that **folder** onto the page.
3. Netlify gives you an `https://….netlify.app` address. (Sign in to keep it permanently.)

**GitHub Pages (permanent, free)**
1. Create a new public repository, upload the *contents* of the folder (so `index.html` is at the top level).
2. Repository → Settings → Pages → Deploy from a branch → `main` / root → Save.
3. After a minute your app is at `https://<your-user>.github.io/<repo>/`.

**Then, on the phone**
1. Open the address in **Chrome**.
2. Wait a few seconds for the page to finish loading once (this caches everything for offline use).
3. Chrome menu **⋮ → Install app** (or *Add to Home screen*). Confirm.
4. Launch **Cadence** from the home screen. It opens full-screen like a native app.

---

## Route B — fully local, no internet host (Termux)

Good if you don't want the files on any website at all.

1. Install **Termux from F-Droid** (<https://f-droid.org/packages/com.termux/>). The Play Store build is outdated.
2. Copy `cadence.zip` to the phone's Downloads folder.
3. In Termux:
   ```sh
   termux-setup-storage            # allow storage access
   pkg install python unzip
   cd ~ && unzip ~/storage/downloads/cadence.zip
   cd cadence
   python -m http.server 8080
   ```
4. In Chrome open **http://localhost:8080**, wait for it to load, then **⋮ → Install app**.
5. Once installed you can stop the server (Ctrl-C). The installed app keeps working offline from its own cache.
   You only need the server again to install an updated version.

Keep using the same address/port (`localhost:8080`): browser storage belongs to that exact origin.

---

## Using it

| Tab | What it does |
| --- | --- |
| **Home** | Heatmap of the year (swipe sideways; ‹ › changes year; **Month** switches to a calendar). Tap any day to see what you did, or to log a workout for that day. Stats: sessions, streaks, this week/month, consistency. |
| **Workout** | Start a workout, **Add exercise** (search, multi-select, or type a new one to create it). Each set: weight, reps, optional RIR. **−/+** steppers use your weight step. Faint numbers are last time's set — tap ✓ with empty fields to log "same as last time" in one tap. Tap the set number for warm-up / duplicate / delete. **Add set** copies the previous set. **Finish** saves it. |
| **Progress** | Pick a lift: trend verdict (progressing / maintaining / regressing), top-weight chart, estimated 1RM chart, and — separately — volume chart. Personal records, previous workout, every session. Touch a chart to read exact values. |
| **History** | Every workout, newest first. Open one to inspect, **Edit**, **Repeat**, or delete it. |

Things worth knowing
- **Streaks are weekly**, because nobody trains every day: a streak is consecutive weeks with at least your weekly goal (default 3, change in Settings). Consistency compares your last 12 weeks with that goal.
- Heatmap shade = number of working sets that day (warm-ups don't count). Only *ticked* sets count.
- The workout autosaves on every change. If you close the app mid-workout, **Home → Resume workout** brings it back.
- Estimated 1RM uses the Epley formula: `weight × (1 + reps ÷ 30)`.
- Android's Back button closes sheets and screens before leaving the app.

## Back up your data (do this!)

Settings (top-right on Home) → **Export all data** downloads `cadence-backup-YYYY-MM-DD.json`. Do it every few weeks.
The share button next to it can send the file straight to Drive/Telegram/email.

- **Import backup** validates the file first and shows a summary. Choose **Merge** (adds only workouts you don't have, no duplicates) or **Replace** (swap everything; a safety copy is kept so you can **Undo last import**).
- Restoring on a new phone: install the app, Settings → Import backup → Replace.

Browsers can delete site data if you clear Chrome's storage or uninstall the app. Cadence asks Chrome to protect its storage, but **the JSON backup is your real safety net**.

## Updating the app later

Replace the files on your host (or in the Termux folder), bump `VERSION` in `sw.js` (e.g. `cadence-v2`), reload the app twice. Your data is untouched by updates.

## Project layout

```
index.html  manifest.webmanifest  sw.js     app shell, install metadata, offline cache
css/app.css                                  all styling (dark, one accent colour)
js/core.js                                   pure logic: stats, streaks, e1RM, PRs, trends, backup validation
js/db.js                                     IndexedDB wrapper
js/charts.js                                 dependency-free SVG charts
js/ui.js  js/app.js  js/editor.js            UI, screens, workout editor
fonts/ icons/                                bundled Inter font + app icons
tests/core.test.js  tests/e2e.js             unit tests (node --test) and Playwright end-to-end test
```
