"""
Sinkronisasi ringkas Home GRIA dari sumber yang sama dengan Warta.

- Tanggal ibadah + Pelayan Firman: dari sheet JadwalPelayanan.
- Lokasi/Alamat: opsional dari sheet InfoIbadah bila kolom tersebut tersedia.
- Zona waktu pemilihan minggu: Asia/Palu (UTC+8).

Script ini dijalankan SETELAH update_warta.py agar nilai Pelayan Firman
di Home selalu mengikuti jadwal yang tampil di Warta.
"""
import datetime
import html
import json
import os
import re
import sys

import gspread
from google.oauth2.service_account import Credentials

SPREADSHEET_ID = os.environ.get(
    "SPREADSHEET_ID",
    "1QJZf9hmfc5IQe5VE6OpHlLTmegBRhqyQq0wupx8z8fY",
)
INDEX_HTML_PATH = os.environ.get("INDEX_HTML_PATH", "index.html")
SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly"]

BULAN_ID = {
    "januari": 1, "februari": 2, "maret": 3, "april": 4, "mei": 5, "juni": 6,
    "juli": 7, "agustus": 8, "september": 9, "oktober": 10, "november": 11, "desember": 12,
}


def client():
    key_json = os.environ.get("GOOGLE_SERVICE_ACCOUNT_KEY")
    if not key_json:
        print("ERROR: GOOGLE_SERVICE_ACCOUNT_KEY tidak ditemukan.")
        sys.exit(1)
    creds = Credentials.from_service_account_info(json.loads(key_json), scopes=SCOPES)
    return gspread.authorize(creds)


def palu_today():
    tz = datetime.timezone(datetime.timedelta(hours=8))
    return datetime.datetime.now(tz).date()


def parse_tanggal_id(text):
    m = re.search(
        r"(\d{1,2})\s+(januari|februari|maret|april|mei|juni|juli|agustus|september|oktober|november|desember)\s+(\d{4})",
        (text or "").lower(),
    )
    if not m:
        return None
    day, month_name, year = m.groups()
    try:
        return datetime.date(int(year), BULAN_ID[month_name], int(day))
    except ValueError:
        return None


def read_upcoming_service(ws):
    rows = ws.get_all_values()
    header_idx = next(i for i, row in enumerate(rows) if row and row[0].strip() == "Bidang")
    data_rows = [row for row in rows[header_idx + 1:] if row and row[0].strip()]
    if not data_rows:
        return {}

    n_weeks = (len(data_rows[0]) - 1) // 2
    tanggal_cols = [data_rows[0][1 + 2 * i].strip() for i in range(n_weeks)]
    parsed = [(i, parse_tanggal_id(t)) for i, t in enumerate(tanggal_cols)]
    parsed = [(i, d) for i, d in parsed if d]

    today = palu_today()
    upcoming = [(i, d) for i, d in parsed if d >= today]
    if upcoming:
        best_idx = min(upcoming, key=lambda item: item[1])[0]
    elif parsed:
        best_idx = max(parsed, key=lambda item: item[1])[0]
    else:
        best_idx = 0

    speaker = ""
    for row in data_rows:
        if row[0].strip().lower() == "pelayan firman":
            name_col = 2 + 2 * best_idx
            speaker = row[name_col].strip() if name_col < len(row) else ""
            break

    return {
        "tanggal": tanggal_cols[best_idx] if best_idx < len(tanggal_cols) else "",
        "pembicara": speaker,
    }


def read_optional_location(sh):
    try:
        ws = sh.worksheet("InfoIbadah")
    except gspread.exceptions.WorksheetNotFound:
        return {}

    rows = ws.get_all_values()
    if len(rows) < 2:
        return {}

    header = [c.strip().lower() for c in rows[0]]
    values = rows[1]

    def get(*names):
        for name in names:
            try:
                idx = header.index(name.lower())
                return values[idx].strip() if idx < len(values) else ""
            except ValueError:
                continue
        return ""

    return {
        "lokasi": get("Lokasi", "Tempat"),
        "alamat": get("Alamat", "Alamat Ibadah"),
    }


def replace_marker(content, marker, value):
    if not value:
        return content
    pattern = re.compile(
        r"(<!--\s*" + re.escape(marker) + r"\s*-->).*?(<!--\s*/" + re.escape(marker) + r"\s*-->)",
        re.DOTALL,
    )
    safe = html.escape(str(value))
    return pattern.sub(lambda m: m.group(1) + safe + m.group(2), content)


def main():
    sh = client().open_by_key(SPREADSHEET_ID)
    service = read_upcoming_service(sh.worksheet("JadwalPelayanan"))
    location = read_optional_location(sh)

    with open(INDEX_HTML_PATH, "r", encoding="utf-8") as f:
        content = f.read()

    updated = content
    updated = replace_marker(updated, "IBADAH_TANGGAL", service.get("tanggal"))
    updated = replace_marker(updated, "IBADAH_PEMBICARA", service.get("pembicara"))
    updated = replace_marker(updated, "IBADAH_LOKASI", location.get("lokasi"))
    updated = replace_marker(updated, "IBADAH_ALAMAT", location.get("alamat"))

    if updated == content:
        print("Home sudah sinkron; tidak ada perubahan.")
        return

    with open(INDEX_HTML_PATH, "w", encoding="utf-8") as f:
        f.write(updated)

    print(
        "Home disinkronkan:",
        service.get("tanggal") or "-",
        "| Pelayan Firman:",
        service.get("pembicara") or "-",
    )


if __name__ == "__main__":
    main()
