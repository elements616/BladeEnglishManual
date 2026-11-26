#!/bin/bash
cd "$(dirname "$0")"
if command -v python3 >/dev/null 2>&1; then
  exec python3 serve.py
else
  echo "Python 3 is required. Install it from https://www.python.org/downloads/ and run this again."
  read -n 1
fi
