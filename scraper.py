"""
asana_app_crawler_full.py

Improved Playwright + BeautifulSoup crawler for Asana app UI.

Features:
- Clean slug filenames (login.html, login-password.html, my-tasks.html, ...)
- Capture pre-login pages (landing, login email screen, login password screen, signup)
- Skip numeric ID pages (configurable)
- Save rendered HTML + download linked CSS & images (full local copy)
- Mapping JSON: { slug: { "url": "...", "filename": "..." } }
- Auto-install Playwright browsers if missing
"""

import os
import re
import json
import time
import shutil
import pathlib
import subprocess
from collections import deque
from urllib.parse import urljoin, urlparse, urlsplit

import requests
from bs4 import BeautifulSoup

from playwright.sync_api import sync_playwright, Error as PlaywrightError

# ---------------- CONFIG ----------------
OUTPUT_DIR = "rendered_pages"         # where pages and assets are saved
ASSETS_DIRNAME = "assets"             # within OUTPUT_DIR/<slug>/
MAPPING_FILE = "asana_pages_mapping.json"
PLAYWRIGHT_STORAGE = "auth_state.json"   # saved storage state after manual login
ALLOWED_DOMAIN = "app.asana.com"
MAX_PAGES = 400
RENDER_WAIT = 1.2
SAVE_HTML = True
HEADLESS = False
START_PRELOGIN_SEEDS = [
    "https://app.asana.com/",            # landing / login redirect
    "https://app.asana.com/-/signup",    # signup route
    "https://app.asana.com/-/login",     # login route (if present)
]
START_SEEDS_POST_LOGIN = [
    "https://app.asana.com/0/my_tasks",
    "https://app.asana.com/0/inbox",
    "https://app.asana.com/0/projects",
    "https://app.asana.com/0/teams",
    "https://app.asana.com/0/search",
    "https://app.asana.com/0/portfolios",
    "https://app.asana.com/0/calendar",
]
SKIP_NUMERIC_IDS = True   # you chose Skip IDs: Y
AUTO_INSTALL_BROWSERS = True
# ----------------------------------------

# regex to detect app SPA routes
APP_ROUTE_RE = re.compile(r"^https?://app\.asana\.com/.*", re.IGNORECASE)
# pattern to detect numeric /0/<number> routes to skip if SKIP_NUMERIC_IDS
NUMERIC_ID_RE = re.compile(r"/0/\d+")

os.makedirs(OUTPUT_DIR, exist_ok=True)


# ---------- Helpers ----------
def slugify(text: str, fallback: str = "page") -> str:
    """Make a clean slug (filename-safe) from text or URL path."""
    if not text:
        text = fallback
    text = text.strip().lower()
    # keep only alphanum and hyphen
    text = re.sub(r"[^\w\s-]", "", text)
    text = re.sub(r"[\s_]+", "-", text)
    text = re.sub(r"-{2,}", "-", text)
    text = text.strip("-")
    if not text:
        text = fallback
    return text


def unique_filename(output_dir: str, base_slug: str, ext: str = ".html") -> str:
    """Return a unique filename within output_dir, appending -1, -2 as needed."""
    candidate = f"{base_slug}{ext}"
    i = 1
    while os.path.exists(os.path.join(output_dir, candidate)):
        i += 1
        candidate = f"{base_slug}-{i}{ext}"
    return candidate


def is_internal(url: str) -> bool:
    try:
        p = urlparse(url)
        return p.netloc.endswith(ALLOWED_DOMAIN)
    except Exception:
        return False


def normalize_url(base: str, href: str) -> str | None:
    if not href:
        return None
    href = href.split("#")[0].strip()
    if not href:
        return None
    if href.startswith(("javascript:", "mailto:")):
        return None
    if href.startswith("//"):
        href = "https:" + href
    if href.startswith("/"):
        return urljoin(f"https://{ALLOWED_DOMAIN}", href)
    if href.startswith("http"):
        return href
    return urljoin(base, href)


def download_asset(url: str, dest_path: str):
    try:
        # use stream download for big files
        resp = requests.get(url, stream=True, timeout=30)
        resp.raise_for_status()
        with open(dest_path, "wb") as f:
            for chunk in resp.iter_content(chunk_size=8192):
                if chunk:
                    f.write(chunk)
        return True
    except Exception as e:
        print(f"    [asset] failed to download {url}: {e}")
        return False


