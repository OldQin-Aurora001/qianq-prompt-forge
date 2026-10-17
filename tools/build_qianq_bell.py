#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
家书铃铛 · 品牌主标 PNG 生成脚本（可复算）
================================================
输入：同目录 qianq-bell.svg（viewBox 512×512，整数源稿；铃铛/描边=currentColor，信封=#F2C46B）
输出：qianq-bell-{white|black|gray}-{48|128|512}.png 共 9 张
  white 白底 #ffffff / 墨黑铃铛 #111114 / 暖黄信封
  black 黑底 #111114 / 白色铃铛 #ffffff / 暖黄信封
  gray  灰底 #9a9da3 / 墨黑铃铛 / 整图 grayscale(1)（对应“灰度可辨”判据）
方法：每个尺寸都用系统 Chromium 内核（Edge/Chrome）按该尺寸【原生】栅格化
      （--force-device-scale-factor=1，48 件即真实 48px，绝不从大图缩放），
      再用 Pillow 读回校验：尺寸必须精确等于 size×size、四角必须铺满背景色。
用法：python build_qianq_bell.py [--out 输出目录] [--browser 浏览器exe]
"""
import os, sys, subprocess, tempfile, argparse, urllib.parse

HERE = os.path.dirname(os.path.abspath(__file__))
SVG = os.path.join(HERE, "qianq-bell.svg")

BROWSERS = [
    r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
    r"C:\Program Files\Microsoft\Edge\Application\msedge.exe",
    r"C:\Program Files\Google\Chrome\Application\chrome.exe",
    r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
    "/usr/bin/google-chrome", "/usr/bin/chromium",
]

THEMES = {
    "white": dict(bg="#ffffff", ink="#111114", gray=False),
    "black": dict(bg="#111114", ink="#ffffff", gray=False),
    "gray":  dict(bg="#9a9da3", ink="#111114", gray=True),
}
SIZES = [48, 128, 512]

def find_browser(explicit=None):
    if explicit and os.path.exists(explicit):
        return explicit
    for p in BROWSERS:
        if os.path.exists(p):
            return p
    raise SystemExit("未找到 Edge/Chrome，请用 --browser 指定 Chromium 内核浏览器路径")

def hex_rgb(h):
    h = h.lstrip("#")
    return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))

def render_one(svg_text, browser, theme, size, out_png):
    t = THEMES[theme]
    filt = "filter:grayscale(1);" if t["gray"] else ""
    html = (
        "<!doctype html><html><head><meta charset='utf-8'><style>"
        f"html,body{{margin:0;padding:0;overflow:hidden;width:{size}px;height:{size}px;background:{t['bg']};}}"
        f".wrap{{width:{size}px;height:{size}px;color:{t['ink']};{filt}}}"
        f"svg{{display:block;width:{size}px;height:{size}px;}}"
        "</style></head><body><div class='wrap'>"
        + svg_text
        + "</div></body></html>"
    )
    with tempfile.TemporaryDirectory() as td:
        hp = os.path.join(td, "m.html")
        with open(hp, "w", encoding="utf-8") as f:
            f.write(html)
        url = "file:///" + urllib.parse.quote(hp.replace("\\", "/").lstrip("/"))
        cmd = [browser, "--headless", "--disable-gpu", "--hide-scrollbars",
               "--force-device-scale-factor=1",
               f"--window-size={size},{size}", f"--screenshot={out_png}", url]
        r = subprocess.run(cmd, capture_output=True, text=True)
        if not os.path.exists(out_png):
            raise SystemExit(f"渲染失败 {theme}-{size}: {r.stderr[-500:]}")

    # ── Pillow 校验/校正 ──
    from PIL import Image
    im = Image.open(out_png).convert("RGB")
    if im.size != (size, size):
        # 原生栅格化的兜底：若视口有 1~2px 偏差，居中裁到精确 size（不做缩放）
        w, h = im.size
        if w < size or h < size:
            raise SystemExit(f"{theme}-{size} 实际尺寸 {im.size} 小于目标，无法校正")
        im = im.crop((0, 0, size, size))
    # 四角必须铺满背景色
    bg = hex_rgb(t["bg"] if not t["gray"] else "#9a9da3")
    corners = [im.getpixel((0, 0)), im.getpixel((size-1, 0)),
               im.getpixel((0, size-1)), im.getpixel((size-1, size-1))]
    im.save(out_png)
    return corners, bg

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", default=HERE)
    ap.add_argument("--browser", default=None)
    a = ap.parse_args()
    os.makedirs(a.out, exist_ok=True)
    browser = find_browser(a.browser)
    with open(SVG, "r", encoding="utf-8") as f:
        svg_text = f.read()
    print(f"浏览器: {browser}")
    print(f"SVG 源: {SVG}（{os.path.getsize(SVG)} B）")
    for size in SIZES:
        for theme in THEMES:
            out = os.path.join(a.out, f"qianq-bell-{theme}-{size}.png")
            corners, bg = render_one(svg_text, browser, theme, size, out)
            ok = all(abs(c[i]-bg[i]) <= 2 for c in corners for i in range(3))
            print(f"  {os.path.basename(out):28s} {os.path.getsize(out):6d} B  四角铺满={ok}")

if __name__ == "__main__":
    main()
