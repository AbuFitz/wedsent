#!/usr/bin/env python3
"""Search CC0 / public-domain museum collections (Art Institute of Chicago, Cleveland Museum of Art open access)
and write a contact sheet + JSON to choose from by eye.  usage: museum.py "<query>" <outprefix> [n]"""
import sys, json, io, time, urllib.request, urllib.parse
from PIL import Image, ImageDraw
UA = "WedsentResearch/1.0 (https://github.com/AbuFitz/wedsent; design asset research)"
def get(url, tries=5):
    for k in range(tries):
        try: return urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": UA}), timeout=60).read()
        except Exception as e:
            if k == tries - 1: raise
            time.sleep(3 * (k + 1))
q, out = sys.argv[1], sys.argv[2]; n = int(sys.argv[3]) if len(sys.argv) > 3 else 12
items = []
try:
    d = json.loads(get("https://openaccess-api.clevelandart.org/api/artworks/?" + urllib.parse.urlencode({"q": q, "cc0": 1, "has_image": 1, "limit": n})))
    for a in d["data"]:
        im = (a.get("images") or {}).get("web")
        if not im: continue
        items.append(dict(src="CMA", id=a["id"], title=a["title"], artist=(a["creators"][0]["description"] if a["creators"] else ""), date=a.get("creation_date"), thumb=im["url"], full=((a.get("images") or {}).get("print") or im)["url"], page=a["url"], licence="CC0 (Cleveland Museum of Art Open Access)"))
except Exception as e: print("CMA fail", e)
json.dump(items, open(out + ".json", "w"), indent=1, ensure_ascii=False)
cols = 8; cw, ch = 190, 250; rows = (len(items) + cols - 1) // cols
sheet = Image.new("RGB", (cols * cw, max(rows, 1) * ch), "#f4f4f2"); dr = ImageDraw.Draw(sheet)
from concurrent.futures import ThreadPoolExecutor
def th(it):
    try: return Image.open(io.BytesIO(get(it["thumb"], 3))).convert("RGB")
    except Exception: return None
with ThreadPoolExecutor(8) as ex: ims = list(ex.map(th, items))
for i, (it, im) in enumerate(zip(items, ims)):
    if im: im.thumbnail((cw - 8, ch - 34)); sheet.paste(im, ((i % cols) * cw + 4, (i // cols) * ch + 4))
    dr.text(((i % cols) * cw + 4, (i // cols) * ch + ch - 28), f"{i} {it['src']} {it['title'][:24]}", fill="#111")
sheet.save(out + ".png"); print(len(items), "->", out + ".png")
