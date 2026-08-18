#!/usr/bin/env python3
"""Weekly Plausible analytics automation.

Fetches the previous complete week (Mon-Sun) of stats from the Plausible
Stats API (v2), appends a summary to a Markdown archive committed back to
the repo, and emails the report via Gmail SMTP.

All configuration comes from environment variables so nothing sensitive is
stored in the repository:

Required secrets:
  PLAUSIBLE_API_TOKEN   Plausible API token (Bearer auth).
  GMAIL_ADDRESS         Gmail account used to send the report.
  GMAIL_APP_PASSWORD    Gmail app password (not the account password).

Optional (with sensible defaults, safe to keep as plain workflow env vars):
  PLAUSIBLE_SITE_ID     Site domain in Plausible (default: carmelplace.com).
  PLAUSIBLE_BASE_URL    Plausible host (default: https://plausible.io).
  REPORT_RECIPIENTS     Comma-separated recipients (default: GMAIL_ADDRESS).
  ARCHIVE_PATH          Markdown archive path (default: analytics/plausible_weekly_archive.md).
"""

from __future__ import annotations

import datetime as dt
import json
import os
import smtplib
import ssl
import sys
import urllib.error
import urllib.request
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText


# --------------------------------------------------------------------------- #
# Configuration
# --------------------------------------------------------------------------- #

def require_env(name: str) -> str:
    value = os.environ.get(name, "").strip()
    if not value:
        sys.exit(f"ERROR: required environment variable {name} is not set.")
    return value


PLAUSIBLE_API_TOKEN = require_env("PLAUSIBLE_API_TOKEN")
GMAIL_ADDRESS = require_env("GMAIL_ADDRESS")
GMAIL_APP_PASSWORD = require_env("GMAIL_APP_PASSWORD")

SITE_ID = os.environ.get("PLAUSIBLE_SITE_ID", "carmelplace.com").strip()
BASE_URL = os.environ.get("PLAUSIBLE_BASE_URL", "https://plausible.io").strip().rstrip("/")
RECIPIENTS = [
    addr.strip()
    for addr in os.environ.get("REPORT_RECIPIENTS", GMAIL_ADDRESS).split(",")
    if addr.strip()
]
ARCHIVE_PATH = os.environ.get(
    "ARCHIVE_PATH", "analytics/plausible_weekly_archive.md"
).strip()

REQUEST_TIMEOUT = 30

# Aggregate metrics, in the order they are requested from (and returned by)
# the v2 query API.
AGG_METRICS = ["visitors", "pageviews", "visits", "bounce_rate", "visit_duration"]


# --------------------------------------------------------------------------- #
# Date range: previous complete week (Monday .. Sunday)
# --------------------------------------------------------------------------- #

def previous_week_range(today: dt.date | None = None) -> tuple[dt.date, dt.date]:
    """Return (Monday, Sunday) of the week before ``today``."""
    today = today or dt.date.today()
    # Monday of the current week.
    this_monday = today - dt.timedelta(days=today.weekday())
    last_monday = this_monday - dt.timedelta(days=7)
    last_sunday = last_monday + dt.timedelta(days=6)
    return last_monday, last_sunday


# --------------------------------------------------------------------------- #
# Plausible Stats API (v2)
#
# The v2 API exposes a single POST endpoint, ``/api/v2/query``. Both
# aggregate figures and breakdowns are expressed as JSON query bodies:
#
#   {"site_id": ..., "metrics": [...], "date_range": ["YYYY-MM-DD", ...],
#    "dimensions": [...], "order_by": [...], "pagination": {...}}
#
# Results come back as a list of {"metrics": [...], "dimensions": [...]}
# rows, where each metric/dimension is positional (same order as the query).
# --------------------------------------------------------------------------- #

