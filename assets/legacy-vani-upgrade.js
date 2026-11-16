/* Shared upgrade link for legacy pages with independently maintained headers. */
(function () {
  'use strict';
  if (/^\/studio(?:\/|$)/.test(window.location.pathname)) return;
  var id = 'vani-legacy-upgrade';
  if (window.__vaniLegacyUpgradeLoaded) return;
  window.__vaniLegacyUpgradeLoaded = true;

  function inject() {
    if (document.getElementById(id)) return;
    // Prefer the actual site header; React article headers are hero sections.
    var host = document.querySelector('header.static-header, header.site-head');
    if (!host) {
      host = document.querySelector('nav.sticky.z-40, nav.sticky.z-50');
    }
    if (!host) host = document.querySelector('header');
    if (!host) return;

    var row = document.createElement('div');
    row.id = id;
    row.setAttribute('aria-label', 'Latest Vani voice studio');
    var link = document.createElement('a');
    link.href = '/studio/hindi/';
    link.textContent = 'Try Vani 2.0';
    link.title = 'Try our latest text to voice engine — Hindi Voice Studio';
    row.appendChild(link);
    host.classList.add('vani-upgrade-host');
    host.insertBefore(row, host.firstChild);
  }

  function start() {
    var style = document.createElement('style');
    style.textContent =
      '.vani-upgrade-host{height:auto!important;flex-wrap:wrap!important}' +
      '#'+id+'{box-sizing:border-box;display:flex;justify-content:flex-end;align-items:center;flex:0 0 100%;width:100%;padding:8px 16px;position:relative;z-index:1}' +
      '#'+id+' a{box-sizing:border-box;display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:10px 20px;border:1px solid #4338ca;border-radius:999px;background:linear-gradient(120deg,#4338ca,#7c3aed);color:#fff!important;font:700 14px/1.3 system-ui,sans-serif;letter-spacing:normal;text-transform:none;text-decoration:none!important;white-space:nowrap;box-shadow:0 3px 10px #4338ca26}' +
      '#'+id+' a:hover{background:#3730a3;box-shadow:0 4px 14px #4338ca40}' +
      '#'+id+' a:focus-visible{outline:3px solid #f59e0b;outline-offset:3px}' +
      '@media(max-width:640px){#'+id+'{justify-content:center;padding:8px}}';
    document.head.appendChild(style);
    inject();
    // Some legacy pages mount or replace their navigation asynchronously in React.
    var scheduled = false;
    new MutationObserver(function () {
      if (document.getElementById(id) || scheduled) return;
      scheduled = true;
      window.requestAnimationFrame(function () { scheduled = false; inject(); });
    }).observe(document.body, {childList: true, subtree: true});
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, {once:true});
  else start();
}());
