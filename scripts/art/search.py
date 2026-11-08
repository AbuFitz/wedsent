#!/usr/bin/env python3
"""Search Wikimedia Commons for public-domain / CC0 artwork and build a contact sheet to choose from by eye.
usage: search.py "<query>" <outprefix> [limit]"""
import sys, json, urllib.request, urllib.parse, io, re, html
from PIL import Image, ImageDraw
UA = "WedsentResearch/1.0 (https://github.com/AbuFitz/wedsent; design asset research)"
import time
def fetch(url, tries=6):
    for k in range(tries):
        try:
            return urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": UA}), timeout=60).read()
        except urllib.error.HTTPError as e:
            if e.code in (429, 503): time.sleep(4 * (k + 1)); continue
            raise
    raise RuntimeError("rate limited: " + url)
def api(**p):
    p.update(format="json"); url = "https://commons.wikimedia.org/w/api.php?" + urllib.parse.urlencode(p)
    return json.loads(fetch(url))
q, out = sys.argv[1], sys.argv[2]; limit = int(sys.argv[3]) if len(sys.argv) > 3 else 24
r = api(action="query", generator="search", gsrsearch=q, gsrnamespace=6, gsrlimit=limit * 2, prop="imageinfo", iiprop="url|size|extmetadata|mime", iiurlwidth=360)
items = []
for p in (r.get("query", {}).get("pages", {}) or {}).values():
    ii = (p.get("imageinfo") or [None])[0]
    if not ii or not ii.get("mime", "").startswith("image/") or "svg" in ii["mime"]: continue
    m = ii.get("extmetadata", {}); lic = (m.get("LicenseShortName", {}).get("value", "") or "")
    ok = re.search(r"public domain|cc0|pd-|no restrictions", lic, re.I)
    if not ok or ii["width"] < 1200: continue
    items.append(dict(title=p["title"], lic=lic, w=ii["width"], h=ii["height"], thumb=ii["thumburl"], url=ii["url"], page=ii["descriptionurl"],
                      artist=html.unescape(re.sub("<[^>]+>", "", m.get("Artist", {}).get("value", ""))).strip()[:80]))
items = items[:limit]
json.dump(items, open(out + ".json", "w"), indent=1, ensure_ascii=False)
cols = 6; cw, ch = 230, 280; rows = (len(items) + cols - 1) // cols
sheet = Image.new("RGB", (cols * cw, max(rows, 1) * ch), "#f4f4f2"); d = ImageDraw.Draw(sheet)
for i, it in enumerate(items):
    try:
        im = Image.open(io.BytesIO(fetch(it["thumb"]))).convert("RGB"); time.sleep(0.6)
        im.thumbnail((cw - 10, ch - 40)); sheet.paste(im, ((i % cols) * cw + 5, (i // cols) * ch + 5))
    except Exception as e: print("thumb fail", i, e)
    d.text(((i % cols) * cw + 5, (i // cols) * ch + ch - 30), f"{i}: {it['title'][5:45]}", fill="#111")
sheet.save(out + ".png"); print(len(items), "items ->", out + ".png")
