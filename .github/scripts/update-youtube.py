#!/usr/bin/env python3
import json
import os
import sys
import tempfile
from pathlib import Path
from yt_dlp import YoutubeDL

CHANNEL_HANDLE = "@MalikHw47"
ROOT = Path(__file__).resolve().parents[2]

def get_latest_video(channel_url: str, is_vod: bool = False) -> dict | None:
    cookies_content = os.environ.get("YOUTUBE_COOKIES")
    
    ydl_opts = {
        "quiet": True,
        "no_warnings": True,
        "extract_flat": False,
        "playlist_items": "1-15",
        "ignoreerrors": True,
        "cookiefile": None,
    }
    
    if cookies_content:
        with tempfile.NamedTemporaryFile(mode='w', suffix='.txt', delete=False) as f:
            f.write(cookies_content)
            ydl_opts["cookiefile"] = f.name
    
    with YoutubeDL(ydl_opts) as ydl:
        try:
            info = ydl.extract_info(channel_url, download=False)
            if not info or "entries" not in info:
                return None
            
            for entry in info["entries"]:
                if not entry:
                    continue
                
                video_id = entry.get("id")
                title = entry.get("title")
                
                if entry.get("duration") and entry["duration"] < 60:
                    continue
                
                is_live = entry.get("was_live", False)
                
                if is_vod and not is_live:
                    continue
                if not is_vod and is_live:
                    continue
                
                return {
                    "id": video_id,
                    "title": title,
                    "src": f"https://www.youtube.com/embed/{video_id}"
                }
                
        except Exception as e:
            print(f"Error: {e}", file=sys.stderr)
            return None
        finally:
            if ydl_opts.get("cookiefile"):
                try:
                    os.unlink(ydl_opts["cookiefile"])
                except:
                    pass
    
    return None

def write_json(path: Path, payload: dict):
    path.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

def main():
    channel_url = f"https://www.youtube.com/{CHANNEL_HANDLE}/videos"
    
    vod = get_latest_video(channel_url, is_vod=True)
    if vod:
        write_json(ROOT / "vod.json", vod)
        print(f"vod.json -> {vod['title']} ({vod['id']})")
    else:
        print("No VOD found", file=sys.stderr)
        sys.exit(1)
    
    upload = get_latest_video(channel_url, is_vod=False)
    if upload:
        write_json(ROOT / "youtube.json", upload)
        print(f"youtube.json -> {upload['title']} ({upload['id']})")
    else:
        print("❌ No upload found", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()