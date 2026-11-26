/*
 * ewd-links.js — clickable connector codes for the Disc 1 wiring-diagram PDFs.
 *
 * When this PDF.js viewer is showing a wiring diagram inside the Disc 1 viewer
 * (a frameset with a connector list frame "list" and a details frame "conn"),
 * every connector code printed on the diagram that also appears in the list
 * (C30, A22, 1A ...) becomes a link: clicking it selects that connector in the
 * sidebar and shows its details. Picking a connector in the sidebar highlights
 * it on the diagram.
 */
(function () {
  'use strict';

  function findHost() {
    var w = window;
    for (var i = 0; i < 6 && w && w !== w.parent; i++) {
      w = w.parent;
      try {
        if (w.frames.list && w.frames.conn && w.frames.list.document) return w;
      } catch (e) { return null; }
    }
    return null;
  }

  function hexDecode(h) {
    var s = '';
    for (var i = 0; i + 1 < h.length; i += 2) s += String.fromCharCode(parseInt(h.substr(i, 2), 16));
    return s;
  }

  var host = findHost();
  if (!host) return;

  var codes = {};        // code -> {hex, div}
  var pattern = null;

  function loadCodes() {
    codes = {};
    var listDoc;
    try { listDoc = host.frames.list.document; } catch (e) { return; }
    var divs = listDoc.querySelectorAll('div[onclick]');
    for (var i = 0; i < divs.length; i++) {
      var m = /call_runOnClickItem\('([0-9A-Fa-f]+)'\)/.exec(divs[i].getAttribute('onclick') || '');
      if (!m) continue;
      var decoded = hexDecode(m[1]);
      var code = decoded.slice(decoded.indexOf(':') + 1).trim();
      if (code && !codes[code]) codes[code] = { hex: m[1], div: divs[i] };
      if (!divs[i].__ewdHooked) {
        divs[i].__ewdHooked = true;
        divs[i].addEventListener('click', (function (c) {
          return function () { highlight(c, true); };
        })(code));
      }
    }
    var keys = Object.keys(codes).sort(function (a, b) { return b.length - a.length; });
    pattern = keys.length
      ? new RegExp('(^|[^A-Za-z0-9])(' + keys.map(function (k) { return k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }).join('|') + ')(?=$|[^A-Za-z0-9])', 'g')
      : null;
  }

  function selectInSidebar(code) {
    var entry = codes[code];
    if (!entry) return;
    var lw = host.frames.list;
    // open the details page by absolute URL (a relative one would resolve against this viewer)
    host.frames.conn.location.href = lw.location.href.replace(/connlist_(\w+)\/[^\/]*$/, 'conninfo_$1/' + entry.hex + '.html');
    try {
      lw.resetItemStyle();
      lw.setSelectedItemStyle(entry.div);
      entry.div.scrollIntoView({ block: 'center' });
    } catch (e) {}
    highlight(code, false);
  }

  function highlight(code, scroll) {
    var all = document.querySelectorAll('.ewd-link');
    var first = null;
    for (var i = 0; i < all.length; i++) {
      var on = all[i].dataset.code === code;
      all[i].classList.toggle('ewd-active', on);
      if (on && !first) first = all[i];
    }
    if (scroll && first) first.scrollIntoView({ block: 'center', inline: 'center' });
  }

  function linkify(textLayer) {
    if (!pattern || !textLayer) return;
    var spans = textLayer.querySelectorAll('span[role="presentation"], span:not([class])');
    for (var i = 0; i < spans.length; i++) {
      var span = spans[i];
      if (span.__ewdDone || span.children.length) continue;
      span.__ewdDone = true;
      var text = span.textContent;
      pattern.lastIndex = 0;
      if (!pattern.test(text)) continue;
      pattern.lastIndex = 0;
      var frag = document.createDocumentFragment(), pos = 0, m;
      while ((m = pattern.exec(text))) {
        var start = m.index + m[1].length;
        if (start > pos) frag.appendChild(document.createTextNode(text.slice(pos, start)));
        var a = document.createElement('span');
        a.className = 'ewd-link';
        a.dataset.code = m[2];
        a.title = 'Show connector ' + m[2];
        a.textContent = m[2];
        frag.appendChild(a);
        pos = start + m[2].length;
      }
      if (pos < text.length) frag.appendChild(document.createTextNode(text.slice(pos)));
      span.textContent = '';
      span.appendChild(frag);
    }
  }

  var css = document.createElement('link');   // a file, not inline: the viewer's CSP blocks inline styles
  css.rel = 'stylesheet';
  css.href = 'ewd-links.css';
  document.head.appendChild(css);

  document.addEventListener('click', function (e) {
    var t = e.target.closest && e.target.closest('.ewd-link');
    if (!t) return;
    e.preventDefault();
    e.stopPropagation();
    selectInSidebar(t.dataset.code);
  }, true);

  function start() {
    var app = window.PDFViewerApplication;
    if (!app || !app.initializedPromise) { setTimeout(start, 50); return; }
    app.initializedPromise.then(function () {
      loadCodes();
      app.eventBus.on('textlayerrendered', function (ev) {
        if (!pattern) loadCodes();
        var pageView = app.pdfViewer.getPageView(ev.pageNumber - 1);
        var layer = pageView && pageView.textLayer && pageView.textLayer.div;
        linkify(layer || document.querySelector('.page[data-page-number="' + ev.pageNumber + '"] .textLayer'));
      });
    });
  }
  // the sidebar list may still be loading when the PDF opens
  try {
    var lw = host.frames.list;
    if (lw.document.readyState !== 'complete') lw.addEventListener('load', loadCodes);
  } catch (e) {}
  start();
})();
