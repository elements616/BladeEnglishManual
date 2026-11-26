TOYOTA BLADE ELECTRONIC TECHNICAL MANUAL - ENGLISH EDITION
==========================================================

Source: Toyota maintenance CD pair SC0553J (Blade, 2006-2012: AZE154H / AZE156H /
GRE156H), covering the 2006/12, 2007/08, 2008/10 and 2009/12 releases.

This folder is a modernised, English copy of both CDs. The original CDs needed
Windows XP, Internet Explorer 6, a Japanese system locale, Adobe SVG Viewer and
Flash Player 7. This copy runs in any current browser (Chrome, Edge, Firefox,
Safari) on macOS, Windows or Linux.


HOW TO OPEN IT
--------------
Mac app:  "Toyota Blade Manual.app" (next to this folder) is a self-contained
          Mac app with the whole manual inside it. Double-click it; nothing else
          is needed (no Python, no browser). It runs on Apple-silicon Macs with
          macOS 12 or later. Drag it to Applications if you like. The first time,
          if macOS says it cannot check the app, right-click it and choose Open.
          Menus: File > New Window / Print / Open Page in Browser,
          View > Zoom In / Zoom Out, Go > Back / Forward / Start Page.

Mac:      double-click "Start Manual (Mac).command"
Windows:  double-click "Start Manual (Windows).bat"
Other:    run  python3 serve.py  in this folder

A small local web server starts and your browser opens the manual. Keep the
terminal window open while you use it; close it (or press Ctrl+C) to stop.
Python 3 is required (preinstalled on most Macs; free from python.org).

Why a server? Modern browsers block framed pages from talking to each other,
and block XML loading, when pages are opened straight from disk. The server
only listens on 127.0.0.1, so nothing is reachable from other computers.

The start page offers:
  Disc 1 - the pre-rendered HTML manual (release-date selection, Repair Manual,
           New Car Features, Electrical Wiring Diagram, Function-Specific Repair Manual)
  Disc 2 - the full interactive viewer (removal/installation picture index,
           inspection, troubleshooting, New Car Features with animations,
           wiring diagrams, connector/fuse/ground lists, part-name search,
           bookmarks and memos)


WHAT WAS CHANGED
----------------
* All text translated from Japanese to English: about 61,000 unique sentences
  across 46,000 files (HTML pages, XML data, XSL stylesheets, scripts, SVG
  diagrams, wiring-diagram PDFs, Flash animation labels and button images).
* Converted to HTML5 and UTF-8 (the CDs used Shift_JIS).
* Internet Explorer-only technology replaced by standard web features:
  - MSXML ActiveX (XML loading, XPath, XSLT) -> browser XML APIs; XSLT runs
    natively or via a bundled WebAssembly libxslt engine (newer Chrome has no XSLT)
  - modal/modeless dialogs and pop-up menus -> in-page equivalents
  - Adobe SVG Viewer -> native SVG (compressed .svgz files unpacked to .svg)
  - Flash Player -> Ruffle (bundled; plays the original .swf files)
  - Adobe Reader plug-in -> PDF.js (bundled; wiring-diagram and other PDFs
    open inside the page in every browser)
  - the memo/bookmark ActiveX file plug-in -> your browser's local storage
* Raster copies of the repair illustrations (used for printing and on Disc 1)
  were redrawn from the translated SVG diagrams.
* Framesets and the original page layouts, colours and images are kept so the
  manual looks and behaves like the original.

The original "CD 1" and "CD 2" folders are untouched.


KNOWN LIMITATIONS
-----------------
* Translation was done by machine (Claude). It follows Toyota's English
  service-manual terminology, but always check critical values (torque,
  clearances, wiring) against the original diagrams where in doubt.
* Some Flash animations draw their labels as vector outlines rather than
  text. Those labels were read by OCR and the English is drawn in place over
  the Japanese. Labels stored as text were translated outright.
* Pictures under New Car Features > Identification/Search (vehicle outline,
  list of changes, specifications, customize ...) have their Japanese labels
  replaced in place by English the same way. Other New Car Features pictures
  still show their Japanese lettering.
* Screenshots and pictures inside PDFs (wiring-diagram "info" pages, the
  Stop & Go update manual) keep their Japanese too. Where there is room, a
  pale-yellow English caption sits under the label. In dense tables the label
  gets a small number instead, and the English for each number is listed on a
  "translations" page right after that page.
* Those captions were made by reading the pictures with OCR, so a caption can
  occasionally be wrong or slightly misplaced.
* Other pictures in New Car Features > Meter & Gauge System keep their
  original Japanese; a caption under each lists every label in English next to
  the Japanese. All in-place English and captions come from OCR, so
  double-check anything that looks odd against the original.
* Photographs and a few scanned illustrations (mainly the periodic-inspection
  guide) still contain Japanese lettering baked into the picture.
* A handful of very short labels in some wiring diagrams (single characters
  stacked vertically) are rendered literally.
* Features that talked to dealer hardware (TaSCAN / intelligent tester link,
  S2000 program-card updater) cannot work in a browser and are inactive.
* Memos and bookmarks are stored per browser; they are not shared between
  browsers or computers.


THIRD-PARTY COMPONENTS (in _runtime)
------------------------------------
Ruffle 0.7.1 (MIT / Apache-2.0)          https://ruffle.rs
PDF.js 6.4.299 (Apache-2.0)              https://mozilla.github.io/pdf.js/
xslt-polyfill 1.0.34 (BSD, libxslt/libxml2) https://github.com/mfreed7/xslt_polyfill
