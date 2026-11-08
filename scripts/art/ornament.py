#!/usr/bin/env python3
"""Turn a black-on-paper ornament plate into a white-ink alpha mask (tint it with any colour via CSS mask-image).
usage: ornament.py <candidates.json> <index> <name> [width=1280] [crop=x0,y0,x1,y1 as fractions]"""
import sys, json, re, os, hashlib, time, urllib.request
import numpy as np
from PIL import Image, ImageFilter
UA = "WedsentResearch/1.0 (https://github.com/AbuFitz/wedsent; design asset research)"
def fetch(url, tries=8):
    for k in range(tries):
        try: return urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": UA}), timeout=90).read()
        except urllib.error.HTTPError as e:
            if e.code in (429, 503): time.sleep(6 * (k + 1)); continue
            raise
cands, idx, name = json.load(open(sys.argv[1])), int(sys.argv[2]), sys.argv[3]
W = int(sys.argv[4]) if len(sys.argv) > 4 else 1280
crop = [float(x) for x in sys.argv[5].split(",")] if len(sys.argv) > 5 else None
it = cands[idx]; url = re.sub(r"/\d+px-", f"/{W}px-", it["thumb"])
cache = "/tmp/art-cache"; os.makedirs(cache, exist_ok=True); cp = f"{cache}/{hashlib.md5(url.encode()).hexdigest()}.bin"
if not os.path.exists(cp): open(cp, "wb").write(fetch(url))
im = Image.open(cp).convert("L"); w, h = im.size
if crop: im = im.crop((int(crop[0] * w), int(crop[1] * h), int(crop[2] * w), int(crop[3] * h)))
a = np.asarray(im).astype(np.float32)
paper = np.percentile(a, 92)
ink = np.clip((paper - a) / (paper * 0.62), 0, 1) ** 0.9
alpha = Image.fromarray((ink * 255).astype(np.uint8))
white = Image.new("L", alpha.size, 255)
out = Image.merge("LA", (white, alpha)).convert("RGBA")
out.save(f"/home/user/wedsent/public/art/{name}.png", optimize=True)
print(name, out.size, it["title"][:60], "|", it["lic"], "|", it["page"])