def rewrite_and_download_assets(html: str, page_url: str, assets_dir: str) -> str:
    """
    Download CSS and image assets referenced by the html, save them into assets_dir and
    rewrite their references in the HTML to point to local files.
    """
    soup = BeautifulSoup(html, "lxml")

    os.makedirs(assets_dir, exist_ok=True)

    # Helper for converting a remote URL -> local path and downloading
    def save_and_replace(tag, attr):
        src = tag.get(attr)
        if not src:
            return
        full = normalize_url(page_url, src)
        if not full:
            return
        parsed = urlsplit(full)
        filename = os.path.basename(parsed.path) or "asset"
        # prepend host and maybe a hash to avoid collisions
        host_safe = re.sub(r"[^\w]", "_", parsed.netloc)
        loc_name = f"{host_safe}__{filename}"
        local_path = os.path.join(assets_dir, loc_name)
        rel_path = os.path.relpath(local_path, os.path.dirname(local_path))  # not used
        # download
        if not os.path.exists(local_path):
            ok = download_asset(full, local_path)
            if not ok:
                return
        # replace attribute value with local path relative to saved HTML (assets in ./assets/)
        tag[attr] = os.path.join(ASSETS_DIRNAME, loc_name).replace("\\", "/")

    # Link tags (CSS)
    for link in soup.find_all("link", href=True):
        rel = link.get("rel", [])
        if "stylesheet" in rel or link.get("type") in ("text/css", None):
            save_and_replace(link, "href")

    # Images
    for img in soup.find_all("img", src=True):
        save_and_replace(img, "src")

    # Inline styles referencing url(...)
    style_tags = soup.find_all("style")
    for st in style_tags:
        text = st.string or ""
        urls_in_css = re.findall(r'url\(([^)]+)\)', text)
        for u in urls_in_css:
            u_clean = u.strip(' \'"')
            full = normalize_url(page_url, u_clean)
            if not full:
                continue
            parsed = urlsplit(full)
            filename = os.path.basename(parsed.path) or "asset"
            host_safe = re.sub(r"[^\w]", "_", parsed.netloc)
            loc_name = f"{host_safe}__{filename}"
            local_path = os.path.join(assets_dir, loc_name)
            if not os.path.exists(local_path):
                download_asset(full, local_path)
            text = text.replace(u, f"../{ASSETS_DIRNAME}/{loc_name}")
        st.string = text

    return str(soup)


def extract_links_from_html(base_url: str, html: str) -> set:
    soup = BeautifulSoup(html, "lxml")
    urls = set()

    # anchor tags
    for a in soup.find_all("a", href=True):
        u = normalize_url(base_url, a["href"])
        if u and is_internal(u):
            urls.add(u)

    # SPA attributes
    for tag in soup.find_all(attrs=True):
        for attr in ("data-href", "data-route", "data-url", "href"):
            if attr in tag.attrs:
                u = normalize_url(base_url, tag.attrs.get(attr))
                if u and is_internal(u):
                    urls.add(u)

    # onclick heuristics
    onclicks = soup.find_all(attrs={"onclick": True})
    for t in onclicks:
        val = t.attrs.get("onclick", "")
        matches = re.findall(r"""['"](/[^'"]+)['"]""", val)
        for m in matches:
            u = normalize_url(base_url, m)
            if u and is_internal(u):
                urls.add(u)

    return urls


# ---------- Main crawler ----------
def ensure_playwright_browsers():
    """Try launching playwright; if missing, auto-install browsers."""
    try:
        with sync_playwright() as pw:
            # try a quick launch of headless chromium (no prolonged run)
            browser = pw.chromium.launch(headless=True)
            browser.close()
            return
    except PlaywrightError as e:
        print("[info] Playwright browsers appear missing or broken.")
        if AUTO_INSTALL_BROWSERS:
            print("[action] Installing Playwright browsers (this may take a minute)...")
            try:
                subprocess.check_call([os.sys.executable, "-m", "playwright", "install"])
                print("[action] Playwright browsers installed.")
                return
            except Exception as ie:
                print(f"[error] Auto-install failed: {ie}")
                raise
        else:
            raise


