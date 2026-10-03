"""
Membangun manifest foto Home GRIA secara otomatis dari folder foto-home/.

File yang didukung:
- .jpg / .jpeg
- .png
- .webp

File tersembunyi seperti .gitkeep diabaikan.
"""
from pathlib import Path
import json

PHOTO_DIR = Path("foto-home")
OUT = Path("foto-home.json")
SUPPORTED = {".jpg", ".jpeg", ".png", ".webp"}

def main():
    PHOTO_DIR.mkdir(exist_ok=True)

    files = []
    for p in sorted(PHOTO_DIR.iterdir(), key=lambda x: x.name.lower()):
        if not p.is_file():
            continue
        if p.name.startswith("."):
            continue
        if p.suffix.lower() not in SUPPORTED:
            continue
        files.append({
            "src": f"foto-home/{p.name}",
            "title": p.stem.replace("-", " ").replace("_", " ").strip() or "Foto GRIA",
            "source": "Foto GRIA"
        })

    payload = {
        "version": 1,
        "images": files
    }
    OUT.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Manifest dibuat: {len(files)} foto.")

if __name__ == "__main__":
    main()
