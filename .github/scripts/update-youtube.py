#!/usr/bin/env python3
import json
from pathlib import Path
from yt_dlp import YoutubeDL

CHANNEL_HANDLE = "@MalikHw47"
ROOT = Path(__file__).resolve().parents[2]

def get_latest(channel_url: str, was_live: bool = None):
    ydl_opts = {
        "quiet": True,
        "extract_flat": True,
        "playlist_items": "1",
    }
    
    with YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(channel_url, download=False)
        if info and "entries" in info and info["entries"]:
            entry = info["entries"][0]
            if was_live is not None and entry.get("was_live") != was_live:
                return None
            return {
                "id": entry["id"],
                "title": entry["title"],
                "src": f"https://www.youtube.com/embed/{entry['id']}"
            }
    return None

def main():
    vod = get_latest(f"https://www.youtube.com/{CHANNEL_HANDLE}/streams", True)
    if vod:
        Path(ROOT / "vod.json").write_text(json.dumps(vod, indent=2))
        print(f"VOD: {vod['title']}")
    
    upload = get_latest(f"https://www.youtube.com/{CHANNEL_HANDLE}/videos", False)
    if upload:
        Path(ROOT / "youtube.json").write_text(json.dumps(upload, indent=2))
        print(f"Upload: {upload['title']}")

if __name__ == "__main__":
    main()