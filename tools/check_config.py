#!/usr/bin/env python3
"""
Walidator konfiguracji PsyHub.

Sprawdza spójność site-config.js z plikami repozytorium. Skrypt jest celowo
lekki: używa Pythona do walidacji i Node.js tylko do bezpiecznego wykonania
pliku konfiguracyjnego w izolowanym kontekście VM oraz eksportu SITE_CONFIG
jako JSON.

Przykłady:
  python tools/check_config.py
  python tools/check_config.py --strict-nav-plan
  python tools/check_config.py --json
"""
from __future__ import annotations

import argparse
import json
import subprocess
import sys
from collections import Counter, defaultdict
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
SITE_CONFIG_PATH = ROOT / "site-config.js"

VALID_PLAN_STATUSES = {"live", "planned", "xlink", "wiki"}


def load_site_config() -> dict[str, Any]:
    if not SITE_CONFIG_PATH.exists():
        raise FileNotFoundError(f"Nie znaleziono {SITE_CONFIG_PATH.relative_to(ROOT)}")

    node_code = r"""
const fs = require('fs');
const vm = require('vm');
const path = process.argv[1];
const code = fs.readFileSync(path, 'utf8');
const sandbox = { window: {}, console: { warn(){}, error(){}, info(){}, log(){} } };
vm.createContext(sandbox);
vm.runInContext(code, sandbox, { filename: path });
if (!sandbox.window || !sandbox.window.SITE_CONFIG) {
  throw new Error('window.SITE_CONFIG is not defined');
}
process.stdout.write(JSON.stringify(sandbox.window.SITE_CONFIG));
"""
    completed = subprocess.run(
        ["node", "-e", node_code, str(SITE_CONFIG_PATH)],
        cwd=ROOT,
        text=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        check=False,
    )
    if completed.returncode != 0:
        raise RuntimeError(completed.stderr.strip() or "Nie udało się odczytać SITE_CONFIG przez Node.js")
    return json.loads(completed.stdout)


def rel(path: Path) -> str:
    try:
        return str(path.relative_to(ROOT)).replace("\\", "/")
    except ValueError:
        return str(path).replace("\\", "/")


def article_body_without_frontmatter(text: str) -> str:
    if text.startswith("---\n"):
        closing = text.find("\n---\n", 4)
        if closing >= 0:
            text = text[closing + 5 :]
    return text.strip()


