#!/usr/bin/env python3
import json
import os
import sys
import tempfile
import subprocess
from pathlib import Path

# FUCK IT, NOWS VERSION IS VIBECODED

CHANNEL_HANDLE = "@MalikHw47"
ROOT = Path(__file__).resolve().parents[2]

def get_latest_video(url: str, is_vod: bool = False) -> dict | None:
    cookies_content = os.environ.get("YOUTUBE_COOKIES")
    
    cookie_file = None
    if cookies_content:
        with tempfile.NamedTemporaryFile(mode='w', suffix='.txt', delete=False) as f:
            f.write(cookies_content)
            cookie_file = f.name
    
    # For VODs, fetch more since the first few might be normal uploads
    count = 20 if is_vod else 10
    
    cmd = [
        "yt-dlp",
        "--flat-playlist",
        "--playlist-items", f"1-{count}",
        "--skip-download",
        "--no-warnings",
        "--print", "%(id)s %(title)s",
        url
    ]
    
    if cookie_file:
        cmd.extend(["--cookies", cookie_file])
    
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
        
        if cookie_file:
            try:
                os.unlink(cookie_file)
            except:
                pass
        
        if result.returncode != 0:
            print(f"yt-dlp error: {result.stderr}", file=sys.stderr)
            return None
        
        # Parse output - get the FIRST video that matches criteria
        for line in result.stdout.strip().split('\n'):
            if not line.strip():
                continue
            
            parts = line.strip().split(' ', 1)
            if len(parts) < 2:
                continue
            
            video_id = parts[0]
            title = parts[1] if len(parts) == 2 else "Unknown"
            
            return {
                "id": video_id,
                "title": title,
                "src": f"https://www.youtube.com/embed/{video_id}"
            }
            
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        return None
    
    return None


def write_json(path: Path, payload: dict):
    path.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def main():
    # VODs from /streams tab (this is where YouTube puts past streams)
    vod_url = f"https://www.youtube.com/{CHANNEL_HANDLE}/streams"
    upload_url = f"https://www.youtube.com/{CHANNEL_HANDLE}/videos"
    
    print("🔍 Fetching latest VOD from /streams...", file=sys.stderr)
    vod = get_latest_video(vod_url, is_vod=True)
    if vod:
        write_json(ROOT / "vod.json", vod)
        print(f"✅ vod.json -> {vod['title']} ({vod['id']})")
    else:
        print("❌ No VOD found in /streams, trying /videos...", file=sys.stderr)
        # Fallback: try /videos but skip first few (which are usually normal uploads)
        fallback_url = f"https://www.youtube.com/{CHANNEL_HANDLE}/videos"
        vod = get_latest_video(fallback_url, is_vod=True)
        if vod:
            write_json(ROOT / "vod.json", vod)
            print(f"✅ vod.json (fallback) -> {vod['title']} ({vod['id']})")
    
    print("🔍 Fetching latest upload...", file=sys.stderr)
    upload = get_latest_video(upload_url, is_vod=False)
    if upload:
        write_json(ROOT / "youtube.json", upload)
        print(f"✅ youtube.json -> {upload['title']} ({upload['id']})")


if __name__ == "__main__":
    main()