#!/usr/bin/env python3
"""Download one Commons plate and cut the plant out of its paper background -> transparent WebP.
usage: cutout.py <candidates.json> <index> <name> [width=1600] [tolerance=34]
Background = pixels close to the paper colour that are connected to the image border, so pale petals survive."""
import sys, json, io, re, time, urllib.request
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage as ndi
UA = "WedsentResearch/1.0 (https://github.com/AbuFitz/wedsent; design asset research)"
def fetch(url, tries=8):
    for k in range(tries):
        try: return urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": UA}), timeout=90).read()
        except urllib.error.HTTPError as e:
            if e.code in (429, 503): time.sleep(6 * (k + 1)); continue
            raise
    raise RuntimeError("rate limited")
cands, idx, name = json.load(open(sys.argv[1])), int(sys.argv[2]), sys.argv[3]
W = int(sys.argv[4]) if len(sys.argv) > 4 else 1280; TOL = float(sys.argv[5]) if len(sys.argv) > 5 else 34
it = cands[idx]; url = re.sub(r"/\d+px-", f"/{W}px-", it["thumb"])
import os, hashlib
cache = "/tmp/art-cache"; os.makedirs(cache, exist_ok=True); cp = f"{cache}/{hashlib.md5(url.encode()).hexdigest()}.bin"
if not os.path.exists(cp): open(cp, "wb").write(fetch(url))
im = Image.open(cp).convert("RGB"); w, h = im.size
a = np.asarray(im).astype(np.float32)
# paper colour: median of a thin border frame
fr = np.concatenate([a[:12].reshape(-1, 3), a[-12:].reshape(-1, 3), a[:, :12].reshape(-1, 3), a[:, -12:].reshape(-1, 3)])
paper = np.median(fr, axis=0)
# local paper estimate handles vignettes: heavy blur of the image where it is near paper
dist = np.sqrt(((a - paper) ** 2).sum(-1))
near = dist < TOL
# remove caption band + margins by forcing them to background
near[int(h * 0.86):, :] = True; near[:int(h * 0.025), :] = True; near[:, :int(w * 0.04)] = True; near[:, int(w * 0.96):] = True
lab, n = ndi.label(near)
border = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
bg = np.isin(lab, list(border))
fg = ~bg
# keep only the largest foreground blobs (drop specks / stray marks)
l2, n2 = ndi.label(fg); sizes = ndi.sum(fg, l2, range(1, n2 + 1))
keep = np.zeros(n2 + 1, bool); big = sizes.max() if n2 else 0
for i, s in enumerate(sizes, 1):
    if s > big * 0.04: keep[i] = True
fg = keep[l2]
fg = ndi.binary_closing(fg, iterations=2); fg = ndi.binary_fill_holes(fg)
alpha = Image.fromarray((fg * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(3)).filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(1.1))
# slightly lift paper tint out of the colours so petals don't look grey on white cards
out = np.dstack([np.asarray(im), np.asarray(alpha)])
ys, xs = np.where(np.asarray(alpha) > 40); box = (xs.min(), ys.min(), xs.max(), ys.max())
res = Image.fromarray(out, "RGBA").crop(box)
res.save(f"/home/user/wedsent/public/art/{name}.webp", "WEBP", quality=88, method=6)
print(name, res.size, "paper", paper.astype(int), it["title"], "|", it["lic"], "|", it["page"])
