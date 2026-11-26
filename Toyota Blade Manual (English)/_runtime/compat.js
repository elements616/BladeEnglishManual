/*
 * compat.js — Internet Explorer 6 / MSXML 3 compatibility layer
 *
 * Lets the 2004–2009 Toyota electronic manual run unmodified in modern
 * browsers. It provides:
 *   - ActiveXObject for Msxml2.DOMDocument / FreeThreadedDOMDocument /
 *     XSLTemplate / XMLHTTP, backed by DOMParser, XPath and XSLTProcessor
 *     (or the bundled libxslt WebAssembly polyfill where the browser has
 *     dropped XSLT)
 *   - MSXML node extensions: selectNodes, selectSingleNode, .xml, .text,
 *     nodeTypedValue, transformNode, baseName, nextNode()
 *   - showModalDialog / showModelessDialog (in-page dialog overlay)
 *   - window.createPopup
 *   - AxPlug.FileAccess (memos / bookmarks saved to localStorage)
 *   - attachEvent, document.all.tags, currentStyle, fireEvent, navigate
 *   - the Adobe SVG Viewer getStyle() helper
 */
(function () {
  'use strict';
  var W = window;
  if (W.__ieCompat) return;
  W.__ieCompat = true;

  var RUNTIME = (function () {
    var s = document.currentScript;
    return s ? s.src.replace(/[^\/]*$/, '') : '';
  })();

  // IE quirks mode (every page on the CDs): document.body.clientWidth/Height is
  // the size of the window, not of the page content. Scripts size diagrams with it.
  (function () {
    var BP = W.HTMLBodyElement && W.HTMLBodyElement.prototype;
    var EPr = W.Element.prototype;
    ['clientWidth', 'clientHeight'].forEach(function (p) {
      var d = Object.getOwnPropertyDescriptor(EPr, p);
      if (!BP || !d || !d.get) return;
      Object.defineProperty(BP, p, {
        configurable: true,
        get: function () {
          var de = this.ownerDocument.documentElement;
          return this === this.ownerDocument.body && de ? de[p] : d.get.call(this);
        }
      });
    });
  })();

  function def(proto, name, desc) {
    try {
      if (!(name in proto) || desc.force) {
        delete desc.force;
        desc.configurable = true;
        Object.defineProperty(proto, name, desc);
      }
    } catch (e) { /* ignore */ }
  }

  // -------------------------------------------------------------------
  // Synchronous fetch (MSXML loads are synchronous)
  var cache = {};
  function absUrl(url, base) {
    try { return new URL(url, base || document.baseURI).href; } catch (e) { return url; }
  }
  function syncGet(url) {
    if (cache.hasOwnProperty(url)) return cache[url];
    var x = new XMLHttpRequest();
    try {
      x.open('GET', url, false);
      x.overrideMimeType('text/plain; charset=utf-8');
      x.send(null);
      var ok = (x.status >= 200 && x.status < 300) || (x.status === 0 && x.responseText);
      var res = ok ? x.responseText : null;
      if (/\.(xsl|dtd|js)$/i.test(url)) cache[url] = res;
      return res;
    } catch (e) {
      return null;
    }
  }
  W.__compatSyncGet = syncGet;

  // -------------------------------------------------------------------
  // XML parsing with MSXML-like whitespace handling
  function stripWhitespace(node) {
    var c = node.firstChild;
    while (c) {
      var n = c.nextSibling;
      if (c.nodeType === 3 && !/\S/.test(c.nodeValue)) {
        var p = c.parentNode, keep = false;
        for (var a = p; a && a.nodeType === 1; a = a.parentNode) {
          var sp = a.getAttribute('xml:space');
          if (sp) { keep = sp === 'preserve'; break; }
        }
        if (!keep && !(p.namespaceURI === 'http://www.w3.org/1999/XSL/Transform' && p.localName === 'text')) p.removeChild(c);
      } else if (c.nodeType === 1) {
        stripWhitespace(c);
      }
      c = n;
    }
  }

  function parseError(code, reason, url) {
    return { errorCode: code, reason: reason || '', url: url || '', line: 0, linepos: 0, srcText: '', filepos: 0 };
  }

  // MSXML loaded external parsed entities (<!ENTITY X SYSTEM "file.xml"> ... &X;); browsers
  // never do, so documents built from such pieces (e.g. New Car Features > Identification/
  // Search > List of Changes) came out empty. Inline them before parsing.
  function expandEntities(text, url, depth) {
    depth = depth || 0;
    if (depth > 8 || !/<!ENTITY\s/.test(text)) return text;
    var dt = /<!DOCTYPE[^\[>]*\[([\s\S]*?)\]\s*>/.exec(text);
    if (!dt) return text;
    var decl = /<!ENTITY\s+([\w.:-]+)\s+SYSTEM\s+("([^"]*)"|'([^']*)')\s*>/g, m, ents = {};
    while ((m = decl.exec(dt[1]))) ents[m[1]] = m[3] != null ? m[3] : m[4];
    var names = Object.keys(ents);
    if (!names.length) return text;
    var body = text.slice(dt.index + dt[0].length);
    var head = text.slice(0, dt.index) + dt[0].replace(decl, '');
    // an included piece may itself refer to entities declared here, so repeat until done
    var got = {};
    for (var pass = 0, changed = true; changed && pass < 8; pass++) {
      changed = false;
      names.forEach(function (n) {
        var ref = '&' + n + ';';
        if (body.indexOf(ref) < 0) return;
        if (!got.hasOwnProperty(n)) {
          var href = absUrl(ents[n], url);
          var sub = syncGet(href);
          if (sub == null && href !== href.toLowerCase()) sub = syncGet(href.toLowerCase());
          got[n] = sub == null ? null : expandEntities(sub, href, depth + 1)
            .replace(/^﻿?\s*<\?xml[^>]*\?>/, '')
            .replace(/<!DOCTYPE[^\[>]*(\[[\s\S]*?\]\s*)?>/, '');
        }
        if (got[n] == null) return;
        body = body.split(ref).join(got[n]);
        changed = true;
      });
    }
    return head + body;
  }

  function parseInto(doc, text, url) {
    text = expandEntities(text, url);
    var parsed = new DOMParser().parseFromString(text, 'application/xml');
    var err = parsed.getElementsByTagName('parsererror');
    if (err.length && (!parsed.documentElement || parsed.documentElement.localName === 'parsererror' ||
        err[0].namespaceURI === 'http://www.mozilla.org/newlayout/xml/parsererror.xml' || err[0].parentNode === parsed.documentElement)) {
      doc.__parseError = parseError(-1, err[0].textContent, url);
      return false;
    }
    while (doc.firstChild) doc.removeChild(doc.firstChild);
    for (var c = parsed.firstChild; c; c = c.nextSibling) {
      if (c.nodeType === 10) continue; // doctype
      doc.appendChild(doc.importNode(c, true));
    }
    if (!doc.__preserveWhiteSpace) stripWhitespace(doc);
    doc.__parseError = parseError(0, '', url);
    doc.__url = url;
    if (doc.documentElement && doc.documentElement.namespaceURI === 'http://www.w3.org/1999/XSL/Transform') {
      flattenIncludes(doc, url);
    }
    return true;
  }

  // Inline <xsl:include> so stylesheets can be handed to any XSLT engine.
  function flattenIncludes(doc, url, depth) {
    depth = depth || 0;
    var XSL = 'http://www.w3.org/1999/XSL/Transform';
    var incs = Array.prototype.slice.call(doc.getElementsByTagNameNS(XSL, 'include'));
    incs.forEach(function (inc) {
      var href = absUrl(inc.getAttribute('href'), url);
      var txt = syncGet(href) || syncGet(href.toLowerCase());
      var parent = inc.parentNode;
      if (txt && depth < 10) {
        var sub = document.implementation.createDocument(null, null, null);
        parseInto(sub, txt, href);
        flattenIncludes(sub, href, depth + 1);
        var root = sub.documentElement;
        if (root) {
          for (var c = root.firstChild; c; c = c.nextSibling) {
            parent.insertBefore(doc.importNode(c, true), inc);
          }
        }
      }
      parent.removeChild(inc);
    });
  }

  function newXmlDoc() {
    var d = document.implementation.createDocument(null, null, null);
    d.__isMsxml = true;
    d.async = false;
    d.__parseError = parseError(0, '', '');
    return d;
  }

  // -------------------------------------------------------------------
  // MSXML API on XML documents and nodes
  var XD = (W.XMLDocument || W.Document).prototype;
  def(XD, 'load', {
    value: function (url) {
      var u = absUrl(String(url));
      var txt = syncGet(u);
      if (txt == null && u !== u.toLowerCase()) txt = syncGet(u.toLowerCase());
      if (txt == null) { this.__parseError = parseError(-2146697210, 'The system cannot locate the object specified: ' + url, u); return false; }
      return parseInto(this, txt, u);
    }, writable: true, force: true
  });
  def(XD, 'loadXML', { value: function (s) { return parseInto(this, String(s), this.__url || document.baseURI); }, writable: true });
  def(XD, 'parseError', { get: function () { return this.__parseError || parseError(0, '', ''); } });
  def(XD, 'setProperty', { value: function (k, v) { if (k === 'preserveWhiteSpace') this.__preserveWhiteSpace = v; }, writable: true });
  def(XD, 'getProperty', { value: function (k) { return k === 'SelectionLanguage' ? 'XPath' : null; }, writable: true });
  def(XD, 'preserveWhiteSpace', { get: function () { return !!this.__preserveWhiteSpace; }, set: function (v) { this.__preserveWhiteSpace = v; } });
  def(XD, 'validateOnParse', { get: function () { return false; }, set: function () {} });
  def(XD, 'resolveExternals', { get: function () { return false; }, set: function () {} });
  def(XD, 'readyState', { get: function () { return 4; } });

  function nsResolver(node) {
    var doc = node.nodeType === 9 ? node : node.ownerDocument;
    return function (prefix) {
      if (prefix === 'xsl') return 'http://www.w3.org/1999/XSL/Transform';
      var r = doc && doc.documentElement && doc.documentElement.lookupNamespaceURI(prefix);
      return r || null;
    };
  }

  function makeList(arr) {
    var i = 0;
    arr.item = function (n) { return n < arr.length ? arr[n] : null; };
    arr.nextNode = function () { return i < arr.length ? arr[i++] : null; };
    arr.reset = function () { i = 0; };
    return arr;
  }

  function isXmlNode(n) {
    var d = n.nodeType === 9 ? n : n.ownerDocument;
    return d && !(d instanceof HTMLDocument && d.contentType === 'text/html') ;
  }

  function evaluate(node, expr, type) {
    var doc = node.nodeType === 9 ? node : node.ownerDocument;
    return doc.evaluate(expr, node, nsResolver(node), type, null);
  }

  var NP = Node.prototype;
  def(NP, 'selectNodes', {
    value: function (expr) {
      var r = evaluate(this, expr, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE), a = [];
      for (var i = 0; i < r.snapshotLength; i++) a.push(r.snapshotItem(i));
      return makeList(a);
    }, writable: true
  });
  def(NP, 'selectSingleNode', {
    value: function (expr) {
      return evaluate(this, expr, XPathResult.FIRST_ORDERED_NODE_TYPE).singleNodeValue;
    }, writable: true
  });
  def(NP, 'xml', { get: function () { return new XMLSerializer().serializeToString(this); } });
  function textOf(n) {
    if (n.nodeType === 1 || n.nodeType === 9 || n.nodeType === 11) {
      var t = n.textContent || '';
      return n.ownerDocument && n.ownerDocument.__preserveWhiteSpace ? t : t.replace(/^\s+|\s+$/g, '');
    }
    return n.nodeValue;
  }
  def(NP, 'text', {
    get: function () { return textOf(this); },
    set: function (v) { if (this.nodeType === 1) this.textContent = v; else this.nodeValue = v; }
  });
  def(NP, 'nodeTypedValue', {
    get: function () { return this.nodeType === 1 || this.nodeType === 9 ? (this.textContent || '') : this.nodeValue; },
    set: function (v) { if (this.nodeType === 1) this.textContent = v; else this.nodeValue = v; }
  });
  def(NP, 'baseName', { get: function () { return this.localName || this.nodeName; } });
  def(NP, 'transformNode', { value: function (xsl) { return transform(this, xsl, null); }, writable: true });
  def(NP, 'transformNodeToObject', {
    value: function (xsl, out) {
      var s = transform(this, xsl, null);
      if (out && out.loadXML) out.loadXML(s);
    }, writable: true
  });
  def(NP, 'parsed', { get: function () { return true; } });
  def(NP, 'definition', { get: function () { return null; } });

  // MSXML's getElementsByTagName accepted query patterns such as "Code[@type='conn']"
  [W.Document && Document.prototype, W.Element && Element.prototype].forEach(function (proto) {
    var native = proto.getElementsByTagName;
    proto.getElementsByTagName = function (name) {
      var doc = this.nodeType === 9 ? this : this.ownerDocument;
      if (/[\[\]\/@]/.test(String(name)) && doc && !(doc instanceof HTMLDocument)) {
        return this.selectNodes('.//' + name);
      }
      return native.call(this, name);
    };
  });

  // NodeList / HTMLCollection iteration helpers used by MSXML code
  [W.NodeList, W.HTMLCollection, W.NamedNodeMap].forEach(function (C) {
    if (!C) return;
    var idx = new WeakMap();
    def(C.prototype, 'nextNode', {
      value: function () { var i = idx.get(this) || 0; idx.set(this, i + 1); return i < this.length ? this[i] : null; },
      writable: true
    });
    def(C.prototype, 'reset', { value: function () { idx.set(this, 0); }, writable: true });
    def(C.prototype, 'getLength', { value: function () { return this.length; }, writable: true });  // Adobe SVG Viewer
  });

  // -------------------------------------------------------------------
  // XSLT
  var polyfillState = null; // null | 'loading' | 'ready'
  function nativeXslt() {
    try {
      var p = new W.XSLTProcessor();
      var x = new DOMParser().parseFromString(
        '<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:template match="/"><o/></xsl:template></xsl:stylesheet>',
        'application/xml');
      p.importStylesheet(x);
      var r = p.transformToDocument(new DOMParser().parseFromString('<a/>', 'application/xml'));
      return !!(r && r.documentElement && r.documentElement.localName === 'o');
    } catch (e) { return false; }
  }
  var HAS_NATIVE = !!W.XSLTProcessor && !W.xsltPolyfillInstalled && nativeXslt();

  function getProcessorCtor() {
    if (HAS_NATIVE) return W.XSLTProcessor;
    // look for an initialised polyfill in this window or any ancestor
    var w = W;
    for (var i = 0; i < 10 && w; i++) {
      try { if (w.__xsltPolyfillReady && w.XSLTProcessor) return w.XSLTProcessor; } catch (e) { break; }
      if (w === w.parent) break;
      w = w.parent;
    }
    return null;
  }

  function serializeResult(res, doc) {
    if (!res) return '';
    if (res.nodeType === 9) {
      var root = res.documentElement;
      if (!root) return '';
      // native engines wrap text output in <transformiix:result> / <pre>
      if (root.localName === 'result' && /transformiix/.test(root.namespaceURI || '')) return root.textContent;
      if (res instanceof HTMLDocument || (root.namespaceURI === 'http://www.w3.org/1999/xhtml' && res.body)) {
        var h = root.outerHTML;
        // fragment-only output gets wrapped by engines in <html><body>
        if (!/^<html[\s>]/i.test(h)) return h;
        var hasHead = res.head && res.head.childNodes.length;
        if (!hasHead && res.body) return res.body.innerHTML;
        return h;
      }
      return new XMLSerializer().serializeToString(res);
    }
    return new XMLSerializer().serializeToString(res);
  }

  function transform(input, xsl, params) {
    var Ctor = getProcessorCtor();
    if (!Ctor) {
      ensurePolyfill();
      console.warn('XSLT engine not ready yet');
      return '';
    }
    var p = new Ctor();
    var xslDoc = xsl && xsl.__xslDoc ? xsl.__xslDoc : xsl;
    if (xslDoc && xslDoc.XMLDocument) xslDoc = xslDoc.XMLDocument;        // <xml> data island
    if (xslDoc && xslDoc.nodeType === 1 && xslDoc.ownerDocument) xslDoc = xslDoc.ownerDocument;
    if (input && input.XMLDocument) input = input.XMLDocument;
    p.importStylesheet(xslDoc);
    if (params) for (var k in params) if (params.hasOwnProperty(k)) {
      try { p.setParameter(null, k, params[k]); } catch (e) {}
    }
    var src = input;
    var outDoc;
    try {
      outDoc = p.transformToDocument(src);
    } catch (e) {
      console.error('XSLT failed', e);
      return '';
    }
    var method = '';
    var out = xslDoc.getElementsByTagNameNS('http://www.w3.org/1999/XSL/Transform', 'output')[0];
    if (out) method = out.getAttribute('method') || '';
    if (method === 'text' && outDoc && outDoc.documentElement) return outDoc.documentElement.textContent;
    return serializeResult(outDoc, document);
  }
  W.__compatTransform = transform;

  function ensurePolyfill() {
    if (HAS_NATIVE || polyfillState) return;
    // only the top window loads the engine; frames borrow it
    var t = W;
    try { while (t.parent !== t && t.parent.__ieCompat) t = t.parent; } catch (e) {}
    if (t !== W) { try { t.__compatEnsurePolyfill(); } catch (e) {} return; }
    polyfillState = 'loading';
    W.xsltDontAutoloadXmlDocs = true;
    W.xsltPolyfillQuiet = true;
    var x = new XMLHttpRequest();
    x.open('GET', RUNTIME + 'xslt-polyfill.min.js', false);
    x.send(null);
    (0, eval)(x.responseText);
    var ready = W.xsltPolyfillReady ? W.xsltPolyfillReady() : Promise.resolve();
    ready.then(function () { W.__xsltPolyfillReady = true; polyfillState = 'ready'; });
  }
  W.__compatEnsurePolyfill = ensurePolyfill;
  W.__compatXsltReady = function () {
    if (HAS_NATIVE) return Promise.resolve();
    ensurePolyfill();
    var t = W;
    try { while (t.parent !== t && t.parent.__ieCompat) t = t.parent; } catch (e) {}
    return new Promise(function (res) {
      (function wait() { if (t.__xsltPolyfillReady) res(); else setTimeout(wait, 30); })();
    });
  };
  if (!HAS_NATIVE) ensurePolyfill();

  function XSLTemplate() {
    var self = this, sheet = null;
    Object.defineProperty(this, 'stylesheet', { get: function () { return sheet; }, set: function (v) { sheet = v; } });
    this.createProcessor = function () {
      var params = {}, proc = { input: null, output: '' };
      proc.addParameter = function (k, v) { params[k] = v == null ? '' : v; };
      proc.transform = function () { proc.output = transform(proc.input, sheet, params); return true; };
      proc.setStartMode = function () {};
      proc.reset = function () { params = {}; };
      return proc;
    };
  }

  // -------------------------------------------------------------------
  // AxPlug.FileAccess → localStorage
  function FileAccess() { this.Result = 0; }
  var FA_PREFIX = 'blade-manual-file:';
  FileAccess.prototype.AxReadFile = function (name) {
    var v = null;
    try { v = localStorage.getItem(FA_PREFIX + name); } catch (e) {}
    this.Result = v == null ? 1 : 0;
    return v == null ? '' : v;
  };
  FileAccess.prototype.AxWriteFile = function (name, text) {
    try { localStorage.setItem(FA_PREFIX + name, text == null ? '' : String(text)); this.Result = 0; }
    catch (e) { this.Result = 1; }
    return this.Result;
  };
  FileAccess.prototype.AxDeleteFile = function (name) {
    try { localStorage.removeItem(FA_PREFIX + name); } catch (e) {}
    this.Result = 0;
    return 0;
  };
  FileAccess.prototype.AxExistFile = function (name) {
    var v = null;
    try { v = localStorage.getItem(FA_PREFIX + name); } catch (e) {}
    return v != null;
  };

  // -------------------------------------------------------------------
  // ActiveXObject
  function ActiveXObject(progid) {
    var id = String(progid).toLowerCase();
    if (/domdocument/.test(id)) return newXmlDoc();
    if (/xsltemplate/.test(id)) return new XSLTemplate();
    if (/xmlhttp/.test(id)) return new XMLHttpRequest();
    if (id === 'axplug.fileaccess.1') return new FileAccess();
    if (id === 'adobe.svgctl') return {};
    if (id === 'scripting.dictionary') return new Map();
    throw new Error('ActiveX component "' + progid + '" is not available in this browser');
  }
  W.ActiveXObject = ActiveXObject;

  // -------------------------------------------------------------------
  // Dialogs: showModalDialog / showModelessDialog
  function topWin() {
    var t = W;
    try { while (t.parent !== t && t.parent.document) t = t.parent; } catch (e) {}
    return t;
  }
  function parseFeatures(f) {
    var o = {};
    String(f || '').split(/[;,]/).forEach(function (p) {
      var kv = p.split(/[:=]/);
      if (kv.length === 2) o[kv[0].trim().toLowerCase()] = kv[1].trim();
    });
    return o;
  }
  function px(v, d) { var n = parseInt(v, 10); return isNaN(n) ? d : n; }

  function openDialog(url, args, features, modal, callback) {
    var T = largestLeaf(topWin()), D = T.document;
    var f = parseFeatures(features);
    var w = Math.min(px(f.dialogwidth, 700), T.innerWidth - 20);
    var h = Math.min(px(f.dialogheight, 500), T.innerHeight - 20);
    var veil = D.createElement('div');
    veil.className = '__ie-dialog-veil';
    veil.style.cssText = 'position:fixed;inset:0;z-index:2147483000;background:' + (modal ? 'rgba(0,0,0,.25)' : 'transparent') +
      ';' + (modal ? '' : 'pointer-events:none;');
    var box = D.createElement('div');
    var left = f.dialogleft != null ? px(f.dialogleft, 0) : Math.max(10, (T.innerWidth - w) / 2);
    var top = f.dialogtop != null ? px(f.dialogtop, 0) : Math.max(10, (T.innerHeight - h) / 2);
    left = Math.max(0, Math.min(left, T.innerWidth - w));
    top = Math.max(0, Math.min(top, T.innerHeight - h));
    box.style.cssText = 'position:absolute;left:' + left + 'px;top:' + top + 'px;width:' + w + 'px;height:' + (h + 26) +
      'px;background:#d4d0c8;border:1px solid #404040;box-shadow:0 6px 24px rgba(0,0,0,.45);display:flex;flex-direction:column;pointer-events:auto;';
    var bar = D.createElement('div');
    bar.style.cssText = 'height:26px;flex:none;background:linear-gradient(#0a246a,#3a6ea5);color:#fff;font:bold 12px Tahoma,Arial,sans-serif;' +
      'display:flex;align-items:center;padding:0 4px 0 8px;cursor:move;user-select:none;';
    var title = D.createElement('span');
    title.style.cssText = 'flex:1;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;';
    var x = D.createElement('button');
    x.textContent = '✕';
    x.title = 'Close';
    x.style.cssText = 'width:20px;height:18px;font:11px Arial;padding:0;border:1px solid #fff;background:#d4d0c8;color:#000;cursor:pointer;';
    bar.appendChild(title); bar.appendChild(x);
    var frame = D.createElement('iframe');
    frame.style.cssText = 'flex:1;border:0;width:100%;background:#fff;';
    frame.__dialogArguments = args;
    frame.__dialogOpener = W;
    box.appendChild(bar); box.appendChild(frame); veil.appendChild(box); D.body.appendChild(veil);
    var closed = false;
    function close() {
      if (closed) return;
      closed = true;
      var rv;
      try {
        var cw = frame.contentWindow;
        rv = cw.__returnValue !== undefined ? cw.__returnValue : cw.returnValue;
        if (rv === undefined) {
          for (var i = 0; i < cw.frames.length; i++) {
            try { if (cw.frames[i].returnValue !== undefined) { rv = cw.frames[i].returnValue; break; } } catch (e) {}
          }
        }
      } catch (e) {}
      veil.remove();
      if (callback) try { callback(rv); } catch (e) { console.error(e); }
    }
    frame.__dialogClose = close;
    x.onclick = close;
    frame.addEventListener('load', function () {
      try {
        var cw = frame.contentWindow;
        title.textContent = cw.document.title || '';
        if (cw.location.href === 'about:blank') return;
      } catch (e) {}
    });
    // drag
    bar.addEventListener('mousedown', function (e) {
      if (e.target === x) return;
      var sx = e.clientX - box.offsetLeft, sy = e.clientY - box.offsetTop;
      frame.style.pointerEvents = 'none';
      function mv(ev) { box.style.left = (ev.clientX - sx) + 'px'; box.style.top = (ev.clientY - sy) + 'px'; }
      function up() { D.removeEventListener('mousemove', mv); D.removeEventListener('mouseup', up); frame.style.pointerEvents = ''; }
      D.addEventListener('mousemove', mv); D.addEventListener('mouseup', up);
    });
    frame.src = absUrl(url);
    return frame;
  }

  // Modal dialogs were synchronous in IE (code waited for the return value).
  // Here the dialog opens asynchronously; when it closes with a value, the user
  // action that opened it is replayed, and the repeated showModalDialog call for
  // the same URL returns that value at once instead of opening again.
  function currentEvent() {
    var found = null;
    (function walk(w) {
      if (found) return;
      try { if (w.event) { found = w.event; return; } } catch (e) { return; }
      try { for (var i = 0; i < w.frames.length; i++) walk(w.frames[i]); } catch (e) {}
    })(topWin());
    return found;
  }
  function dialogKey(url) { return String(url).replace(/[?#].*$/, '').replace(/^.*\//, ''); }
  W.showModalDialog = function (url, args, features, callback) {
    var T = topWin();
    var key = dialogKey(url);
    var pend = T.__dialogReplay;
    if (!callback && pend && pend.key === key && Date.now() - pend.time < 3000) {
      T.__dialogReplay = null;
      return pend.value;
    }
    var ev = callback ? null : currentEvent();
    var target = ev && ev.target, type = ev && ev.type;
    openDialog(url, args, features, true, function (rv) {
      if (callback) return callback(rv);
      if (rv == null || rv === '' || rv === 'close' || !target || !target.isConnected) return;
      T.__dialogReplay = { key: key, value: rv, time: Date.now() };
      var v = target.ownerDocument.defaultView;
      var E = /^(click|dblclick|mouse)/.test(type) ? v.MouseEvent : v.Event;
      target.dispatchEvent(new E(type || 'click', { bubbles: true, cancelable: true }));
      if (T.__dialogReplay && T.__dialogReplay.key === key) T.__dialogReplay = null;
    });
    return undefined;
  };
  // A simple in-page modal message (used instead of the browser's alert box)
  W.__modalNotice = function (message, title) {
    var D = document;
    var old = D.getElementById('__ie-notice');
    if (old) old.remove();
    var veil = D.createElement('div');
    veil.id = '__ie-notice';
    veil.setAttribute('role', 'alertdialog');
    veil.setAttribute('aria-modal', 'true');
    veil.style.cssText = 'position:fixed;inset:0;z-index:2147483002;background:rgba(0,0,0,.3);display:flex;align-items:center;justify-content:center;';
    var box = D.createElement('div');
    box.style.cssText = 'min-width:300px;max-width:90vw;background:#d4d0c8;border:1px solid #404040;box-shadow:0 6px 24px rgba(0,0,0,.45);font:12px Tahoma,Arial,sans-serif;color:#000;';
    var bar = D.createElement('div');
    bar.textContent = title || 'Electronic Technical Manual';
    bar.style.cssText = 'background:linear-gradient(#0a246a,#3a6ea5);color:#fff;font-weight:bold;padding:5px 8px;';
    var body = D.createElement('div');
    body.style.cssText = 'padding:18px 20px 14px;display:flex;align-items:center;gap:14px;';
    var icon = D.createElement('div');
    icon.textContent = '!';
    icon.style.cssText = 'flex:none;width:28px;height:28px;border-radius:50%;background:#f0c000;border:1px solid #8a6d00;font:bold 18px/28px Arial;text-align:center;';
    var msg = D.createElement('div');
    msg.textContent = message;
    msg.style.cssText = 'font-size:13px;';
    body.appendChild(icon); body.appendChild(msg);
    var foot = D.createElement('div');
    foot.style.cssText = 'text-align:center;padding:0 0 14px;';
    var ok = D.createElement('button');
    ok.textContent = 'OK';
    ok.style.cssText = 'min-width:80px;padding:3px 12px;font:12px Tahoma,Arial,sans-serif;';
    foot.appendChild(ok);
    box.appendChild(bar); box.appendChild(body); box.appendChild(foot);
    veil.appendChild(box);
    (D.body || D.documentElement).appendChild(veil);
    function close() { veil.remove(); D.removeEventListener('keydown', key, true); }
    function key(e) {
      if (e.key === 'Enter' || e.key === 'Escape') { e.preventDefault(); close(); }
      else if (e.key === 'Tab') { e.preventDefault(); ok.focus(); }
    }
    ok.onclick = close;
    D.addEventListener('keydown', key, true);
    ok.focus();
  };

  W.showModelessDialog = function (url, args, features) {
    var fr = openDialog(url, args, features, false, null);
    return fr.contentWindow;
  };

  // Inside a dialog frame: dialogArguments, returnValue, close()
  (function () {
    var fe = null;
    try { fe = W.frameElement; } catch (e) {}
    if (fe && fe.__dialogClose) {
      W.dialogArguments = fe.__dialogArguments;
      W.opener = W.opener || fe.__dialogOpener;
      W.close = function () { fe.__dialogClose(); };
      W.dialogWidth = fe.offsetWidth + 'px';
      W.dialogHeight = fe.offsetHeight + 'px';
    }
  })();

  // -------------------------------------------------------------------
  // Frame geometry helpers (popups and dialogs may need to sit in another
  // frame, because a <frameset> document has no body to draw on)
  function frameOffset(win) {
    // offset of win's viewport inside the top window's viewport
    var x = 0, y = 0, w = win;
    try {
      while (w !== w.parent && w.frameElement) {
        var r = w.frameElement.getBoundingClientRect();
        var cs = w.parent.getComputedStyle(w.frameElement);
        x += r.left + (parseFloat(cs.borderLeftWidth) || 0);
        y += r.top + (parseFloat(cs.borderTopWidth) || 0);
        w = w.parent;
      }
    } catch (e) {}
    return { x: x, y: y, top: w };
  }
  function childFrames(doc) {
    return Array.prototype.slice.call(doc.querySelectorAll('frame, iframe')).filter(function (f) {
      return !/__ie-/.test(f.className) && f.getBoundingClientRect().width > 0;
    });
  }
  // the leaf (non-frameset) window under a point given in top-window coords
  function leafAt(top, px, py) {
    var w = top, ox = 0, oy = 0;
    for (var guard = 0; guard < 10; guard++) {
      var d;
      try { d = w.document; } catch (e) { break; }
      var isFs = d.body && d.body.tagName === 'FRAMESET';
      if (!isFs) break;
      var hit = null;
      childFrames(d).forEach(function (f) {
        var r = f.getBoundingClientRect();
        if (px - ox >= r.left && px - ox < r.right && py - oy >= r.top && py - oy < r.bottom) hit = f;
      });
      if (!hit) break;
      var r2 = hit.getBoundingClientRect();
      ox += r2.left; oy += r2.top;
      w = hit.contentWindow;
    }
    return w;
  }
  // all leaf windows with their rectangles in top-window coordinates
  function leaves(top) {
    var res = [];
    (function walk(w, ox, oy) {
      var d;
      try { d = w.document; } catch (e) { return; }
      if (d.body && d.body.tagName === 'FRAMESET') {
        childFrames(d).forEach(function (f) {
          var r = f.getBoundingClientRect();
          walk(f.contentWindow, ox + r.left, oy + r.top);
        });
      } else {
        res.push({ win: w, x: ox, y: oy, w: w.innerWidth, h: w.innerHeight });
      }
    })(top, 0, 0);
    return res;
  }
  function bestLeaf(top, x, y, w, h) {
    var best = null, area = -1;
    leaves(top).forEach(function (l) {
      var ix = Math.max(0, Math.min(x + w, l.x + l.w) - Math.max(x, l.x));
      var iy = Math.max(0, Math.min(y + h, l.y + l.h) - Math.max(y, l.y));
      if (ix * iy > area) { area = ix * iy; best = l.win; }
    });
    return best || top;
  }
  function largestLeaf(top) {
    var best = top, area = -1;
    (function walk(w) {
      var d;
      try { d = w.document; } catch (e) { return; }
      if (d.body && d.body.tagName === 'FRAMESET') {
        childFrames(d).forEach(function (f) { walk(f.contentWindow); });
      } else {
        var a = w.innerWidth * w.innerHeight;
        if (a > area) { area = a; best = w; }
      }
    })(top);
    return best;
  }
  W.__compatFrameOffset = frameOffset;

  // -------------------------------------------------------------------
  // createPopup — an iframe hosted in whichever frame lies under the popup
  W.createPopup = function () {
    var owner = W;
    var popup = { isOpen: false };
    var hosts = []; // {win, frame}
    var current = null;
    // a host frame that has since loaded another page lost our iframe (the window
    // object stays the same, its document does not): forget it and build a new one
    function alive(h) {
      try { return h.frame.isConnected && h.frame.ownerDocument === h.win.document && !!h.frame.contentDocument; }
      catch (e) { return false; }
    }
    function make(hostWin) {
      for (var i = 0; i < hosts.length; i++) {
        if (hosts[i].win !== hostWin) continue;
        if (alive(hosts[i])) return hosts[i];
        hosts.splice(i, 1);
        break;
      }
      var hd = hostWin.document;
      var frame = hd.createElement('iframe');
      frame.className = '__ie-popup';
      frame.style.cssText = 'position:fixed;display:none;z-index:2147483001;border:0;background:#fff;margin:0;padding:0;';
      (hd.body || hd.documentElement).appendChild(frame);
      var d = frame.contentDocument;
      d.open();
      d.write('<!DOCTYPE html><html><head><meta charset="utf-8"><base href="' + owner.document.baseURI.replace(/"/g, '&quot;') +
        '"><link rel="stylesheet" href="' + RUNTIME + 'legacy.css">' +
        // as in IE, the popup's body fills the popup (its border on the popup edges) and scrolls inside
        '<style>html{height:100%;overflow:hidden}body{height:100%;box-sizing:border-box;overflow:auto}</style>' +
        '</head><body style="margin:0"></body></html>');
      d.close();
      try {
        var src = syncGet(RUNTIME + 'compat.js');
        if (src) frame.contentWindow.eval(src);
      } catch (e) { console.warn('popup shim', e); }
      try { frame.contentWindow.parent = owner; } catch (e) {}
      try {
        var pw = frame.contentWindow;
        var desc = Object.getOwnPropertyDescriptor(pw, 'event') || Object.getOwnPropertyDescriptor(Object.getPrototypeOf(pw), 'event');
        Object.defineProperty(pw, 'event', {
          configurable: true,
          get: function () { var e = desc && desc.get ? desc.get.call(pw) : undefined; return e || owner.event; }
        });
      } catch (e) {}
      var h = { win: hostWin, frame: frame };
      hosts.push(h);
      hd.addEventListener('mousedown', function (e) { if (popup.isOpen && current === h) popup.hide(); }, true);
      return h;
    }
    function transfer(from, to) {
      if (!from || from === to || !alive(from)) return;
      var a = from.frame.contentDocument, b = to.frame.contentDocument;
      Array.prototype.forEach.call(a.querySelectorAll('head link[rel=stylesheet], head style'), function (n) {
        b.head.appendChild(b.importNode(n, true));
      });
      b.body.innerHTML = a.body.innerHTML;
      b.body.style.cssText = a.body.style.cssText;
      b.body.className = a.body.className;
      ['onclick', 'onmouseover', 'onmouseout', 'onmousedown', 'onmouseup', 'ondblclick', 'onkeydown'].forEach(function (ev) {
        b.body[ev] = a.body[ev];
      });
    }
    current = make(owner);
    Object.defineProperty(popup, 'document', { get: function () {
      if (!alive(current)) current = make(owner);
      return current.frame.contentDocument;
    } });
    popup.show = function (x, y, w, h, el) {
      var bx = 0, by = 0;
      if (el && el.getBoundingClientRect) {
        var r = el.getBoundingClientRect(); bx = r.left; by = r.top;
      } else {
        bx = -(owner.screenX || 0); by = -(owner.screenY || 0);
      }
      var off = frameOffset(owner);
      var gx = off.x + bx + x, gy = off.y + by + y;           // top-window coordinates
      var host = bestLeaf(off.top, gx, gy, w, h);
      if (!alive(current)) current = make(owner);
      var next = make(host);
      transfer(current, next);
      if (next !== current) current.frame.style.display = 'none';
      current = next;
      var hoff = frameOffset(host);
      var vw = host.document.documentElement.clientWidth, vh = host.document.documentElement.clientHeight;
      var left = gx - hoff.x, top = gy - hoff.y;
      left = Math.max(0, Math.min(left, vw - w));
      if (top + h > vh) top = Math.max(0, vh - h);
      var f = current.frame;
      f.style.left = left + 'px'; f.style.top = top + 'px';
      f.style.width = w + 'px'; f.style.height = h + 'px';
      f.style.display = 'block';
      popup.isOpen = true;
    };
    popup.hide = function () {
      hosts.forEach(function (h) { try { h.frame.style.display = 'none'; } catch (e) {} });
      popup.isOpen = false;
    };
    owner.document.addEventListener('mousedown', function () { if (popup.isOpen) popup.hide(); }, true);
    return popup;
  };

  // -------------------------------------------------------------------
  // Misc IE DOM
  function attachEvent(type, fn) {
    if (!fn) return false;
    var self = this;
    fn.__ieWrap = fn.__ieWrap || function (e) { return fn.call(self, e); };
    this.addEventListener(String(type).replace(/^on/, ''), fn.__ieWrap, false);
    return true;
  }
  function detachEvent(type, fn) {
    if (fn && fn.__ieWrap) this.removeEventListener(String(type).replace(/^on/, ''), fn.__ieWrap, false);
  }
  [W.Element && Element.prototype, W.Document && Document.prototype, W].forEach(function (o) {
    if (!o) return;
    if (!o.attachEvent) { o.attachEvent = attachEvent; o.detachEvent = detachEvent; }
  });
  def(Element.prototype, 'fireEvent', {
    value: function (type) {
      var name = String(type).replace(/^on/, '');
      var ev = /click|mouse/.test(name) ? new MouseEvent(name, { bubbles: true, cancelable: true }) : new Event(name, { bubbles: true, cancelable: true });
      return this.dispatchEvent(ev);
    }, writable: true
  });
  def(Element.prototype, 'currentStyle', { get: function () { return getComputedStyle(this); } });
  def(Element.prototype, 'runtimeStyle', { get: function () { return this.style; } });
  def(Element.prototype, 'getStyle', { value: function () { return this.style; }, writable: true });
  // IE: element.document is the element's own document (e.g. the repair tabs' onclick
  // "switchTag(this.document, ...)"). Frame elements override this below with their content.
  def(Element.prototype, 'document', { get: function () { return this.ownerDocument; } });
  // Adobe SVG Viewer DOM extensions, also on this page's own prototypes: some
  // browsers (WebKit) wrap nodes of an embedded SVG that page scripts reach
  // first with the page's built-ins, not the SVG's (where svgcompat.js adds them)
  (function () {
    var SVGNS = 'http://www.w3.org/2000/svg';
    ['parentNode', 'firstChild', 'lastChild', 'nextSibling', 'previousSibling', 'childNodes', 'nodeName', 'nodeValue',
     'nodeType', 'ownerDocument', 'attributes', 'data', 'length', 'documentElement', 'localName', 'namespaceURI',
     'currentTranslate', 'currentScale', 'target', 'tagName'].forEach(function (p) {
      var g = 'get' + p.charAt(0).toUpperCase() + p.slice(1);
      [Node.prototype, NodeList.prototype, Event.prototype, Document.prototype].forEach(function (proto) {
        if (!(g in proto)) def(proto, g, { value: function () { return this[p]; }, writable: true });
      });
    });
    if (!Node.prototype.setNodeValue) def(Node.prototype, 'setNodeValue', { value: function (x) { this.nodeValue = x; }, writable: true });
    [NodeList, HTMLCollection, W.NamedNodeMap].forEach(function (C) {
      if (C && !C.prototype.getLength) def(C.prototype, 'getLength', { value: function () { return this.length; }, writable: true });
    });
    if (W.MouseEvent && !MouseEvent.prototype.getClientX) {
      def(MouseEvent.prototype, 'getClientX', { value: function () { return this.clientX; }, writable: true });
      def(MouseEvent.prototype, 'getClientY', { value: function () { return this.clientY; }, writable: true });
      def(MouseEvent.prototype, 'getButton', { value: function () { return this.button; }, writable: true });
    }
    // missing attribute: "" (DOM Level 2 / Adobe) for SVG elements only; HTML keeps null
    var ga = Element.prototype.getAttribute, gans = Element.prototype.getAttributeNS;
    def(Element.prototype, 'getAttribute', { force: true, writable: true, value: function (n) {
      var r = ga.call(this, n); return r === null && this.namespaceURI === SVGNS ? '' : r; } });
    def(Element.prototype, 'getAttributeNS', { force: true, writable: true, value: function (ns, n) {
      var r = gans.call(this, ns, n); return r === null && this.namespaceURI === SVGNS ? '' : r; } });
    var ce = Document.prototype.createElement;
    def(Document.prototype, 'createElement', { force: true, writable: true, value: function (n) {
      var root = this.documentElement;
      if (!(this instanceof HTMLDocument) && root && root.namespaceURI === SVGNS) return this.createElementNS(SVGNS, n);
      return ce.apply(this, arguments);
    } });
  })();
  // IE collections could be called like functions: coll(i) == coll.item(i)
  function callable(coll) {
    return new Proxy(function () {}, {
      apply: function (t, self, args) { return typeof args[0] === 'string' && isNaN(args[0]) ? coll.namedItem(args[0]) : coll.item(args[0]); },
      get: function (t, p) { var v = coll[p]; return typeof v === 'function' ? v.bind(coll) : v; },
      has: function (t, p) { return p in coll; }
    });
  }
  W.__callableCollection = callable;
  def(Element.prototype, 'all', { get: function () {
    var el = this, c = this.getElementsByTagName('*');
    try { c.tags = function (t) { return callable(el.getElementsByTagName(t)); }; } catch (e) {}
    return c;
  } });
  def(Document.prototype, 'frames', { get: function () { return this.defaultView ? this.defaultView.frames : W.frames; } });
  def(Document.prototype, 'createStyleSheet', {
    value: function (href) {
      var d = this, el;
      if (href) {
        el = d.createElement('link'); el.rel = 'stylesheet'; el.href = href;
      } else {
        el = d.createElement('style');
      }
      (d.head || d.documentElement).appendChild(el);
      var api = {
        owningElement: el,
        addRule: function (sel, decl) { try { el.sheet.insertRule(sel + '{' + decl + '}', el.sheet.cssRules.length); } catch (e) {} }
      };
      Object.defineProperty(api, 'cssText', {
        get: function () { return el.textContent; }, set: function (v) { el.textContent = v; }
      });
      return api;
    }, writable: true
  });
  def(Document.prototype, 'parentWindow', { get: function () { return this.defaultView; } });
  if (W.HTMLAllCollection) {
    def(HTMLAllCollection.prototype, 'tags', {
      value: function (t) {
        var d = this.length ? this[0].ownerDocument : document;
        return callable(d.getElementsByTagName(t));
      }, writable: true
    });
  }
  // getSVGDocument() on <embed>, on a named embed (which resolves to its window), or on a list
  // Adobe SVG Viewer 3 extensions, installed into an SVG document's own realm
  function patchSvgRealm(doc) {
    var v = doc && doc.defaultView;
    if (!v || v.__asvCompat) return doc;
    try { var src = syncGet(RUNTIME + 'svgcompat.js'); if (src) v.eval(src); } catch (e) {}
    return doc;
  }
  W.__patchSvgRealm = patchSvgRealm;
  W.__svgDoc = function (o) {
    if (!o) return null;
    if (o.length && !o.document && o[0]) o = o[0];
    var d = null;
    try { if (o.getSVGDocument) d = o.getSVGDocument(); } catch (e) {}
    try { if (!d && o.contentDocument) d = o.contentDocument; } catch (e) {}
    try { if (!d && o.document) d = o.document; } catch (e) {}
    return d ? patchSvgRealm(d) : null;
  };
  // IE let scripts treat a <frame>/<iframe> element like its window
  [W.HTMLFrameElement, W.HTMLIFrameElement].forEach(function (C) {
    if (!C) return;
    def(C.prototype, 'window', { get: function () {
      var w = this.contentWindow, base = this.ownerDocument.baseURI;
      try { w.navigate = function (u) { w.location.href = absUrl(String(u), base); }; } catch (e) {}
      return w;
    } });
    def(C.prototype, 'document', { get: function () { return this.contentDocument; } });
    def(C.prototype, 'navigate', { value: function (u) { this.src = absUrl(String(u), this.ownerDocument.baseURI); }, writable: true });
    def(C.prototype, 'location', { get: function () { return this.contentWindow ? this.contentWindow.location : null; },
                                   set: function (u) { this.src = u; } });
  });
  def(Error.prototype, 'description', { get: function () { return this.message; } });
  if (!W.navigate) W.navigate = function (u) { W.location.href = u; };
  // WebKit (Safari) reloads an <embed> whenever its width/height attribute is set,
  // even to the same value. The wiring-diagram viewer sizes its drawing that way on
  // every load, so in Safari the drawing reloaded endlessly (~40 times a second) and
  // clicks reached documents that were already gone. For SVG embeds, apply sizes
  // with CSS instead (the attribute value is remembered for getAttribute).
  if (W.HTMLEmbedElement) {
    var EmP = HTMLEmbedElement.prototype, esa = Element.prototype.setAttribute;
    var isSvgEmbed = function (el) {
      return /svg/i.test(el.type || '') || /\.svgz?(\?|#|$)/i.test(el.getAttribute('src') || '');
    };
    var cssLen = function (v) { v = String(v).trim(); return /^-?\d+(\.\d+)?$/.test(v) ? v + 'px' : v; };
    def(EmP, 'setAttribute', { force: true, writable: true, value: function (n, v) {
      var k = String(n).toLowerCase();
      if ((k === 'width' || k === 'height') && isSvgEmbed(this)) {
        (this.__ieSize || (this.__ieSize = {}))[k] = String(v);
        this.style[k] = cssLen(v);
        return;
      }
      return esa.call(this, n, v);
    } });
    def(EmP, 'getAttribute', { force: true, writable: true, value: function (n) {
      var k = String(n).toLowerCase();
      if (this.__ieSize && this.__ieSize[k] != null) return this.__ieSize[k];
      return Element.prototype.getAttribute.call(this, n);
    } });
    ['width', 'height'].forEach(function (k) {
      var d = Object.getOwnPropertyDescriptor(EmP, k);
      if (!d || !d.set) return;
      Object.defineProperty(EmP, k, { configurable: true, enumerable: d.enumerable,
        get: function () { return this.__ieSize && this.__ieSize[k] != null ? this.__ieSize[k] : d.get.call(this); },
        set: function (v) { if (isSvgEmbed(this)) this.setAttribute(k, v); else d.set.call(this, v); } });
    });
  }
  if (W.HTMLEmbedElement && !HTMLEmbedElement.prototype.getSVGDocument) {
    HTMLEmbedElement.prototype.getSVGDocument = function () { return this.contentDocument || null; };
  }
  if (W.HTMLObjectElement && !HTMLObjectElement.prototype.getSVGDocument) {
    HTMLObjectElement.prototype.getSVGDocument = function () { return this.contentDocument || null; };
  }
  // event.srcElement etc. exist in all current engines; keep a fallback
  if (W.Event && !('srcElement' in Event.prototype)) def(Event.prototype, 'srcElement', { get: function () { return this.target; } });
  if (W.Event && !('fromElement' in Event.prototype)) {
    def(Event.prototype, 'fromElement', { get: function () { return this.type === 'mouseover' ? this.relatedTarget : this.target; } });
    def(Event.prototype, 'toElement', { get: function () { return this.type === 'mouseout' ? this.relatedTarget : this.target; } });
  }
  if (!W.clipboardData) {
    W.clipboardData = {
      setData: function (t, v) { try { navigator.clipboard.writeText(v); } catch (e) {} return true; },
      getData: function () { return ''; }
    };
  }
  if (!document.selection) {
    try { def(Document.prototype, 'selection', { get: function () { var s = this.getSelection(); return { empty: function () { s.removeAllRanges(); }, createRange: function () { return { text: String(s) }; }, type: s.type }; } }); } catch (e) {}
  }

  // IE XML data islands: <xml id="x" src="doc.xml"/> exposes x.XMLDocument, x.transformNode ...
  function initIsland(el) {
    if (el.XMLDocument) return el.XMLDocument;
    var d = newXmlDoc();
    var src = el.getAttribute('src');
    if (src) d.load(absUrl(src, el.ownerDocument.baseURI)); else d.loadXML(el.innerHTML);
    Object.defineProperty(el, 'XMLDocument', { value: d, configurable: true });
    Object.defineProperty(el, 'documentElement', { get: function () { return d.documentElement; }, configurable: true });
    ['transformNode', 'selectNodes', 'selectSingleNode', 'getElementsByTagName'].forEach(function (m) {
      el[m] = function () { return d[m].apply(d, arguments); };
    });
    return d;
  }
  function initIslands() {
    var xs = document.getElementsByTagName('xml');
    for (var i = 0; i < xs.length; i++) try { initIsland(xs[i]); } catch (e) { console.warn('xml island', e); }
  }
  document.addEventListener('DOMContentLoaded', initIslands);
  W.__compatInitIslands = initIslands;

  // Legacy browser checks in the manual's own scripts look for "MSIE"
  W.__isModernCompat = true;

  // Printing a frame. The print dialogs (e.g. Removal/Installation > Print > Execute Print)
  // call print() on a frame nested inside the page. Safari ignores that, and the Mac app
  // (also WebKit) could only print its whole window. In WebKit, copy the frame's content
  // into a temporary top-level window, print that, and close it again.
  (function () {
    if (W === W.top) return;
    var ua = navigator.userAgent;
    if (!/AppleWebKit/.test(ua) || /Chrome|Chromium|CriOS|Edg|OPR|FxiOS|Android/.test(ua)) return;
    var esc = function (s) { return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;'); };
    W.print = function () {
      var d = W.document, pw = null;
      try { pw = W.open('', '_blank', 'width=820,height=900'); } catch (e) {}
      if (!pw) return;
      var head = Array.prototype.map.call(d.querySelectorAll('link[rel~="stylesheet"], style'),
        function (n) { return n.outerHTML; }).join('\n');
      var body = d.body ? d.body.cloneNode(true) : d.createElement('body');
      Array.prototype.forEach.call(body.querySelectorAll('script'), function (s) { s.remove(); });
      [body].concat(Array.prototype.slice.call(body.querySelectorAll('*'))).forEach(function (el) {
        Array.prototype.slice.call(el.attributes).forEach(function (a) { if (/^on/i.test(a.name)) el.removeAttribute(a.name); });
      });
      pw.document.open();
      pw.document.write('<!DOCTYPE html><html><head><meta charset="utf-8"><base href="' + esc(d.baseURI) + '">' +
        '<title>' + esc(d.title || 'Print') + '</title>' + head + '</head>' + body.outerHTML + '</html>');
      pw.document.close();
      var started = false;
      var go = function () {
        if (started) return;
        started = true;
        pw.__printCopy = true;          // the Mac app closes this window once printing is done
        pw.addEventListener('afterprint', function () { setTimeout(function () { try { pw.close(); } catch (e) {} }, 100); });
        pw.focus();
        pw.print();
      };
      if (pw.document.readyState === 'complete') setTimeout(go, 50);
      else pw.addEventListener('load', go);
      setTimeout(go, 3000);             // print anyway if an image never finishes loading
    };
  })();
})();
