/* Furneview wishlist: hearts saved in this browser (localStorage) */
(function () {
  var KEY = 'fv-wish';
  function read() { try { var v = JSON.parse(localStorage.getItem(KEY) || '[]'); return Array.isArray(v) ? v : []; } catch (e) { return []; } }
  function write(a) { try { localStorage.setItem(KEY, JSON.stringify(a)); } catch (e) {} }
  function paint() {
    var list = read();
    document.querySelectorAll('[data-wish]').forEach(function (b) {
      var on = list.indexOf(b.dataset.wish) > -1;
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
      b.classList.toggle('is-on', on);
    });
    document.querySelectorAll('[data-wish-count]').forEach(function (c) {
      c.textContent = list.length; c.hidden = list.length === 0;
    });
  }
  var toastT;
  function toast(msg) {
    var t = document.getElementById('fv-wish-toast');
    if (!t) { t = document.createElement('div'); t.id = 'fv-wish-toast'; t.setAttribute('role', 'status'); document.body.appendChild(t); }
    t.innerHTML = msg; t.classList.add('is-on'); clearTimeout(toastT);
    toastT = setTimeout(function () { t.classList.remove('is-on'); }, 2600);
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-wish]'); if (!b) return;
    e.preventDefault(); e.stopPropagation();
    var list = read(), h = b.dataset.wish, i = list.indexOf(h);
    if (i > -1) { list.splice(i, 1); toast('Removed from wishlist'); }
    else { list.unshift(h); toast('Saved to wishlist <a href="/pages/wishlist">View</a>'); b.classList.remove('is-pop'); void b.offsetWidth; b.classList.add('is-pop'); }
    write(list); paint();
    document.dispatchEvent(new CustomEvent('fv:wish', { detail: list }));
  }, true);
  window.FVWish = { read: read, write: write, paint: paint };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', paint); else paint();
  window.addEventListener('storage', function (e) { if (e.key === KEY) paint(); });
})();