def _plausible_query(payload: dict) -> dict:
    url = f"{BASE_URL}/api/v2/query"
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        url,
        data=data,
        headers={
            "Authorization": f"Bearer {PLAUSIBLE_API_TOKEN}",
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=REQUEST_TIMEOUT) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as exc:
        body = exc.read().decode("utf-8", "replace")
        sys.exit(f"ERROR: Plausible API {exc.code}: {body}")
    except urllib.error.URLError as exc:
        sys.exit(f"ERROR: could not reach Plausible API: {exc.reason}")


def fetch_aggregate(date_range: list[str]) -> dict:
    """Return a metric -> value mapping for the whole date range."""
    data = _plausible_query(
        {
            "site_id": SITE_ID,
            "metrics": AGG_METRICS,
            "date_range": date_range,
        }
    )
    results = data.get("results", [])
    if not results:
        return {metric: None for metric in AGG_METRICS}
    values = results[0].get("metrics", [])
    return {
        metric: (values[idx] if idx < len(values) else None)
        for idx, metric in enumerate(AGG_METRICS)
    }


def fetch_breakdown(
    date_range: list[str], dimension: str, metric: str, limit: int = 10
) -> list[dict]:
    """Return breakdown rows as ``[{"name": str|None, "value": num|None}]``."""
    data = _plausible_query(
        {
            "site_id": SITE_ID,
            "metrics": [metric],
            "date_range": date_range,
            "dimensions": [dimension],
            "order_by": [[metric, "desc"]],
            "pagination": {"limit": limit},
        }
    )
    rows: list[dict] = []
    for entry in data.get("results", []):
        dims = entry.get("dimensions", [])
        metrics = entry.get("metrics", [])
        rows.append(
            {
                "name": dims[0] if dims else None,
                "value": metrics[0] if metrics else None,
            }
        )
    return rows


# --------------------------------------------------------------------------- #
# Formatting
# --------------------------------------------------------------------------- #

def fmt_duration(seconds) -> str:
    if seconds is None:
        return "n/a"
    seconds = int(seconds)
    minutes, secs = divmod(seconds, 60)
    return f"{minutes}m {secs}s"


def fmt_number(value) -> str:
    if value is None:
        return "n/a"
    try:
        return f"{int(value):,}"
    except (TypeError, ValueError):
        return str(value)


def fmt_percent(value) -> str:
    return "n/a" if value is None else f"{value}%"


def build_report(start: dt.date, end: dt.date) -> tuple[str, str]:
    """Return (markdown, html) versions of the report."""
    date_range = [start.isoformat(), end.isoformat()]
    agg = fetch_aggregate(date_range)
    top_sources = fetch_breakdown(date_range, "visit:source", "visitors")
    top_pages = fetch_breakdown(date_range, "event:page", "pageviews")

    label = f"{start.strftime('%b %d, %Y')} – {end.strftime('%b %d, %Y')}"

    # --- Markdown (also used for the archive) --- #
    md = [f"## Week of {label} ({SITE_ID})", ""]
    md += [
        f"- **Unique visitors:** {fmt_number(agg.get('visitors'))}",
        f"- **Total visits:** {fmt_number(agg.get('visits'))}",
        f"- **Pageviews:** {fmt_number(agg.get('pageviews'))}",
        f"- **Bounce rate:** {fmt_percent(agg.get('bounce_rate'))}",
        f"- **Avg. visit duration:** {fmt_duration(agg.get('visit_duration'))}",
        "",
        "**Top sources**",
        "",
    ]
    if top_sources:
        for row in top_sources:
            name = row.get("name") or "(direct)"
            md.append(f"- {name}: {fmt_number(row.get('value'))}")
    else:
        md.append("- (no data)")
    md += ["", "**Top pages**", ""]
    if top_pages:
        for row in top_pages:
            page = row.get("name") or "(unknown)"
            md.append(f"- {page}: {fmt_number(row.get('value'))}")
    else:
        md.append("- (no data)")
    md.append("")
    markdown = "\n".join(md)

    # --- HTML (for the email body) --- #
    def rows_html(rows, fallback="(direct)"):
        if not rows:
            return "<li>(no data)</li>"
        items = []
        for row in rows:
            name = row.get("name") or fallback
            items.append(f"<li>{name}: <strong>{fmt_number(row.get('value'))}</strong></li>")
        return "".join(items)

    html = f"""\
<html><body style="font-family:Arial,Helvetica,sans-serif;color:#222;">
<h2>Weekly Analytics — {SITE_ID}</h2>
<p style="color:#666;">Week of {label}</p>
<table cellpadding="6" cellspacing="0" style="border-collapse:collapse;">
<tr><td>Unique visitors</td><td><strong>{fmt_number(agg.get('visitors'))}</strong></td></tr>
<tr><td>Total visits</td><td><strong>{fmt_number(agg.get('visits'))}</strong></td></tr>
<tr><td>Pageviews</td><td><strong>{fmt_number(agg.get('pageviews'))}</strong></td></tr>
<tr><td>Bounce rate</td><td><strong>{fmt_percent(agg.get('bounce_rate'))}</strong></td></tr>
<tr><td>Avg. visit duration</td><td><strong>{fmt_duration(agg.get('visit_duration'))}</strong></td></tr>
</table>
<h3>Top sources</h3>
<ul>{rows_html(top_sources)}</ul>
<h3>Top pages</h3>
<ul>{rows_html(top_pages, fallback='(unknown)')}</ul>
<hr>
<p style="color:#999;font-size:12px;">Generated automatically from Plausible Analytics.</p>
</body></html>
"""
    return markdown, html


