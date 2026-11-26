/* flash.js — plays the manual's Flash animations with Ruffle (WebAssembly). */
(function () {
  var s = document.currentScript;
  var base = s ? s.src.replace(/[^\/]*$/, '') : '';
  window.RufflePlayer = window.RufflePlayer || {};
  window.RufflePlayer.config = {
    publicPath: base + 'ruffle/',
    polyfills: true,
    autoplay: 'on',
    unmuteOverlay: 'hidden',
    splashScreen: false,
    letterbox: 'on',
    warnOnUnsupportedContent: false,
    showSwfDownload: false,
    contextMenu: 'rightClickOnly',
    allowScriptAccess: true,
    logLevel: 'error',
    openUrlMode: 'allow',
    allowNetworking: 'all',
    preloader: false,
    menu: false
  };
  document.write('<script src="' + base + 'ruffle/ruffle.js"><\/script>');
})();

/* Flash called the page through FSCommand -> <movie>_DoFSCommand(cmd, args)
   (IE routed it via VBScript). Ruffle exposes the same through onFSCommand. */
(function () {
  function hook(el) {
    if (el.__fsHooked) return;
    el.__fsHooked = true;
    el.onFSCommand = function (cmd, args) {
      var ids = [el.id, el.getAttribute && el.getAttribute('name')];
      var orig = el.__origId;
      if (orig) ids.push(orig);
      for (var i = 0; i < ids.length; i++) {
        var fn = ids[i] && window[ids[i] + '_DoFSCommand'];
        if (typeof fn === 'function') { fn(cmd, args); return true; }
      }
      return false;
    };
  }
  function scan() {
    var els = document.querySelectorAll('ruffle-object, ruffle-embed, ruffle-player');
    for (var i = 0; i < els.length; i++) hook(els[i]);
  }
  document.addEventListener('DOMContentLoaded', function () {
    scan();
    new MutationObserver(scan).observe(document.documentElement, { childList: true, subtree: true });
  });
})();
