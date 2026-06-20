#!/usr/bin/env python3
import json
import sys
import urllib.request
import xml.etree.ElementTree as ET
from pathlib import Path

CHANNEL_ID = "UCyigqF_mR6nM2YnBOfKRfhQ"
FEED_URL = f"https://www.youtube.com/feeds/videos.xml?channel_id={CHANNEL_ID}"
ROOT = Path(__file__).resolve().parents[2]

NS = {
    "atom": "http://www.w3.org/2005/Atom",
    "yt": "http://www.youtube.com/xml/schemas/2015",
}


def fetch(url: str) -> str:
    req = urllib.request.Request(url, headers={"User-Agent": "malikhw-github-pages/1.0"})
    with urllib.request.urlopen(req, timeout=30) as resp:
        return resp.read().decode("utf-8", errors="ignore")


def parse_entries(feed_xml: str):
    root = ET.fromstring(feed_xml)
    entries = []
    for entry in root.findall("atom:entry", NS):
        video_id = entry.find("yt:videoId", NS)
        title = entry.find("atom:title", NS)
        if video_id is None or title is None:
            continue
        link = None
        for link_el in entry.findall("atom:link", NS):
            if link_el.get("rel") == "alternate":
                link = link_el.get("href", "")
                break
        entries.append(
            {
                "id": video_id.text.strip(),
                "title": title.text.strip(),
                "link": link or "",
            }
        )
    return entries


def is_short(link: str) -> bool:
    return "/shorts/" in link


def is_live_vod(video_id: str) -> bool:
    html = fetch(f"https://www.youtube.com/watch?v={video_id}")
    return '"isLiveContent":true' in html


def write_json(path: Path, payload: dict):
    path.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def main():
    feed = fetch(FEED_URL)
    entries = parse_entries(feed)
    if not entries:
        print("No entries found in RSS feed", file=sys.stderr)
        sys.exit(1)

    uploads = []
    for entry in entries:
        if is_short(entry["link"]):
            continue
        uploads.append({**entry, "live_vod": is_live_vod(entry["id"])})

    if not uploads:
        print("No non-Short upload found", file=sys.stderr)
        sys.exit(1)

    latest = next((e for e in uploads if not e["live_vod"]), None)
    if latest:
        write_json(
            ROOT / "youtube.json",
            {
                "src": f"https://www.youtube.com/embed/{latest['id']}",
                "title": latest["title"],
            },
        )
        print(f"youtube.json -> {latest['title']} ({latest['id']})")
    else:
        print("No non-VOD upload found; youtube.json unchanged", file=sys.stderr)

    vod = next((e for e in uploads if e["live_vod"]), None)
    if vod:
        write_json(
            ROOT / "vod.json",
            {
                "src": f"https://www.youtube.com/embed/{vod['id']}",
                "title": vod["title"],
            },
        )
        print(f"vod.json -> {vod['title']} ({vod['id']})")
    else:
        print("No live VOD found in recent uploads; vod.json unchanged", file=sys.stderr)


if __name__ == "__main__":
    main()