def capture_prelogin_pages(page, mapping):
    """
    Capture landing page, login screens, signup if available.
    Best-effort navigation to reveal email/password screens.
    """
    saved_slugs = set()

    for seed in START_PRELOGIN_SEEDS:
        try:
            print(f"[prelogin] visiting {seed}")
            page.goto(seed, timeout=60000)
            time.sleep(RENDER_WAIT)
            html = page.content()
            title = page.title().strip() or ""
            # create slug
            base_slug = slugify(title or urlparse(seed).path.strip("/").replace("/", "-") or "login")
            slug = base_slug
            filename = unique_filename(OUTPUT_DIR, slug)
            fullpath = os.path.join(OUTPUT_DIR, filename)
            # save raw (we'll download assets into a folder named after slug)
            assets_dir = os.path.join(OUTPUT_DIR, slug, ASSETS_DIRNAME)
            processed_html = rewrite_and_download_assets(html, seed, assets_dir)
            with open(fullpath, "w", encoding="utf-8") as f:
                f.write(processed_html)
            mapping[slug] = {"url": seed, "filename": filename}
            saved_slugs.add(slug)
            print(f"  saved prelogin -> {fullpath}")

        except Exception as e:
            print(f"  prelogin error for {seed}: {e}")

    # Try to reveal login screens by clicking likely login links/buttons
    try:
        # Try clicking any element that looks like "Log in" or "Sign in"
        login_selectors = [
            'a:has-text("Log in")', 'a:has-text("Log In")', 'a:has-text("Sign in")',
            'text="Log in"', 'text="Log In"', 'text="Sign in"', 'text="Sign In"',
            'a[href*="/-/login"]', 'a[href*="login"]'
        ]
        clicked = False
        for sel in login_selectors:
            try:
                el = page.query_selector(sel)
                if el:
                    print(f"[prelogin] clicking login selector {sel}")
                    el.click()
                    time.sleep(RENDER_WAIT)
                    clicked = True
                    break
            except Exception:
                continue

        # Save the resulting login page (email screen)
        html = page.content()
        url_now = page.url
        title = page.title().strip() or "login"
        slug = slugify("login")
        filename = unique_filename(OUTPUT_DIR, slug)
        fullpath = os.path.join(OUTPUT_DIR, filename)
        assets_dir = os.path.join(OUTPUT_DIR, slug, ASSETS_DIRNAME)
        processed_html = rewrite_and_download_assets(html, url_now, assets_dir)
        with open(fullpath, "w", encoding="utf-8") as f:
            f.write(processed_html)
        mapping[slug] = {"url": url_now, "filename": filename}
        print(f"  saved login/email screen -> {fullpath}")

        # Try to find an email input and advance to password screen
        try:
            # heuristic selectors for email input and continue button
            email_sel_candidates = ['input[type="email"]', 'input[name="email"]', 'input[placeholder*="email"]']
            email_el = None
            for s in email_sel_candidates:
                try:
                    email_el = page.query_selector(s)
                    if email_el:
                        break
                except Exception:
                    continue
            if email_el:
                try:
                    # fill with a dummy email to force password screen; many sites allow it
                    email_el.fill("example@example.com")
                    # attempt to press Enter or click next buttons
                    try:
                        page.keyboard.press("Enter")
                        time.sleep(RENDER_WAIT)
                    except Exception:
                        pass
                    next_btn_candidates = ['button:has-text("Continue")', 'button:has-text("Next")', 'button:has-text("Log in")', 'button:has-text("Sign in")']
                    for nb in next_btn_candidates:
                        try:
                            nb_el = page.query_selector(nb)
                            if nb_el:
                                nb_el.click()
                                time.sleep(RENDER_WAIT)
                                break
                        except Exception:
                            continue
                except Exception:
                    pass

            # After attempting to advance, save password screen
            html2 = page.content()
            url2 = page.url
            slug2 = slugify("login-password")
            filename2 = unique_filename(OUTPUT_DIR, slug2)
            fullpath2 = os.path.join(OUTPUT_DIR, filename2)
            assets_dir2 = os.path.join(OUTPUT_DIR, slug2, ASSETS_DIRNAME)
            processed_html2 = rewrite_and_download_assets(html2, url2, assets_dir2)
            with open(fullpath2, "w", encoding="utf-8") as f:
                f.write(processed_html2)
            mapping[slug2] = {"url": url2, "filename": filename2}
            print(f"  saved login/password screen -> {fullpath2}")
        except Exception as e:
            print(f"  could not advance to password screen: {e}")

    except Exception as e:
        print(f"[prelogin] generic error: {e}")

    return mapping


