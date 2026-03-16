#!/usr/bin/env python3
"""
Fetches daily macro data from public APIs and updates data/macro.json.

Data sources:
  - FRED API (requires free API key: https://fred.stlouisfed.org/docs/api/api_key.html)
    - Core CPI: CPILFESL
    - Core PCE: PCEPILFE
    - Personal savings rate: PSAVERT
    - Fed funds rate: FEDFUNDS
    - U of Michigan consumer sentiment: UMCSENT

  - BLS Public Data API (no key required for basic usage)
    - Nonfarm payrolls: CES0000000001
    - Unemployment rate: LNS14000000

  - Atlanta Fed GDPNow JSON endpoint (public, no key)

  - Kalshi public market data (public, no key)

Run locally:
    FRED_API_KEY=your_key_here python scripts/fetch-data.py
"""

import json
import os
import sys
import requests
from datetime import datetime, date

FRED_API_KEY = os.environ.get("FRED_API_KEY", "")
DATA_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "macro.json")


def load_current() -> dict:
    with open(DATA_PATH) as f:
        return json.load(f)


def save(data: dict) -> None:
    with open(DATA_PATH, "w") as f:
        json.dump(data, f, indent=2)
    print(f"Saved {DATA_PATH}")


# ── FRED ─────────────────────────────────────────────────────────────────────

def fred_latest(series_id: str, n: int = 2) -> list[dict]:
    """Return the last n observations for a FRED series."""
    if not FRED_API_KEY:
        print(f"  [FRED] No API key — skipping {series_id}")
        return []
    url = "https://api.stlouisfed.org/fred/series/observations"
    params = {
        "series_id": series_id,
        "api_key": FRED_API_KEY,
        "file_type": "json",
        "sort_order": "desc",
        "limit": n,
    }
    try:
        resp = requests.get(url, params=params, timeout=15)
        resp.raise_for_status()
        obs = resp.json().get("observations", [])
        return [{"date": o["date"], "value": float(o["value"])} for o in obs if o["value"] != "."]
    except Exception as e:
        print(f"  [FRED] Error fetching {series_id}: {e}")
        return []


# ── BLS ──────────────────────────────────────────────────────────────────────

def bls_latest(series_ids: list[str]) -> dict[str, list[dict]]:
    """Fetch last 3 months from BLS public API v2 (no registration key needed)."""
    current_year = datetime.now().year
    payload = {
        "seriesid": series_ids,
        "startyear": str(current_year - 1),
        "endyear": str(current_year),
    }
    try:
        resp = requests.post(
            "https://api.bls.gov/publicAPI/v2/timeseries/data/",
            json=payload,
            timeout=15,
        )
        resp.raise_for_status()
        result = {}
        for series in resp.json().get("Results", {}).get("series", []):
            sid = series["seriesID"]
            obs = sorted(series["data"], key=lambda x: (x["year"], x["period"]), reverse=True)
            result[sid] = [
                {"year": o["year"], "period": o["period"], "value": float(o["value"])}
                for o in obs[:3]
            ]
        return result
    except Exception as e:
        print(f"  [BLS] Error: {e}")
        return {}


# ── Atlanta Fed GDPNow ───────────────────────────────────────────────────────

def gdpnow() -> dict | None:
    """Fetch Atlanta Fed GDPNow latest estimate."""
    url = "https://www.atlantafed.org/-/media/documents/cqer/researchcq/gdpnow/GDPNow.xlsx"
    # The Atlanta Fed publishes a JSON endpoint used by their chart
    json_url = "https://www.atlantafed.org/cqer/research/gdpnow/-/media/documents/cqer/researchcq/gdpnow/gdpnow-latest.js"
    try:
        resp = requests.get(json_url, timeout=15)
        # Their JS file exposes: var GDP_data = {...}
        text = resp.text
        start = text.find("{")
        end = text.rfind("}") + 1
        if start < 0 or end <= start:
            return None
        data = json.loads(text[start:end])
        # Extract the latest estimate
        series = data.get("GDPNow", {}).get("series", [])
        if series:
            latest = series[-1]
            return {"value": float(latest.get("y", 0)), "date": latest.get("x", "")}
    except Exception as e:
        print(f"  [Atlanta Fed] Error: {e}")
    return None


# ── Kalshi ───────────────────────────────────────────────────────────────────

def kalshi_recession() -> float | None:
    """Fetch Kalshi recession probability from their public REST API."""
    # Kalshi uses a REST API; the recession market ticker changes periodically.
    # We search for the most liquid 'recession before 2027' market.
    url = "https://trading-api.kalshi.com/trade-api/v2/markets"
    params = {"series_ticker": "RECES", "status": "open", "limit": 10}
    try:
        resp = requests.get(url, params=params, timeout=15)
        if resp.status_code != 200:
            return None
        markets = resp.json().get("markets", [])
        # Find market whose title contains '2027'
        for m in markets:
            if "2027" in m.get("title", "") or "recession" in m.get("title", "").lower():
                yes_ask = m.get("yes_ask", 0)
                yes_bid = m.get("yes_bid", 0)
                if yes_ask and yes_bid:
                    mid = (yes_ask + yes_bid) / 2
                    return round(mid, 1)
                elif yes_ask:
                    return round(yes_ask, 1)
    except Exception as e:
        print(f"  [Kalshi] Error: {e}")
    return None


# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    today = date.today().isoformat()
    print(f"Fetching macro data for {today}...")

    current = load_current()

    # ── FRED metrics ──
    if FRED_API_KEY:
        print("Fetching FRED data...")

        cpi = fred_latest("CPILFESL", 2)
        if len(cpi) >= 2:
            change = round(cpi[0]["value"] - cpi[1]["value"], 2)
            # Find and update Core CPI YoY in inflation sources
            for s in current["inflation"]["sources"]:
                if s["metric"] == "Core CPI YoY":
                    s["prior"] = cpi[1]["value"]
                    s["current"] = cpi[0]["value"]
                    s["change"] = change
                    s["date"] = today
                    print(f"  Core CPI: {cpi[0]['value']}% (was {cpi[1]['value']}%)")

        savings = fred_latest("PSAVERT", 1)
        if savings:
            current["personalSavingsRate"]["value"] = savings[0]["value"]
            current["personalSavingsRate"]["date"] = savings[0]["date"]
            print(f"  Personal savings rate: {savings[0]['value']}%")

        fedfunds = fred_latest("FEDFUNDS", 1)
        if fedfunds:
            current["fedFundsRate"]["currentMid"] = fedfunds[0]["value"]
            print(f"  Fed funds rate: {fedfunds[0]['value']}%")

        umich = fred_latest("UMCSENT", 1)
        if umich:
            current["consumerSentiment"]["umichSentiment"]["value"] = umich[0]["value"]
            current["consumerSentiment"]["umichSentiment"]["date"] = umich[0]["date"]
            print(f"  U of Michigan sentiment: {umich[0]['value']}")

    # ── BLS metrics ──
    print("Fetching BLS data...")
    bls_data = bls_latest(["CES0000000001", "LNS14000000"])

    payrolls = bls_data.get("CES0000000001", [])
    if len(payrolls) >= 2:
        change = round((payrolls[0]["value"] - payrolls[1]["value"]) * 1000, 0)
        current["jobs"]["payrolls"]["value"] = int(payrolls[0]["value"] * 1000)
        current["jobs"]["payrolls"]["prior"] = int(payrolls[1]["value"] * 1000)
        print(f"  Payrolls: {payrolls[0]['value']}K (prior: {payrolls[1]['value']}K)")

    unemp = bls_data.get("LNS14000000", [])
    if len(unemp) >= 2:
        current["jobs"]["unemploymentRate"]["value"] = unemp[0]["value"]
        current["jobs"]["unemploymentRate"]["prior"] = unemp[1]["value"]
        current["jobs"]["unemploymentRate"]["change"] = round(unemp[0]["value"] - unemp[1]["value"], 2)
        print(f"  Unemployment: {unemp[0]['value']}% (prior: {unemp[1]['value']}%)")

    # ── Atlanta Fed GDPNow ──
    print("Fetching Atlanta Fed GDPNow...")
    gdp = gdpnow()
    if gdp:
        prior = current["gdp"]["sources"][0]["growth"]
        current["gdp"]["sources"][0]["growth"] = round(gdp["value"], 1)
        current["gdp"]["sources"][0]["change"] = round(gdp["value"] - prior, 1)
        current["gdp"]["sources"][0]["date"] = today
        print(f"  GDPNow: {gdp['value']}%")
    else:
        print("  GDPNow: could not fetch (using cached value)")

    # ── Kalshi recession odds ──
    print("Fetching Kalshi recession odds...")
    kalshi_prob = kalshi_recession()
    if kalshi_prob is not None:
        for s in current["recession"]["sources"]:
            if s["name"] == "Kalshi":
                s["prior"] = s["probability"]
                s["change"] = round(kalshi_prob - s["probability"], 1)
                s["probability"] = kalshi_prob
                s["date"] = today
                print(f"  Kalshi recession probability: {kalshi_prob}%")
    else:
        print("  Kalshi: could not fetch (using cached value)")

    # Recalculate recession average
    probs = [s["probability"] for s in current["recession"]["sources"]]
    priors = [s["prior"] for s in current["recession"]["sources"]]
    current["recession"]["average"]["prior"] = round(sum(priors) / len(priors), 1)
    current["recession"]["average"]["current"] = round(sum(probs) / len(probs), 1)
    current["recession"]["average"]["change"] = round(
        current["recession"]["average"]["current"] - current["recession"]["average"]["prior"], 1
    )

    # Recalculate GDP average
    gdp_values = [s["growth"] for s in current["gdp"]["sources"]]
    gdp_priors = [s["prior"] for s in current["gdp"]["sources"]]
    current["gdp"]["average"]["current"] = round(sum(gdp_values) / len(gdp_values), 1)
    current["gdp"]["average"]["prior"] = round(sum(gdp_priors) / len(gdp_priors), 1)
    current["gdp"]["average"]["change"] = round(
        current["gdp"]["average"]["current"] - current["gdp"]["average"]["prior"], 1
    )

    # Update timestamp
    current["_meta"]["lastUpdated"] = today

    save(current)
    print("Done.")


if __name__ == "__main__":
    main()
