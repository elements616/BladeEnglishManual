#!/usr/bin/env python3
"""Local web server for the Toyota Blade electronic manual.

Modern browsers will not let framed pages talk to each other, or load XML,
when opened straight from disk (file://), so the manual is served from
http://127.0.0.1 instead. Nothing is reachable from other computers.
"""
import http.server
import os
import re
import socket
import sys
import threading
import webbrowser

ROOT = os.path.dirname(os.path.abspath(__file__))
TYPES = {
    '.html': 'text/html; charset=utf-8', '.htm': 'text/html; charset=utf-8',
    '.xml': 'application/xml; charset=utf-8', '.xsl': 'application/xml; charset=utf-8',
    '.dtd': 'application/xml-dtd', '.svg': 'image/svg+xml; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
    '.json': 'application/json', '.wasm': 'application/wasm', '.swf': 'application/x-shockwave-flash',
    '.pdf': 'application/pdf', '.png': 'image/png', '.gif': 'image/gif', '.jpg': 'image/jpeg',
    '.ico': 'image/x-icon', '.txt': 'text/plain; charset=utf-8',
}

# requests the manual makes on purpose for files that may not exist (see Handler.log_message)
EXPECTED_MISSING = re.compile(r'"GET \S*?/(frp\.xml|ppr_[^/ ?]*\.xml)[ ?]', re.I)


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **kw):
        super().__init__(*a, directory=ROOT, **kw)

    def guess_type(self, path):
        return TYPES.get(os.path.splitext(path)[1].lower(), super().guess_type(path))

    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache')
        super().end_headers()

    def send_head(self):
        # Show PDFs opened in a page, frame or window in the bundled PDF.js viewer, so they
        # render in every browser (the CDs relied on the Adobe Reader plug-in for this).
        dest = self.headers.get('Sec-Fetch-Dest', '')
        bare = self.path.split('?', 1)[0].split('#', 1)[0]
        if bare.lower().endswith('.pdf') and dest in ('document', 'iframe', 'frame') and 'raw=1' not in self.path:
            from urllib.parse import quote
            self.send_response(302)
            self.send_header('Location', '/_runtime/pdfjs/web/viewer.html?file=' + quote(bare, safe='') + '#zoom=page-fit')
            self.end_headers()
            return None
        # the original CDs were case-insensitive (Windows); emulate that
        path = self.translate_path(self.path)
        if not os.path.exists(path):
            fixed = case_insensitive(path)
            if fixed:
                self.path = '/' + os.path.relpath(fixed, ROOT).replace(os.sep, '/') + \
                    ('?' + self.path.split('?', 1)[1] if '?' in self.path else '')
        return super().send_head()

    def log_message(self, fmt, *args):
        msg = fmt % args
        if '404' not in msg:
            return
        # The manual probes for optional files and expects some to be missing:
        # frp.xml (am I inside a Function-Specific manual?) and ppr_*.xml (does this
        # procedure have a Preparation page?). Don't report those.
        if 'code 404' in msg or EXPECTED_MISSING.search(msg):
            return
        sys.stderr.write('not found: %s\n' % msg)


def case_insensitive(path):
    rel = os.path.relpath(path, ROOT)
    if rel.startswith('..'):
        return None
    cur = ROOT
    for part in rel.split(os.sep):
        try:
            names = os.listdir(cur)
        except OSError:
            return None
        match = next((n for n in names if n.lower() == part.lower()), None)
        if match is None:
            return None
        cur = os.path.join(cur, match)
    return cur


def free_port(start=8765):
    for p in range(start, start + 50):
        with socket.socket() as s:
            try:
                s.bind(('127.0.0.1', p))
                return p
            except OSError:
                continue
    return 0


def main():
    port = free_port()
    srv = http.server.ThreadingHTTPServer(('127.0.0.1', port), Handler)
    url = 'http://127.0.0.1:%d/index.html' % port
    print('Toyota Blade manual is running at', url)
    print('Leave this window open while you use the manual. Press Ctrl+C to stop.')
    if '--no-browser' not in sys.argv:
        threading.Timer(0.6, lambda: webbrowser.open(url)).start()
    try:
        srv.serve_forever()
    except KeyboardInterrupt:
        pass


if __name__ == '__main__':
    main()
