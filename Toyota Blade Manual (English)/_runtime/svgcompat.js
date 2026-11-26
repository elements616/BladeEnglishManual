/* svgcompat.js — Adobe SVG Viewer 3 scripting extensions for native browser SVG. */
(function (v) {
  if (v.__asvCompat) return;
  v.__asvCompat = true;
  var doc = v.document;
  var EP = v.Element.prototype;
  if (!EP.getStyle) EP.getStyle = function () { return this.style; };
  // Adobe SVG Viewer (like DOM Level 2) returned "" for a missing attribute; browsers return null
  var nativeGetAttribute = EP.getAttribute, nativeGetAttributeNS = EP.getAttributeNS;
  EP.getAttribute = function (n) { var r = nativeGetAttribute.call(this, n); return r === null ? '' : r; };
  EP.getAttributeNS = function (ns, n) { var r = nativeGetAttributeNS.call(this, ns, n); return r === null ? '' : r; };
  // Adobe's createElement() in an SVG document made SVG elements (e.g. the <set>
  // animations that make selected wires blink); natively it makes inert XML ones
  var DP = v.Document.prototype, nativeCreate = DP.createElement;
  DP.createElement = function (n) {
    var root = this.documentElement;
    if (!(this instanceof v.HTMLDocument) && root && root.namespaceURI === 'http://www.w3.org/2000/svg')
      return this.createElementNS('http://www.w3.org/2000/svg', n);
    return nativeCreate.apply(this, arguments);
  };
  // EWD wires / parts are <a xlink:href=""> used only as click targets. Adobe's
  // plug-in ignored an empty link; a browser follows it and reloads the drawing,
  // wiping the selection the mousedown handler just made.
  doc.addEventListener('click', function (e) {
    for (var n = e.target; n && n.nodeType === 1; n = n.parentNode) {
      if (n.localName === 'a') {
        var h = n.getAttributeNS('http://www.w3.org/1999/xlink', 'href') || n.getAttribute('href') || '';
        if (!h.trim() || h.trim() === '#') e.preventDefault();
        return;
      }
    }
  }, true);
  // WebKit reloads an <embed> whenever its width/height attribute is set; the EWD
  // viewer's own svgfig.js (running here) resizes the <embed> that shows this drawing,
  // and WebKit hands it that element with this window's prototypes. Size SVG embeds
  // with CSS instead (same as compat.js does for the host page).
  if (v.HTMLEmbedElement && !v.HTMLEmbedElement.prototype.__asvSized) {
    var EmP = v.HTMLEmbedElement.prototype, esa = v.Element.prototype.setAttribute;
    EmP.__asvSized = true;
    var isSvgEmbed = function (el) {
      return /svg/i.test(el.type || '') || /\.svgz?(\?|#|$)/i.test(esa && el.hasAttribute('src') ? (nativeGetAttribute.call(el, 'src') || '') : '');
    };
    var cssLen = function (x) { x = String(x).trim(); return /^-?\d+(\.\d+)?$/.test(x) ? x + 'px' : x; };
    EmP.setAttribute = function (n, val) {
      var k = String(n).toLowerCase();
      if ((k === 'width' || k === 'height') && isSvgEmbed(this)) {
        (this.__ieSize || (this.__ieSize = {}))[k] = String(val);
        this.style[k] = cssLen(val);
        return;
      }
      return esa.call(this, n, val);
    };
    EmP.getAttribute = function (n) {
      var k = String(n).toLowerCase();
      if (this.__ieSize && this.__ieSize[k] != null) return this.__ieSize[k];
      return v.Element.prototype.getAttribute.call(this, n);
    };
  }
  // Adobe SVG Viewer scaled a drawing that has a viewBox to fill its <embed>;
  // native SVG would draw it at its width/height attributes and crop it.
  try {
    var fe = v.frameElement, root = doc.documentElement;
    if (fe && /^(EMBED|OBJECT)$/i.test(fe.tagName) && root && root.hasAttribute('viewBox')) {
      root.style.width = '100%';
      root.style.height = '100%';
    }
  } catch (e) {}
  var EvP = v.Event.prototype;
  if (!EvP.getTarget) EvP.getTarget = function () { return this.target; };
  if (!EvP.getCurrentTarget) EvP.getCurrentTarget = function () { return this.currentTarget; };
  if (!v.MouseEvent.prototype.getClientX) {
    v.MouseEvent.prototype.getClientX = function () { return this.clientX; };
    v.MouseEvent.prototype.getClientY = function () { return this.clientY; };
    v.MouseEvent.prototype.getButton = function () { return this.button; };
  }
  if (!v.KeyboardEvent.prototype.getCharCode) v.KeyboardEvent.prototype.getCharCode = function () { return this.charCode || this.keyCode; };
  if (!v.printNode) v.printNode = function (n) { return new XMLSerializer().serializeToString(n); };
  if (!v.parseXML) v.parseXML = function (str, d) {
    var x = new DOMParser().parseFromString(str, 'image/svg+xml');
    var f = (d || doc).createDocumentFragment();
    f.appendChild((d || doc).importNode(x.documentElement, true));
    return f;
  };
  if (!v.getURL) v.getURL = function (url, cb) {
    fetch(new URL(url, doc.URL)).then(function (r) {
      return r.text().then(function (t) { return { success: r.ok, content: t, contentType: r.headers.get('content-type') }; });
    }).then(function (o) { if (typeof cb === 'function') cb(o); else if (cb && cb.operationComplete) cb.operationComplete(o); });
  };
  if (!v.browserEval) v.browserEval = function (code) { return v.parent.eval(code); };
  if (!v.svgDocument) v.svgDocument = doc;

  // Java-style getters exposed by the Adobe SVG Viewer DOM
  ['parentNode', 'firstChild', 'lastChild', 'nextSibling', 'previousSibling', 'childNodes', 'nodeName', 'nodeValue',
   'nodeType', 'ownerDocument', 'attributes', 'data', 'length', 'documentElement', 'localName', 'namespaceURI',
   'currentTranslate', 'currentScale', 'target', 'tagName'].forEach(function (p) {
    var g = 'get' + p.charAt(0).toUpperCase() + p.slice(1);
    [v.Node.prototype, v.NodeList.prototype, v.Event.prototype, v.Document.prototype].forEach(function (proto) {
      if (!(g in proto)) Object.defineProperty(proto, g, { configurable: true, writable: true, value: function () { return this[p]; } });
    });
  });
  if (!v.Node.prototype.setNodeValue) v.Node.prototype.setNodeValue = function (x) { this.nodeValue = x; };
  if (!v.Node.prototype.getFirstChild) v.Node.prototype.getFirstChild = function () { return this.firstChild; };
  [v.NodeList, v.HTMLCollection, v.NamedNodeMap].forEach(function (C) {
    if (!C) return;
    if (!C.prototype.getLength) C.prototype.getLength = function () { return this.length; };
  });

  // With Adobe's plug-in, handlers such as onclick="selectItem(evt)" ran in the
  // host page's script context. Forward any handler function the SVG itself
  // does not define to the page that embeds it.
  function host() {
    try { return v.frameElement ? v.frameElement.ownerDocument.defaultView : v.parent; } catch (e) { return null; }
  }
  function forward() {
    var names = {};
    var all = doc.getElementsByTagName('*');
    for (var i = 0; i < all.length; i++) {
      var at = all[i].attributes;
      for (var j = 0; j < at.length; j++) {
        if (/^on/i.test(at[j].name)) {
          at[j].value.replace(/([A-Za-z_$][\w$]*)\s*\(/g, function (m, n) { names[n] = 1; });
        }
      }
    }
    Object.keys(names).forEach(function (n) {
      if (typeof v[n] === 'function') return;
      v[n] = function () {
        var h = host();
        if (h && typeof h[n] === 'function') return h[n].apply(h, arguments);
      };
    });
  }
  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', forward); else forward();

  // Adobe's plug-in also let the SVG's own scripts use any global of the host
  // page (e.g. sendOnloadMsg). Mirror the host's own globals onto this window.
  function mirror() {
    var h = host();
    if (!h || h === v) return;
    var names;
    try { names = Object.keys(h); } catch (e) { return; }
    names.forEach(function (n) {
      if (n in v || /^(on|webkit)/.test(n)) return;
      var val;
      try { val = h[n]; } catch (e) { return; }
      try {
        if (typeof val === 'function') {
          v[n] = function () { return h[n].apply(h, arguments); };
        } else {
          Object.defineProperty(v, n, { configurable: true,
            get: function () { return h[n]; }, set: function (x) { h[n] = x; } });
        }
      } catch (e) {}
    });
  }
  mirror();
  doc.addEventListener('DOMContentLoaded', mirror);
})(window);
