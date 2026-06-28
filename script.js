var _prevScreen = 'screen-home';

function goTo(id) {
  var prev = document.querySelector('.screen.active');
  if (prev) _prevScreen = prev.id;
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  var el = document.getElementById(id);
  el.classList.add('active');
  var sb = el.querySelector('.scroll-body');
  if (sb) sb.scrollTop = 0;
}

function history_back() { goTo(_prevScreen); }

function toggleFilter(el) {
  el.closest('.filter-row').querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
}