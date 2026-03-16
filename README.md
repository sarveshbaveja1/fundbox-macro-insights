# Fundbox Macro Insights

A public-facing, Fundbox-branded website surfacing macro lending industry trends for risk managers at banks and fintech lenders. Hosted on Netlify, source on GitHub, data auto-updated daily.

## Pages

| Page | URL | Description |
|------|-----|-------------|
| Dashboard | `/` | KPI strip + section overview |
| Economic Indicators | `/economy` | GDP, inflation, jobs, Fed rates, savings |
| Consumer Credit | `/consumer-credit` | Delinquencies, BNPL, K-shape, report syntheses |
| Small Business Credit | `/small-business` | SBI, charge-offs, tariffs, adverse selection |
| Betting Markets | `/markets` | Recession odds, GDP predictions |

## Local Development

```bash
npm install
npm run dev
# Open http://localhost:3000
```

## Daily Data Updates

`data/macro.json` is auto-refreshed daily by GitHub Actions at 8am ET.

### Required GitHub Secrets

| Secret | Description |
|--------|-------------|
| `FRED_API_KEY` | Free key from [fred.stlouisfed.org](https://fred.stlouisfed.org/docs/api/api_key.html) |
| `NETLIFY_DEPLOY_HOOK` | Webhook from Netlify → Site Settings → Build & Deploy → Build hooks |

### Manual fetch (local)

```bash
FRED_API_KEY=your_key python scripts/fetch-data.py
```

## Adding a Report (TransUnion or 2OS)

1. Add the PDF to `public/reports/filename.pdf`
2. Add an entry to `data/transunion-reports.json` or `data/2os-reports.json`:

```json
{
  "id": "unique-id",
  "title": "Report Title",
  "date": "2026-03-01",
  "category": "consumer",
  "source": "TransUnion",
  "keyFindings": ["Finding 1", "Finding 2"],
  "synthesis": "Full synthesis text here...",
  "pdfPath": "/reports/filename.pdf"
}
```

- `"category": "consumer"` → Consumer Credit page
- `"category": "small-business"` → Small Business Credit page
- Set `"pdfPath": null` if no PDF — the Download button won't appear

3. Commit and push → Netlify auto-deploys.

## Netlify Deployment

1. Import the GitHub repo in Netlify
2. Build command: `npm run build`
3. Publish directory: `out`
4. Add `NETLIFY_DEPLOY_HOOK` as a GitHub secret

## Data Sources

- **FRED** — GDP, CPI, PCE, savings rate, Fed funds, consumer sentiment
- **BLS** — Nonfarm payrolls, unemployment rate
- **Atlanta Fed GDPNow** — Q1 real GDP nowcast
- **Kalshi** — Prediction market recession probability
- **TransUnion / 2OS** — Manually curated via `data/` JSON files