def validate(config: dict[str, Any], strict_nav_plan: bool = False) -> dict[str, list[dict[str, str]]]:
    issues: dict[str, list[dict[str, str]]] = {"errors": [], "warnings": []}

    def error(path: str, message: str) -> None:
        issues["errors"].append({"path": path, "message": message})

    def warning(path: str, message: str) -> None:
        issues["warnings"].append({"path": path, "message": message})

    nav = config.get("nav")
    if not isinstance(nav, list):
        error("SITE_CONFIG.nav", "Brak tablicy nav")
        return issues

    plans = config.get("plans") if isinstance(config.get("plans"), dict) else {}
    default_page = config.get("defaultPage")
    nav_ids: list[str] = []
    nav_items_by_domain: dict[str, list[str]] = defaultdict(list)

    for sec_index, section in enumerate(nav):
        if not isinstance(section, dict):
            error(f"nav[{sec_index}]", "Sekcja nav nie jest obiektem")
            continue
        section_name = str(section.get("section") or f"#{sec_index}")
        domain_key = section.get("domainKey")
        if not domain_key:
            warning(f"nav[{sec_index}]", f"Sekcja '{section_name}' nie ma domainKey")
        items = section.get("items")
        if not isinstance(items, list):
            error(f"nav[{sec_index}].items", f"Sekcja '{section_name}' nie ma tablicy items")
            continue
        for item_index, item in enumerate(items):
            path = f"nav[{sec_index}].items[{item_index}]"
            if not isinstance(item, dict):
                error(path, "Pozycja nav nie jest obiektem")
                continue
            item_id = item.get("id")
            href = item.get("href")
            if href:
                continue
            if not item_id:
                error(path, "Pozycja nav bez id ani href")
                continue
            item_id = str(item_id)
            nav_ids.append(item_id)
            if domain_key:
                nav_items_by_domain[str(domain_key)].append(item_id)

            file_path = item.get("file")
            if file_path:
                article = ROOT / str(file_path)
                if not article.exists():
                    error(path, f"Plik artykułu nie istnieje: {file_path}")
                elif article.suffix.lower() != ".md":
                    warning(path, f"Plik artykułu nie ma rozszerzenia .md: {file_path}")

    duplicates = [item_id for item_id, count in Counter(nav_ids).items() if count > 1]
    for item_id in duplicates:
        error("SITE_CONFIG.nav", f"Zduplikowane id strony: {item_id}")

    if default_page and default_page != "__home__" and default_page not in set(nav_ids):
        error("SITE_CONFIG.defaultPage", f"defaultPage nie istnieje w nav: {default_page}")

    for domain_key, plan_items in plans.items():
        if not isinstance(plan_items, list):
            error(f"plans.{domain_key}", "Plan domeny nie jest tablicą")
            continue
        plan_ids: set[str] = set()
        for index, entry in enumerate(plan_items):
            path = f"plans.{domain_key}[{index}]"
            if not isinstance(entry, dict):
                error(path, "Pozycja planu nie jest obiektem")
                continue
            entry_id = entry.get("id")
            if entry_id:
                plan_ids.add(str(entry_id))
            status = str(entry.get("status") or "").strip()
            if status and status not in VALID_PLAN_STATUSES:
                error(path, f"Nieznany status planu: {status}")
            file_path = entry.get("file")
            if status == "live" and not file_path:
                error(path, "Status live bez pola file")
            if not file_path:
                continue
            article = ROOT / str(file_path)
            if not article.exists():
                if status == "live":
                    error(path, f"Status live wskazuje brakujący plik: {file_path}")
                else:
                    warning(path, f"Plan wskazuje brakujący plik: {file_path}")
                continue
            if status == "live":
                body = article_body_without_frontmatter(article.read_text(encoding="utf-8"))
                if not body:
                    error(path, f"Status live wskazuje pusty artykuł: {file_path}")

        if strict_nav_plan and domain_key in nav_items_by_domain:
            missing = sorted(set(nav_items_by_domain[domain_key]) - plan_ids)
            for item_id in missing:
                warning(f"plans.{domain_key}", f"Brak pozycji planu dla nav id: {item_id}")

    for domain_key in nav_items_by_domain:
        if domain_key not in plans:
            warning(f"plans.{domain_key}", "Brak planu dla domeny użytej w nav")

    return issues


def main() -> int:
    parser = argparse.ArgumentParser(description="Waliduje spójność site-config.js z plikami PsyHub")
    parser.add_argument("--strict-nav-plan", action="store_true", help="raportuj nav bez odpowiadającej pozycji w plans jako warning")
    parser.add_argument("--json", action="store_true", help="wypisz wynik jako JSON")
    args = parser.parse_args()

    try:
        config = load_site_config()
        issues = validate(config, strict_nav_plan=args.strict_nav_plan)
    except Exception as exc:  # noqa: BLE001 - CLI powinien pokazać czytelny błąd
        issues = {"errors": [{"path": "check_config", "message": str(exc)}], "warnings": []}

    if args.json:
        print(json.dumps(issues, ensure_ascii=False, indent=2))
    else:
        print(f"PsyHub config check: errors={len(issues['errors'])}, warnings={len(issues['warnings'])}")
        for level in ("errors", "warnings"):
            for issue in issues[level]:
                print(f"[{level[:-1]}] {issue['path']}: {issue['message']}")

    return 1 if issues["errors"] else 0


if __name__ == "__main__":
    sys.exit(main())
