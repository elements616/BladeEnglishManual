# **Electronic Technical Manual – English Edition**

**Source:** Maintenance CD pair SC0553J (Blade, 2006–2012: AZE154H / AZE156H / GRE156H), covering the 2006/12, 2007/08, 2008/10 and 2009/12 releases.

This repo contains a modernised, English copy of both CDs. The original CDs required Windows XP, Internet Explorer 6, a Japanese system locale, Adobe SVG Viewer and Flash Player 7.

This edition runs in any current browser (Chrome, Edge, Firefox, Safari) on macOS, Windows or Linux.

## **How to Open It**

| Platform      | How to launch                             |
|---------------|-------------------------------------------|
| macOS         |   Double-click Start Manual (Mac).command |
| Windows       |   Double-click Start Manual (Windows).bat |
| Linux / Other |   Run python3 serve.py in this folder     |


A small local web server starts and your browser opens the manual.

Keep the terminal window open while using the manual. Close it (or press  `Ctrl+C`) to stop the server.

**Requirement:** Python 3 is required (preinstalled on most Macs; available free from  [python.org](https://www.python.org/)).

### **Why Does It Need a Server?**

Modern browsers block framed pages from communicating with each other and prevent XML loading when pages are opened directly from disk.

The local server solves these restrictions by serving the manual over HTTP. It only listens on  `127.0.0.1`, meaning nothing is accessible from other computers on your network.

### **What’s Included?**

The start page provides access to both discs:

**Disc 1 – Pre-rendered HTML Manual**

-   Release-date selection
-   Repair Manual
-   New Car Features
-   Electrical Wiring Diagram
-   Function-Specific Repair Manual

**Disc 2 – Full Interactive Viewer**

-   Removal/installation picture index
-   Inspection
-   Troubleshooting
-   New Car Features with animations
-   Wiring diagrams
-   Connector, fuse and ground lists
-   Part-name search
-   Bookmarks and memos

## **What Was Changed**

-   All text translated from Japanese to English: approximately **61,000 unique sentences across 46,000 files**, including HTML pages, XML data, XSL stylesheets, scripts, SVG diagrams, wiring-diagram PDFs, Flash animation labels and button images.
-   Converted to HTML5 and UTF-8 (the original CDs used Shift_JIS).
-   Internet Explorer-only technologies replaced with modern browser features:

|Original Technology                     |Modern Replacement                                                                                                                          |
|----------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------|
|MSXML ActiveX (XML loading, XPath, XSLT)|Browser XML APIs; XSLT runs natively or through a bundled WebAssembly libxslt engine (newer Chrome versions no longer support XSLT natively)|
|Modal/modeless dialogs and pop-up menus |In-page equivalents                                                                                                                         |
|Adobe SVG Viewer                        |Native SVG (compressed  `.svgz` files unpacked to `.svg`)                                                                                   |
|Flash Player                            |Ruffle (bundled; plays the original  `.swf` files)                                                                                          |
|Adobe Reader plug-in                    |PDF.js (bundled; wiring diagrams and other PDFs open inside the page in every browser)                                                      |
|Memo/bookmark ActiveX file plug-in      |Browser local storage                                                                                                                       |

**Additional improvements:**

-   Raster copies of the repair illustrations (used for printing and on Disc 1) were redrawn from the translated SVG diagrams.
-   Original framesets, page layouts, colours and images have been preserved so the manual looks and behaves like the original.


## **Known Limitations**

-   **Machine translation:** Translation was performed using Claude. It follows industry-standard English service-manual terminology, but critical values (torque specifications, clearances, wiring, etc.) should always be checked against the original diagrams when in doubt. If you do not have access to these, you should know who to speak to for further clarification.
-   **Flash animation labels:** Some Flash animations render their labels as vector outlines rather than text. These labels were read using OCR, and English translations are drawn over the original Japanese. Labels stored as text were translated directly.
-   **New Car Features identification pictures:** Pictures under _New Car Features > Identification/Search_ (vehicle outline, list of changes, specifications, customise, etc.) have their Japanese labels replaced in place with English using the same OCR-based approach. Other New Car Features pictures still contain Japanese lettering.
-   **PDF screenshots and pictures:** Screenshots and pictures inside PDFs (including wiring-diagram information pages and the Stop & Go update manual) retain their Japanese lettering.

    -   Where space permits, a pale-yellow English caption sits beneath the original label.
    -   In dense tables, labels are replaced with small numbers, with the corresponding English translations listed on a _translations_ page immediately after the relevant page.
    -   Captions were produced using OCR, so occasional inaccuracies or positioning issues are possible.
-   **Meter & Gauge System:** Other pictures under _New Car Features > Meter & Gauge System_ retain their original Japanese lettering. A caption beneath each picture lists every label in English alongside the Japanese. All in-place translations and captions are OCR-based, so anything unusual should be checked against the original.
-   **Photographs and scanned illustrations:** Some photographs and scanned illustrations (mainly in the periodic-inspection guide) still contain Japanese lettering embedded in the image.
-   **Wiring diagram labels:** A handful of very short labels in some wiring diagrams (single characters stacked vertically) are rendered literally.
-   **Dealer hardware features:** Features requiring dealer hardware (TaSCAN / intelligent tester link and S2000 program-card updater) cannot operate in a browser and are inactive. As such these have been removed from the project.
-   **Bookmarks and memos:** These are stored separately in each browser and are not shared between browsers or computers.

## **Third-Party Components**

The following components are bundled in the  `_runtime` folder:

|Component    |Version|Licence             |Website                          |
|-------------|-------|--------------------|---------------------------------|
|Ruffle       |0.71   |MIT / Apache-2.0     |ruffle.rs                       |
|PDF.js       |6.4.299|Apache-2.0           |mozilla.github.io/js            |
|xlst-polyfill|1.0.34 |BSD (libxslt/libxml2)|github.com/mfreed7/xslt_polyfill|