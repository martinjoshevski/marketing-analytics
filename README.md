# Pulse — Marketing analytics

A responsive Next.js portfolio product for growth managers managing Instagram, Facebook, and TikTok campaigns.

## Run

```sh
npm install
npm run dev
```

Open http://localhost:3000. Production verification: `npm run build`. Type checking: `npm run typecheck`.

## Features

- Overview with shared channel/date filters, KPI cards, interactive area charts, and channel breakdown
- Searchable and sortable campaign table, status filtering, campaign detail panel, pause/resume
- Create/edit forms with required fields, date validation, budget controls and spending-floor validation
- Channel and period comparisons with CSV export
- Locally saved workspace name, campaign changes, and light/dark appearance
- Responsive layout and keyboard-accessible controls

## Demo data

All records are fictional. The reporting window is September 2026. Shorter date ranges proportionally scale sample monthly totals; daily trends and previous-period comparisons are illustrative. New campaigns start with zero performance. Editing campaign metadata preserves historical totals. Data is stored in the current browser under `pulse-v1`; no API integrations, authentication, or backend is connected.

Stack: Next.js App Router, React, TypeScript, Recharts, Lucide icons, CSS.
