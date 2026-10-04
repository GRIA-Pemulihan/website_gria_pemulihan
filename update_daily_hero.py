#!/usr/bin/env python3
"""
GRIA V26 — Daily Hero Photo updater.

Runs in GitHub Actions. Selects one freely licensed, landscape-oriented
photo from Wikimedia Commons each day and writes daily-hero.json.

No API key required.
"""
from __future__ import annotations

import datetime as dt
import hashlib
import html as html_lib
import json
import re
import urllib.parse
import urllib.request
from pathlib import Path

OUT = Path("daily-hero.json")
API = "https://commons.wikimedia.org/w/api.php"
UA = "GRIA-Pemulihan-Palu-DailyHero/1.0 (GitHub Pages church PWA)"
PALU = dt.timezone(dt.timedelta(hours=8))

# Weekly visual rhythm: mostly calm nature; Tuesday/Sunday lean Christian.
DAY_CATEGORIES = {
    0: ["Quality images of landscapes", "Quality images of sunsets"],
    1: ["Christian crosses with flowers", "Christian crosses"],
    2: ["Quality images of mountains", "Quality images of landscapes"],
    3: ["Featured pictures of sunsets", "Quality images of sunsets"],
    4: ["Quality images of landscapes", "Quality images of mountains"],
    5: ["Quality images of sunsets", "Featured pictures of mountains"],
    6: ["Draped Easter Crosses", "Christian crosses", "Featured pictures of sunsets"],
}

FALLBACK_CATEGORIES = [
    "Quality images of landscapes",
    "Featured pictures of sunsets",
    "Quality images of sunsets",
    "Quality images of mountains",
    "Featured pictures of mountains",
]

BLOCKED_WORDS = {
    "diagram", "map", "chart", "coat of arms", "heraldry", "flag", "logo",
    "icon", "symbol", "svg", "painting", "illustration", "manuscript",
    "stamp", "poster", "book cover", "grave", "cemetery", "tomb",
    "war memorial", "road sign", "military"
}

ALLOWED_LICENSE_MARKERS = (
    "CC BY",        # includes CC BY-SA
    "CC0",
    "PUBLIC DOMAIN",
    "PDM",
)


def clean_html(value: str, limit: int = 180) -> str:
    value = html_lib.unescape(value or "")
    value = re.sub(r"<[^>]+>", " ", value)
    value = re.sub(r"\s+", " ", value).strip()
    return value[:limit]


def meta_value(meta: dict, key: str) -> str:
    item = meta.get(key) or {}
    return clean_html(str(item.get("value") or ""))


def api_json(params: dict) -> dict:
    query = urllib.parse.urlencode(params)
    req = urllib.request.Request(
        f"{API}?{query}",
        headers={"User-Agent": UA, "Accept": "application/json"},
    )
    with urllib.request.urlopen(req, timeout=25) as response:
        return json.load(response)


def category_candidates(category: str) -> list[dict]:
    data = api_json({
        "action": "query",
        "format": "json",
        "formatversion": "2",
        "generator": "categorymembers",
        "gcmtitle": f"Category:{category}",
        "gcmtype": "file",
        "gcmnamespace": "6",
        "gcmlimit": "100",
        "prop": "imageinfo",
        "iiprop": "url|size|mime|extmetadata",
        "iiurlwidth": "1280",
    })

    output = []
    for page in data.get("query", {}).get("pages", []):
        title = page.get("title", "")
        lowered = title.lower()

        if any(word in lowered for word in BLOCKED_WORDS):
            continue

        infos = page.get("imageinfo") or []
        if not infos:
            continue
        info = infos[0]

        mime = (info.get("mime") or "").lower()
        if mime not in {"image/jpeg", "image/png", "image/webp"}:
            continue

        width = int(info.get("width") or 0)
        height = int(info.get("height") or 0)
        if width < 1200 or height < 700 or height <= 0:
            continue

        ratio = width / height
        if ratio < 1.30 or ratio > 2.45:
            continue

        meta = info.get("extmetadata") or {}
        license_name = meta_value(meta, "LicenseShortName")
        if not license_name:
            continue
        upper_license = license_name.upper()
        if not any(marker in upper_license for marker in ALLOWED_LICENSE_MARKERS):
            continue

        thumb = info.get("thumburl") or info.get("url")
        if not thumb:
            continue

        description = meta_value(meta, "ImageDescription")
        combined = f"{lowered} {description.lower()}"
        if any(word in combined for word in BLOCKED_WORDS):
            continue

        author = meta_value(meta, "Artist") or "Wikimedia Commons contributor"
        license_url = meta_value(meta, "LicenseUrl")
        source_page = info.get("descriptionurl") or (
            "https://commons.wikimedia.org/wiki/" + urllib.parse.quote(title.replace(" ", "_"))
        )

        output.append({
            "src": thumb,
            "title": clean_html(title.removeprefix("File:"), 140),
            "author": author,
            "license": license_name,
            "license_url": license_url,
            "source_page": source_page,
            "provider": "Wikimedia Commons",
            "category": category,
            "width": width,
            "height": height,
        })

    return output


def previous_source() -> str:
    try:
        data = json.loads(OUT.read_text(encoding="utf-8"))
        return str((data.get("image") or {}).get("source_page") or "")
    except Exception:
        return ""


def choose_for_day(today: dt.date) -> tuple[dict, str]:
    categories = list(DAY_CATEGORIES.get(today.weekday(), [])) + FALLBACK_CATEGORIES
    previous = previous_source()

    seen = set()
    for category in categories:
        if category in seen:
            continue
        seen.add(category)

        try:
            items = category_candidates(category)
        except Exception as exc:
            print(f"WARN {category}: {exc}")
            continue

        if not items:
            continue

        fresh = [item for item in items if item.get("source_page") != previous]
        pool = fresh or items

        seed = f"{today.isoformat()}|{category}|GRIA".encode()
        idx = int(hashlib.sha256(seed).hexdigest(), 16) % len(pool)
        return pool[idx], category

    raise RuntimeError("Tidak menemukan foto Wikimedia Commons yang lolos filter.")


def main() -> None:
    today = dt.datetime.now(PALU).date()
    image, category = choose_for_day(today)

    payload = {
        "version": 1,
        "date": today.isoformat(),
        "timezone": "Asia/Makassar",
        "provider": "Wikimedia Commons",
        "category": category,
        "image": image,
    }

    OUT.write_text(
        json.dumps(payload, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(f"Daily Hero {today}: {image['title']} [{category}]")
    print(f"License: {image['license']} | {image['source_page']}")


if __name__ == "__main__":
    main()
