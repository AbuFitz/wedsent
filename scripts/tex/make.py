#!/usr/bin/env python3
"""Procedural, seamlessly tiling material textures (original work, no third-party imagery).
Grey textures are blended over a theme colour with CSS blend modes; pearl is coloured.  python3 scripts/tex/make.py"""
import numpy as np
from PIL import Image
rng = np.random.default_rng(11)
N = 768

def smooth_noise(size, scale, seed):
    r = np.random.default_rng(seed)
    w = r.standard_normal((size, size))
    f = np.fft.fft2(w)
    fy = np.fft.fftfreq(size)[:, None]; fx = np.fft.fftfreq(size)[None, :]
    k = np.sqrt(fx**2 + fy**2)
    f *= np.exp(-(k * scale) ** 2)
    out = np.real(np.fft.ifft2(f)); out -= out.mean(); out /= out.std() + 1e-9
    return out

def norm(a, lo=0.0, hi=1.0):
    a = (a - a.min()) / (a.max() - a.min() + 1e-9); return lo + a * (hi - lo)

def save(arr, name, mode="L", q=82):
    img = Image.fromarray((np.clip(arr, 0, 1) * 255).astype(np.uint8), mode if arr.ndim == 2 else "RGB")
    img.save(f"public/tex/{name}.webp", "WEBP", quality=q, method=6); print(name, img.size)

# --- fine grain (print / matte card)
g = np.random.default_rng(1).standard_normal((N, N)) * 0.5 + smooth_noise(N, 60, 2) * 0.25
save(norm(g, 0.35, 0.65), "grain")

# --- cotton paper: low mottling + wrapped fibres
paper = 0.5 + 0.06 * smooth_noise(N, 14, 3) + 0.04 * smooth_noise(N, 40, 4)
fib = np.zeros((N, N))
for _ in range(2600):
    x, y = rng.integers(0, N, 2); a = rng.uniform(0, np.pi); L = rng.integers(8, 34); v = rng.uniform(-1, 1) * 0.05
    for t in range(L):
        px = int(x + np.cos(a + t * 0.02) * t) % N; py = int(y + np.sin(a + t * 0.02) * t) % N
        fib[py, px] += v
paper += fib + (np.random.default_rng(5).standard_normal((N, N)) * 0.018)
save(norm(paper, 0.3, 0.7), "paper")

# --- vellum: smooth, cloudy translucency
v = 0.5 + 0.09 * smooth_noise(N, 9, 6) + 0.05 * smooth_noise(N, 22, 7) + np.random.default_rng(8).standard_normal((N, N)) * 0.01
save(norm(v, 0.38, 0.62), "vellum")

# --- linen weave (period divides N exactly so it tiles)
yy, xx = np.mgrid[0:N, 0:N]; P = N // 96
warp = np.sin(2 * np.pi * xx / P) * 0.5 + 0.5; weft = np.sin(2 * np.pi * yy / P) * 0.5 + 0.5
cell = ((xx // (P // 2) + yy // (P // 2)) % 2).astype(float)
weave = np.where(cell > 0, warp, weft)
slub = smooth_noise(N, 90, 9) * 0.18 + np.random.default_rng(10).standard_normal((N, N)) * 0.05
save(norm(weave * 0.55 + slub * 0.5 + smooth_noise(N, 6, 12) * 0.05, 0.3, 0.7), "linen")

# --- pearl: soft iridescent colour field
a = smooth_noise(N, 150, 13); b = smooth_noise(N, 190, 14); c = smooth_noise(N, 240, 15)
base = np.stack([0.955 + 0.03 * a, 0.935 + 0.03 * b, 0.945 + 0.035 * c], -1)
tint = np.stack([0.03 * np.maximum(b, 0), 0.015 * a, 0.04 * np.maximum(c, 0)], -1)
pearl = base + tint + (np.random.default_rng(16).standard_normal((N, N, 1)) * 0.006)
save(pearl, "pearl", "RGB", 86)

# --- emboss normal-ish highlight map for foil (diagonal sheen)
s = (np.sin((xx + yy) / 38.0) * 0.5 + 0.5) * 0.55 + smooth_noise(N, 20, 17) * 0.1
save(norm(s, 0.2, 0.9), "sheen")
