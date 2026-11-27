#!/usr/bin/env python3
"""Build llms-full.txt: the main text of every page in sitemap.xml, as plain Markdown-like text.

Run from the repo root after any copy change:  python3 scripts/build_llms_full.py
Standard library only. Reads the local HTML files, not the live site.
"""
import re
import sys
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SITE = "https://beyondzenith.com.au"
SKIP_TAGS = {"script", "style", "noscript", "svg", "nav", "footer", "form", "button"}
BLOCK = {"p", "li", "h1", "h2", "h3", "h4", "dt", "dd", "blockquote", "tr", "figcaption"}


class MainText(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.title = ""
        self._in_title = False
        self._in_main = 0
        self._skip = 0
        self._buf = []
        self.lines = []
        self._prefix = ""

    def handle_starttag(self, tag, attrs):
        if tag == "title":
            self._in_title = True
        if tag == "main":
            self._in_main += 1
        if not self._in_main:
            return
        if tag in SKIP_TAGS:
            self._skip += 1
        if tag in BLOCK:
            self._flush()
            self._prefix = {"h1": "# ", "h2": "## ", "h3": "### ", "h4": "#### ", "li": "- "}.get(tag, "")
        if tag == "br":
            self._buf.append(" ")

    def handle_endtag(self, tag):
        if tag == "title":
            self._in_title = False
        if not self._in_main:
            return
        if tag in SKIP_TAGS and self._skip:
            self._skip -= 1
        if tag in BLOCK:
            self._flush()
        if tag == "main":
            self._flush()
            self._in_main -= 1

    def handle_data(self, data):
        if self._in_title:
            self.title += data
        if self._in_main and not self._skip:
            self._buf.append(data)

    def _flush(self):
        text = re.sub(r"\s+", " ", "".join(self._buf)).strip()
        if text:
            self.lines.append(self._prefix + text)
        self._buf = []
        self._prefix = ""


def page_file(url):
    path = url.replace(SITE, "").strip("/")
    for cand in (ROOT / path / "index.html", ROOT / f"{path}.html", ROOT / path):
        if cand.is_file():
            return cand
    if path == "":
        return ROOT / "index.html"
    return None


def main():
    urls = re.findall(r"<loc>([^<]+)</loc>", (ROOT / "sitemap.xml").read_text(encoding="utf-8"))
    out = [
        "# Beyond Zenith Software: full text of beyondzenith.com.au",
        "",
        "> The main text of every page on the site, for AI tools. Short version: /llms.txt",
        "",
    ]
    missing = []
    for url in urls:
        f = page_file(url)
        if not f:
            missing.append(url)
            continue
        p = MainText()
        p.feed(f.read_text(encoding="utf-8"))
        out += ["---", "", f"URL: {url}", f"Title: {p.title.strip()}", ""] + p.lines + [""]
    (ROOT / "llms-full.txt").write_text("\n".join(out).rstrip() + "\n", encoding="utf-8")
    if missing:
        print("No local file for:", *missing, sep="\n  ", file=sys.stderr)
        sys.exit(1)
    print(f"llms-full.txt: {len(urls)} pages")


if __name__ == "__main__":
    main()