# --------------------------------------------------------------------------- #
# Archive
# --------------------------------------------------------------------------- #

def update_archive(markdown: str) -> None:
    path = ARCHIVE_PATH
    directory = os.path.dirname(path)
    if directory:
        os.makedirs(directory, exist_ok=True)

    header = "# Plausible Weekly Analytics Archive\n\n"
    existing = ""
    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as fh:
            existing = fh.read()
    if not existing:
        existing = header
    elif not existing.startswith("# "):
        existing = header + existing

    # Newest entry first, right after the top-level header.
    lines = existing.split("\n")
    insert_at = 1
    for idx, line in enumerate(lines):
        if line.startswith("# "):
            insert_at = idx + 1
            break
    new_content = "\n".join(
        lines[:insert_at] + ["", markdown] + lines[insert_at:]
    )
    with open(path, "w", encoding="utf-8") as fh:
        fh.write(new_content)
    print(f"Archive updated: {path}")


# --------------------------------------------------------------------------- #
# Email
# --------------------------------------------------------------------------- #

def send_email(subject: str, text_body: str, html_body: str) -> None:
    message = MIMEMultipart("alternative")
    message["Subject"] = subject
    message["From"] = GMAIL_ADDRESS
    message["To"] = ", ".join(RECIPIENTS)
    message.attach(MIMEText(text_body, "plain", "utf-8"))
    message.attach(MIMEText(html_body, "html", "utf-8"))

    context = ssl.create_default_context()
    with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context, timeout=REQUEST_TIMEOUT) as server:
        server.login(GMAIL_ADDRESS, GMAIL_APP_PASSWORD)
        server.sendmail(GMAIL_ADDRESS, RECIPIENTS, message.as_string())
    print(f"Email sent to: {', '.join(RECIPIENTS)}")


# --------------------------------------------------------------------------- #
# Main
# --------------------------------------------------------------------------- #

def main() -> None:
    start, end = previous_week_range()
    print(f"Building Plausible report for {SITE_ID}: {start} .. {end}")

    markdown, html = build_report(start, end)
    print(markdown)

    update_archive(markdown)

    subject = f"Weekly Analytics — {SITE_ID} — {start.isoformat()} to {end.isoformat()}"
    send_email(subject, markdown, html)
    print("Done.")


if __name__ == "__main__":
    main()
