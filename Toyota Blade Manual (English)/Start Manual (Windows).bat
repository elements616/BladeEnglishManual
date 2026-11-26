@echo off
cd /d "%~dp0"
where py >nul 2>nul && (py -3 serve.py & goto :eof)
where python >nul 2>nul && (python serve.py & goto :eof)
echo Python 3 is required. Install it from https://www.python.org/downloads/ and run this again.
pause
