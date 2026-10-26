#!/usr/bin/env python3
"""
Generator kompletnego rejestru 406 Spółek Skarbu Państwa na podstawie oficjalnego wykazu dane.gov.pl (stan na 31.03.2025 r.)
Zgodny ze standardem jakości Fable 5.1 i regułami kardynalnymi AGENTS.md.
"""

import sys
import subprocess

def main():
    # Uruchomienie oficjalnego skryptu budowy bazy
    res = subprocess.run([sys.executable, "scripts/build_full_ssp_dataset.py"], check=True)
    sys.exit(res.returncode)

if __name__ == "__main__":
    main()
