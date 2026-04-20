#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""Narzędzie do pracy z artykułami Markdown w projekcie PsyHub.

Obsługiwane tryby:
- convert-utf8: konwersja plików .md do UTF-8,
- new-article: tworzenie szablonu nowego artykułu,
- validate-article: walidacja wymaganych sekcji redakcyjnych.
"""

import argparse
import os
import re
import sys
from pathlib import Path

# Spróbuj zaimportować chardet (opcjonalnie) – jeśli brak, użyj prostszej metody.
try:
    import chardet

    HAS_CHARDET = True
except ImportError:
    HAS_CHARDET = False
    print(
        "Uwaga: biblioteka 'chardet' nie jest zainstalowana. "
        "Będzie używana domyślna metoda z zastępowaniem błędnych znaków.",
        file=sys.stderr,
    )


# Lista sekcji wymaganych przez standard redakcyjny projektu.
REQUIRED_SECTIONS = [
    "Wprowadzenie",
    "Definicje",
    "Analiza",
    "Dobra praktyka",
    "Zła praktyka",
    "Perspektywa nieoczywista",
    "Podsumowanie",
    "Bibliografia",
]


def detect_encoding(filepath: Path):
    """Zwraca kodowanie pliku na podstawie analizy bajtów (jeśli chardet dostępny)."""
    if HAS_CHARDET:
        with filepath.open("rb") as file_handle:
            raw = file_handle.read(10000)
            result = chardet.detect(raw)
            return result["encoding"]
    return None


def convert_to_utf8(filepath: Path):
    """Konwertuje plik do UTF-8, nadpisując go."""
    src_encoding = detect_encoding(filepath)

    try:
        if src_encoding:
            with filepath.open("r", encoding=src_encoding) as file_handle:
                content = file_handle.read()
        else:
            with filepath.open("r", encoding="utf-8", errors="replace") as file_handle:
                content = file_handle.read()
    except Exception as error:  # noqa: BLE001
        print(f"Błąd odczytu {filepath}: {error}")
        return False

    try:
        with filepath.open("w", encoding="utf-8") as file_handle:
            file_handle.write(content)
        print(
            f"Przekonwertowano: {filepath} "
            f"(kodowanie źródłowe: {src_encoding or 'utf-8 (z replace)'})"
        )
        return True
    except Exception as error:  # noqa: BLE001
        print(f"Błąd zapisu {filepath}: {error}")
        return False


def extract_headings(markdown_text: str):
    """Wyciąga nagłówki markdown i zwraca je bez prefiksów '#'."""
    headings = []
    for line in markdown_text.splitlines():
        match = re.match(r"^\s{0,3}#{1,6}\s+(.+?)\s*$", line)
        if match:
            headings.append(match.group(1).strip())
    return headings


def normalize_heading(heading: str):
    """Normalizuje nagłówek do porównań: małe litery i pojedyncze spacje."""
    lowered = heading.casefold()
    return " ".join(lowered.split())


def validate_required_sections(filepath: Path):
    """Sprawdza, czy plik zawiera wszystkie wymagane sekcje redakcyjne."""
    content = filepath.read_text(encoding="utf-8")
    headings = extract_headings(content)
    normalized_headings = {normalize_heading(item) for item in headings}

    missing = [
        section
        for section in REQUIRED_SECTIONS
        if normalize_heading(section) not in normalized_headings
    ]

    if missing:
        print(f"❌ Walidacja nie powiodła się dla: {filepath}")
        print("Brakujące sekcje:")
        for section in missing:
            print(f"  - {section}")
        return False

    print(f"✅ Walidacja sekcji zakończona sukcesem: {filepath}")
    return True


def build_article_template(title: str):
    """Buduje treść szablonu nowego artykułu z wymaganymi sekcjami."""
    lines = [f"# {title}", ""]
    for section in REQUIRED_SECTIONS:
        lines.extend([f"## {section}", "", "", ""])
    return "\n".join(lines).rstrip() + "\n"


def create_new_article(output_path: Path, title: str, force: bool):
    """Tworzy nowy plik .md na bazie szablonu artykułu."""
    if output_path.suffix.lower() != ".md":
        raise ValueError("Tryb new-article wymaga ścieżki zakończonej rozszerzeniem .md")

    if output_path.exists() and not force:
        raise FileExistsError(
            f"Plik już istnieje: {output_path}. Użyj flagi --force, aby nadpisać."
        )

    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(build_article_template(title), encoding="utf-8")
    print(f"Utworzono nowy artykuł: {output_path}")


def run_convert_utf8(start_dir: Path):
    """Przeszukuje katalog i konwertuje wszystkie pliki .md do UTF-8."""
    print(f"Przeszukiwanie katalogu: {start_dir}")
    count = 0

    for root, _, files in os.walk(start_dir):
        for filename in files:
            if filename.endswith(".md"):
                filepath = Path(root) / filename
                if convert_to_utf8(filepath):
                    count += 1

    print(f"\nZakończono. Przetworzono {count} plik(ów) .md.")


def parse_args(argv):
    """Parsuje argumenty CLI."""
    parser = argparse.ArgumentParser(description="Narzędzia redakcyjne i konwersja dla PsyHub.")
    subparsers = parser.add_subparsers(dest="command")

    convert_parser = subparsers.add_parser(
        "convert-utf8", help="Konwertuje pliki Markdown do UTF-8."
    )
    convert_parser.add_argument(
        "--path",
        default=str(Path(__file__).resolve().parent),
        help="Katalog startowy do przeszukania (domyślnie: katalog tools).",
    )

    new_article_parser = subparsers.add_parser(
        "new-article", help="Tworzy nowy szablon artykułu Markdown."
    )
    new_article_parser.add_argument("output", help="Ścieżka wyjściowa pliku .md")
    new_article_parser.add_argument(
        "--title",
        default="Nowy artykuł",
        help="Tytuł dokumentu (nagłówek H1).",
    )
    new_article_parser.add_argument(
        "--force",
        action="store_true",
        help="Nadpisuje istniejący plik.",
    )

    validate_parser = subparsers.add_parser(
        "validate-article",
        help="Sprawdza obecność wymaganych sekcji w artykule.",
    )
    validate_parser.add_argument("paths", nargs="+", help="Lista plików .md do walidacji")

    return parser.parse_args(argv)


def main(argv=None):
    """Punkt wejścia narzędzia CLI."""
    args = parse_args(argv or sys.argv[1:])

    # Zachowanie wstecznej kompatybilności: brak komendy = stary tryb konwersji.
    if args.command in (None, "convert-utf8"):
        path = Path(args.path) if args.command == "convert-utf8" else Path(__file__).resolve().parent
        run_convert_utf8(path)
        return 0

    if args.command == "new-article":
        try:
            create_new_article(Path(args.output), args.title, args.force)
            return 0
        except (ValueError, FileExistsError) as error:
            print(f"❌ {error}", file=sys.stderr)
            return 1

    if args.command == "validate-article":
        all_valid = True
        for raw_path in args.paths:
            filepath = Path(raw_path)
            if not filepath.exists():
                print(f"❌ Nie znaleziono pliku: {filepath}", file=sys.stderr)
                all_valid = False
                continue
            if filepath.suffix.lower() != ".md":
                print(f"❌ Pominięto (nie .md): {filepath}", file=sys.stderr)
                all_valid = False
                continue
            if not validate_required_sections(filepath):
                all_valid = False
        return 0 if all_valid else 1

    print("❌ Nieznana komenda.", file=sys.stderr)
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
