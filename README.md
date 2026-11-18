# Cadence

Offline-first gym tracker (PWA). Heatmap consistency dashboard, fast set logging, progressive-overload analytics,
history, JSON backup/restore. Vanilla JS + IndexedDB, no build step, no dependencies, no network calls.

Run locally: `python3 -m http.server 8123` and open <http://localhost:8123>.
Android install instructions: see **INSTALL.md**.

Tests: `node --test tests/core.test.js` (unit) · `node tests/e2e.js` (Playwright, app served on :8123).
