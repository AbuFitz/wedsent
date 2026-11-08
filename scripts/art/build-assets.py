#!/usr/bin/env python3
"""Reproducible asset build: public-domain / CC0 plates from Wikimedia Commons -> optimised cutouts and ink masks,
plus public/art/provenance.json (title, licence, source page) for the Credits page.
Candidate lists come from search.py (scratchpad). Run: python3 build-assets.py <dir-with-candidate-jsons>"""
import sys, json, re, os, io, time, hashlib, urllib.request
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage as ndi
UA = "WedsentResearch/1.0 (https://github.com/AbuFitz/wedsent; design asset research)"
SRC = sys.argv[1]; OUT = "/home/user/wedsent/public/art"; os.makedirs(OUT, exist_ok=True)
CACHE = "/tmp/art-cache"; os.makedirs(CACHE, exist_ok=True)
def fetch(url, tries=8):
    for k in range(tries):
        try: return urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": UA}), timeout=90).read()
        except urllib.error.HTTPError as e:
            if e.code in (429, 503): time.sleep(6 * (k + 1)); continue
            raise
def load(it, W=1280):
    url = re.sub(r"/\d+px-", f"/{W}px-", it["thumb"]); cp = f"{CACHE}/{hashlib.md5(url.encode()).hexdigest()}.bin"
    if not os.path.exists(cp): open(cp, "wb").write(fetch(url)); time.sleep(4)
    return Image.open(cp)
def cutout(it, tol, maxside=900):
    im = load(it).convert("RGB"); w, h = im.size; a = np.asarray(im).astype(np.float32)
    fr = np.concatenate([a[:12].reshape(-1, 3), a[-12:].reshape(-1, 3), a[:, :12].reshape(-1, 3), a[:, -12:].reshape(-1, 3)])
    paper = np.median(fr, axis=0); near = np.sqrt(((a - paper) ** 2).sum(-1)) < tol
    near[int(h * .86):, :] = True; near[:int(h * .025), :] = True; near[:, :int(w * .04)] = True; near[:, int(w * .96):] = True
    lab, _ = ndi.label(near); border = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
    fg = ~np.isin(lab, list(border)); l2, n2 = ndi.label(fg); sizes = ndi.sum(fg, l2, range(1, n2 + 1))
    keep = np.zeros(n2 + 1, bool)
    for i, s in enumerate(sizes, 1): keep[i] = s > sizes.max() * 0.04
    fg = ndi.binary_fill_holes(ndi.binary_closing(keep[l2], iterations=2))
    al = Image.fromarray((fg * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(3)).filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(1.1))
    ys, xs = np.where(np.asarray(al) > 40)
    res = Image.fromarray(np.dstack([np.asarray(im), np.asarray(al)]), "RGBA").crop((xs.min(), ys.min(), xs.max(), ys.max()))
    res.thumbnail((maxside, maxside), Image.LANCZOS); return res
def inkmask(it, crop=None, maxw=900):
    im = load(it).convert("L"); w, h = im.size
    if crop: im = im.crop((int(crop[0] * w), int(crop[1] * h), int(crop[2] * w), int(crop[3] * h)))
    a = np.asarray(im).astype(np.float32); paper = np.percentile(a, 92)
    ink = np.clip((paper - a) / (paper * 0.62), 0, 1) ** 0.9
    out = Image.merge("LA", (Image.new("L", im.size, 255), Image.fromarray((ink * 255).astype(np.uint8)))).convert("RGBA")
    if out.width > maxw: out = out.resize((maxw, int(out.height * maxw / out.width)), Image.LANCZOS)
    return out
def C(n): return json.load(open(f"{SRC}/{n}.json"))
JOBS = [  # (kind, list, index, name, param)
 ("cut", "roses", 7, "rose-sprig", 40), ("cut", "roses", 11, "rose-wild", 40),
 ("cut", "roses", 14, "rose-double", 40), ("cut", "roses", 0, "rose-red", 40),
 ("cut", "peony", 1, "peony-pink", 30), ("cut", "peony", 4, "peony-crimson", 30), ("cut", "peony", 5, "peony-paxton", 40),
 ("cut", "olive", 3, "olive-b", 38),
 ("cut", "marigold", 2, "marigold-african", 40), ("cut", "marigold", 1, "marigold-french", 40), ("cut", "marigold", 0, "marigold-orange", 30),
 ("ink", "orn", 11, "orn-moresque-a", (0.012, 0.03, 0.305, 0.93)), ("ink", "orn", 11, "orn-moresque-b", (0.335, 0.03, 0.645, 0.93)), ("ink", "orn", 11, "orn-moresque-c", (0.66, 0.03, 0.985, 0.93)),

 ("ink", "orn", 5, "orn-tile-a", (0.0, 0.125, 0.47, 0.375)), ("ink", "orn", 5, "orn-tile-b", (0.5, 0.125, 1.0, 0.375)), ("ink", "orn", 5, "orn-tile-c", (0.0, 0.385, 0.47, 0.625)), ("ink", "orn", 5, "orn-tile-d", (0.5, 0.385, 1.0, 0.625)),
 ("ink", "orn", 3, "orn-roundel-a", (0.1, 0.02, 0.9, 0.27)), ("ink", "orn", 3, "orn-roundel-b", (0.05, 0.3, 0.95, 0.62)),
]
prov = {}
for kind, lst, idx, name, param in JOBS:
    it = C(lst)[idx]
    try:
        if kind == "cut": r = cutout(it, param); r.save(f"{OUT}/{name}.webp", "WEBP", quality=80, method=6); fn = f"{name}.webp"
        else: r = inkmask(it, param); r.save(f"{OUT}/{name}.webp", "WEBP", quality=72, alpha_quality=85, method=6); fn = f"{name}.webp"
        prov[name] = dict(file=fn, w=r.width, h=r.height, kind=kind, title=it["title"].replace("File:", ""), licence=it["lic"], artist=it.get("artist", ""), page=it["page"])
        print("ok", name, r.size, os.path.getsize(f"{OUT}/{fn}") // 1024, "KB")
    except Exception as e: print("FAIL", name, e)
json.dump(prov, open(f"{OUT}/provenance.json", "w"), indent=1, ensure_ascii=False)