def run_crawler():
    mapping = {}
    visited = set()
    q = deque()

    # Ensure playwright browsers are available
    ensure_playwright_browsers()

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=HEADLESS)
        context = None
        if PLAYWRIGHT_STORAGE and os.path.exists(PLAYWRIGHT_STORAGE):
            context = browser.new_context(storage_state=PLAYWRIGHT_STORAGE)
        else:
            context = browser.new_context()
        page = context.new_page()

        # Capture pre-login pages (login/signup)
        pre_map = capture_prelogin_pages(page, mapping)
        # enqueue post-login seeds (the script will require login for these)
        for s in START_SEEDS_POST_LOGIN:
            q.append(s)

        # If no auth storage, open browser and allow manual login and save state
        if not (PLAYWRIGHT_STORAGE and os.path.exists(PLAYWRIGHT_STORAGE)):
            print("[login] No saved auth state found. Please login manually in the opened browser.")
            # Open a new tab for manual login
            page.goto("https://app.asana.com/")
            print("Please login manually. After login completes, press Enter in this terminal to continue...")
            input("After login press Enter to continue...")
            context.storage_state(path=PLAYWRIGHT_STORAGE)
            print(f"[login] Saved storage to {PLAYWRIGHT_STORAGE}")

        pages_crawled = 0
        try:
            while q and pages_crawled < MAX_PAGES:
                url = q.popleft()
                url = url.rstrip("/")
                if url in visited:
                    continue
                if SKIP_NUMERIC_IDS and NUMERIC_ID_RE.search(url):
                    print(f"[skip] Skipping numeric-ID URL: {url}")
                    visited.add(url)
                    continue
                print(f"[{pages_crawled+1}] Loading: {url}")
                try:
                    page.goto(url, timeout=60000)
                except Exception as e:
                    print(f"  goto failed: {e} — retrying once")
                    try:
                        page.goto(url, timeout=60000)
                    except Exception as e2:
                        print(f"  second goto failed: {e2} — skipping {url}")
                        visited.add(url)
                        continue

                time.sleep(RENDER_WAIT)
                html = page.content()
                raw_title = page.title().strip()
                # fallback to path if title is empty
                if not raw_title:
                    raw_title = urlparse(url).path.strip("/") or "untitled"
                slug_base = slugify(raw_title)
                slug = slug_base
                filename = unique_filename(OUTPUT_DIR, slug)
                fullpath = os.path.join(OUTPUT_DIR, filename)

                # Download assets and rewrite references inside assets folder per-slug
                assets_dir = os.path.join(OUTPUT_DIR, slug, ASSETS_DIRNAME)
                processed_html = rewrite_and_download_assets(html, url, assets_dir)
                # Save final HTML
                with open(fullpath, "w", encoding="utf-8") as f:
                    f.write(processed_html)
                mapping[slug] = {"url": url, "filename": filename}
                print(f"  saved -> {fullpath}")

                visited.add(url)
                pages_crawled += 1

                # extract links and enqueue
                links = extract_links_from_html(url, html)
                for u in links:
                    u_clean = u.rstrip("/")
                    if u_clean in visited:
                        continue
                    if SKIP_NUMERIC_IDS and NUMERIC_ID_RE.search(u_clean):
                        # skip deep numeric pages
                        continue
                    if APP_ROUTE_RE.match(u_clean) and u_clean not in q:
                        q.append(u_clean)

        finally:
            # Save mapping file
            with open(MAPPING_FILE, "w", encoding="utf-8") as wf:
                json.dump(mapping, wf, indent=2)
            print(f"[done] Crawled {pages_crawled} pages. Mapping saved to {MAPPING_FILE}")
            context.close()
            browser.close()

    return mapping


if __name__ == "__main__":
    mapping = run_crawler()
    print("Sample output (first 10 entries):")
    for i, (k, v) in enumerate(mapping.items()):
        if i >= 10:
            break
        print(f"  {k!r}: {v}")
