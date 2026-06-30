var _prevScreen = 'screen-home';

function goTo(id) {
  var prev = document.querySelector('.screen.active');
  if (prev) _prevScreen = prev.id;
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  var el = document.getElementById(id);
  el.classList.add('active');
  var sb = el.querySelector('.scroll-body');
  if (sb) sb.scrollTop = 0;
  if (id === 'screen-agenda') renderCalendar();
}

function history_back() {
  goTo(_prevScreen);
}

function toggleFilter(el) {
  el.closest('.filter-row')
    .querySelectorAll('.filter-chip')
    .forEach(c => c.classList.remove('active'));
  el.classList.add('active');
}

function toggleSwitch(el) {
  el.classList.toggle('on');
}

function renderCalendar() {
  var container = document.getElementById('agenda-cal');
  if (!container) return;

  var year = 2026, month = 5;
  var monthNames = ['JANEIRO','FEVEREIRO','MARÇO','ABRIL','MAIO','JUNHO','JULHO','AGOSTO','SETEMBRO','OUTUBRO','NOVEMBRO','DEZEMBRO'];
  var dayNames = ['D','S','T','Q','Q','S','S'];
  var today = 30;
  var eventDays = [26, 27, 30];

  var firstDay = new Date(year, month, 1).getDay();
  var daysInMonth = new Date(year, month + 1, 0).getDate();

  var html = '<div class="cal-month-label">' + monthNames[month] + ' ' + year + '</div>';
  html += '<div class="cal-header-row">';
  dayNames.forEach(function(d) { html += '<div class="cal-day-header">' + d + '</div>'; });
  html += '</div><div class="cal-grid">';

  for (var i = 0; i < firstDay; i++) {
    html += '<div class="cal-day empty"></div>';
  }

  for (var d = 1; d <= daysInMonth; d++) {
    var cls = 'cal-day';
    if (d === today) cls += ' today';
    if (eventDays.indexOf(d) !== -1) cls += ' has-event';
    html += '<div class="' + cls + '">' + d + '</div>';
  }

  html += '</div>';
  container.innerHTML = html;
}
