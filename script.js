var _prevScreen = 'screen-home';

var pagamentos = [
  { cliente: 'Carlos Mendonça', servico: 'Instalação de quadro elétrico', valor: 580.00,  status: 'pendente', forma: 'PIX',      data: '2026-06-26' },
  { cliente: 'Roberto Alves',   servico: 'Rede elétrica – galpão',        valor: 1320.00, status: 'atrasado', forma: 'BOLETO',   data: '2026-06-10' },
  { cliente: 'Maria Aparecida', servico: 'Revisão geral – 3 cômodos',     valor: 270.00,  status: 'pago',     forma: 'PIX',      data: '2026-06-20' },
  { cliente: 'Fernanda Rocha',  servico: 'Instalação de tomadas – escritório', valor: 390.00, status: 'aprovado', forma: 'CARTÃO', data: '2026-06-28' }
];

var _btnPag = { pendente: 'cobrar', atrasado: 'aviso', pago: '', aprovado: 'cobrar' };
var _lblPag = { pendente: 'COBRAR AGORA', atrasado: 'ENVIAR AVISO', pago: 'VER RECIBO', aprovado: 'COBRAR AGORA' };

function renderPagamentos() {
  var list = document.getElementById('pay-list');
  if (!list) return;
  var activeChip = document.querySelector('#screen-pagamentos .filter-chip.active');
  var filtro = activeChip ? activeChip.textContent : 'TODOS';

  var items = pagamentos.filter(function(p) {
    if (filtro === 'TODOS') return true;
    if (filtro === 'ESTE MÊS') return p.data.startsWith('2026-06');
    return p.status === filtro.toLowerCase();
  });

  if (items.length === 0) {
    list.innerHTML = '<div style="text-align:center;color:#888;padding:24px;font-size:13px;">Nenhum pagamento encontrado.</div>';
    return;
  }

  list.innerHTML = items.map(function(p) {
    var valor = 'R$ ' + p.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
    var btnCls = 'pay-action-btn' + (_btnPag[p.status] ? ' ' + _btnPag[p.status] : '');
    return '<div class="pay-item-card">'
      + '<div class="pay-item-top"><span class="pay-item-name">' + p.cliente + '</span>'
      + '<span class="status-badge ' + p.status + '">' + p.status.toUpperCase() + '</span></div>'
      + '<div class="pay-item-servico">' + p.servico + '</div>'
      + '<div class="pay-item-valor">' + valor + '</div>'
      + '<button class="' + btnCls + '">' + _lblPag[p.status] + '</button>'
      + '</div>';
  }).join('');
}

function filterPagamentos(el) {
  document.querySelectorAll('#screen-pagamentos .filter-chip').forEach(function(c) { c.classList.remove('active'); });
  el.classList.add('active');
  renderPagamentos();
}

function selectForma(el) {
  document.querySelectorAll('#pay-forma-row .filter-chip').forEach(function(c) { c.classList.remove('active'); });
  el.classList.add('active');
}

function selectStatusPag(el) {
  document.querySelectorAll('#pay-status-row .filter-chip').forEach(function(c) { c.classList.remove('active'); });
  el.classList.add('active');
}

function salvarPagamento() {
  var cliente = document.getElementById('pay-cliente-input').value;
  var servico = document.getElementById('pay-servico-input').value.trim();
  var valorRaw = document.getElementById('pay-valor-input').value;
  var valor = parseFloat(valorRaw);
  var data = document.getElementById('pay-data-input').value;
  var formaEl = document.querySelector('#pay-forma-row .filter-chip.active');
  var statusEl = document.querySelector('#pay-status-row .filter-chip.active');
  var erro = document.getElementById('pay-erro');

  if (!cliente) { erro.textContent = 'Selecione um cliente.'; erro.style.display = 'block'; return; }
  if (!servico) { erro.textContent = 'Informe o serviço.'; erro.style.display = 'block'; return; }
  if (!valorRaw || isNaN(valor) || valor <= 0) { erro.textContent = 'Informe um valor válido.'; erro.style.display = 'block'; return; }
  if (!data) { erro.textContent = 'Informe a data.'; erro.style.display = 'block'; return; }

  erro.style.display = 'none';
  pagamentos.unshift({
    cliente: cliente,
    servico: servico,
    valor: valor,
    status: statusEl ? statusEl.textContent.toLowerCase() : 'pago',
    forma: formaEl ? formaEl.textContent : 'PIX',
    data: data
  });

  document.getElementById('pay-cliente-input').selectedIndex = 0;
  document.getElementById('pay-servico-input').value = '';
  document.getElementById('pay-valor-input').value = '';
  document.getElementById('pay-data-input').value = '';
  document.querySelectorAll('#pay-forma-row .filter-chip').forEach(function(c) { c.classList.remove('active'); });
  document.querySelector('#pay-forma-row .filter-chip').classList.add('active');
  document.querySelectorAll('#pay-status-row .filter-chip').forEach(function(c) { c.classList.remove('active'); });
  document.querySelector('#pay-status-row .filter-chip').classList.add('active');

  goTo('screen-pagamentos');
}

var agendamentos = [
  { data: '2026-06-30', hora: '08:00', desc: 'Instalação de quadro elétrico', cliente: 'Carlos Mendonça', obs: '' },
  { data: '2026-06-30', hora: '14:00', desc: 'Vistoria pós-reforma',           cliente: 'Roberto Alves',   obs: '' },
  { data: '2026-07-01', hora: '09:30', desc: 'Revisão geral – 3 cômodos',      cliente: 'Maria Aparecida', obs: '' },
  { data: '2026-07-01', hora: '16:00', desc: 'Instalação de tomadas',           cliente: 'Fernanda Rocha',  obs: '' }
];

var _meses = ['JANEIRO','FEVEREIRO','MARÇO','ABRIL','MAIO','JUNHO','JULHO','AGOSTO','SETEMBRO','OUTUBRO','NOVEMBRO','DEZEMBRO'];
var _diasSemana = ['DOMINGO','SEGUNDA','TERÇA','QUARTA','QUINTA','SEXTA','SÁBADO'];

function _dataLabel(dataStr) {
  var hoje = new Date(); hoje.setHours(0,0,0,0);
  var amanha = new Date(hoje); amanha.setDate(amanha.getDate() + 1);
  var parts = dataStr.split('-');
  var d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
  var sufixo = d.getDate() + ' DE ' + _meses[d.getMonth()];
  if (d.getTime() === hoje.getTime())   return 'HOJE – ' + sufixo;
  if (d.getTime() === amanha.getTime()) return 'AMANHÃ – ' + sufixo;
  return _diasSemana[d.getDay()] + ' – ' + sufixo;
}

function renderAgenda() {
  var container = document.getElementById('agenda-events');
  if (!container) return;

  var sorted = agendamentos.slice().sort(function(a, b) {
    return (a.data + a.hora).localeCompare(b.data + b.hora);
  });

  var grupos = {};
  var ordem = [];
  sorted.forEach(function(a) {
    if (!grupos[a.data]) { grupos[a.data] = []; ordem.push(a.data); }
    grupos[a.data].push(a);
  });

  if (ordem.length === 0) {
    container.innerHTML = '<div style="text-align:center;color:#888;padding:24px;font-size:13px;">Nenhum agendamento.</div>';
    return;
  }

  var html = '';
  ordem.forEach(function(data) {
    html += '<div class="agenda-day-label">' + _dataLabel(data) + '</div>';
    grupos[data].forEach(function(a) {
      html += '<div class="agenda-event-row">'
        + '<div class="agenda-event-hora">' + a.hora + '</div>'
        + '<div class="agenda-event-bar"></div>'
        + '<div class="agenda-event-info">'
        + '<div class="ev-desc">' + a.desc + '</div>'
        + '<div class="ev-cli">' + a.cliente + '</div>'
        + (a.obs ? '<div class="ev-cli" style="color:#aaa;">' + a.obs + '</div>' : '')
        + '</div></div>';
    });
  });
  container.innerHTML = html;
}

function salvarAgendamento() {
  var cliente = document.getElementById('ag-cliente-input').value;
  var desc    = document.getElementById('ag-desc-input').value.trim();
  var data    = document.getElementById('ag-data-input').value;
  var hora    = document.getElementById('ag-hora-input').value;
  var obs     = document.getElementById('ag-obs-input').value.trim();
  var erro    = document.getElementById('ag-erro');

  if (!cliente) {
    erro.textContent = 'Selecione um cliente.'; erro.style.display = 'block'; return;
  }
  if (!desc) {
    erro.textContent = 'Informe a descrição do serviço.'; erro.style.display = 'block'; return;
  }
  if (!data) {
    erro.textContent = 'Informe a data.'; erro.style.display = 'block'; return;
  }
  if (!hora) {
    erro.textContent = 'Informe o horário.'; erro.style.display = 'block'; return;
  }

  erro.style.display = 'none';
  agendamentos.push({ data: data, hora: hora, desc: desc, cliente: cliente, obs: obs });

  document.getElementById('ag-cliente-input').selectedIndex = 0;
  document.getElementById('ag-desc-input').value = '';
  document.getElementById('ag-data-input').value = '';
  document.getElementById('ag-hora-input').value = '';
  document.getElementById('ag-obs-input').value = '';

  goTo('screen-agenda');
}

var materiais = [
  { nome: 'Fio 2,5mm² Flexível',    unit: 'metro',    preco: 4.90,  cat: 'FIOS' },
  { nome: 'Fio 4mm² Flexível',       unit: 'metro',    preco: 7.20,  cat: 'FIOS' },
  { nome: 'Disjuntor 20A Bipolar',   unit: 'unidade',  preco: 38.50, cat: 'DISJUNTORES' },
  { nome: 'Tomada 2P+T 10A',         unit: 'unidade',  preco: 12.80, cat: 'TOMADAS' },
  { nome: 'Interruptor Simples',     unit: 'unidade',  preco: 9.40,  cat: 'TOMADAS' },
  { nome: 'Eletroduto 3/4" Flexível',unit: 'metro',    preco: 3.15,  cat: 'FIOS' },
  { nome: 'Caixa de Passagem 4x4',   unit: 'unidade',  preco: 5.60,  cat: 'OUTROS' }
];

function renderMateriais() {
  var list = document.getElementById('mat-list');
  if (!list) return;
  var busca = (document.getElementById('mat-busca') || {}).value || '';
  var activeChip = document.querySelector('#mat-filter-row .filter-chip.active');
  var filtro = activeChip ? activeChip.textContent : 'TODOS';

  var items = materiais.filter(function(m) {
    var matchCat = filtro === 'TODOS' || m.cat === filtro;
    var matchBusca = !busca || m.nome.toLowerCase().indexOf(busca.toLowerCase()) !== -1;
    return matchCat && matchBusca;
  });

  if (items.length === 0) {
    list.innerHTML = '<div style="text-align:center;color:#888;padding:24px;font-size:13px;">Nenhum material encontrado.</div>';
    return;
  }

  var unitLabel = { metro: 'POR METRO', unidade: 'POR UNIDADE', pacote: 'POR PACOTE', kg: 'POR KG', rolo: 'POR ROLO' };
  list.innerHTML = items.map(function(m) {
    var preco = 'R$ ' + m.preco.toFixed(2).replace('.', ',');
    return '<div class="mat-row"><div><div class="mat-nome">' + m.nome + '</div><div class="mat-unit">' + (unitLabel[m.unit] || 'POR ' + m.unit.toUpperCase()) + '</div></div><div class="mat-price">' + preco + '</div></div>';
  }).join('');
}

function filterMateriais(el) {
  document.querySelectorAll('#mat-filter-row .filter-chip').forEach(function(c) { c.classList.remove('active'); });
  el.classList.add('active');
  renderMateriais();
}

function selectCategoria(el) {
  document.querySelectorAll('#mat-cat-row .filter-chip').forEach(function(c) { c.classList.remove('active'); });
  el.classList.add('active');
}

function salvarMaterial() {
  var nome = document.getElementById('mat-nome-input').value.trim();
  var unid = document.getElementById('mat-unid-input').value;
  var precoRaw = document.getElementById('mat-preco-input').value;
  var preco = parseFloat(precoRaw);
  var catEl = document.querySelector('#mat-cat-row .filter-chip.active');
  var cat = catEl ? catEl.textContent : 'OUTROS';
  var erro = document.getElementById('mat-erro');

  if (!nome) {
    erro.textContent = 'Informe o nome do material.';
    erro.style.display = 'block';
    return;
  }
  if (!precoRaw || isNaN(preco) || preco <= 0) {
    erro.textContent = 'Informe um preço válido maior que zero.';
    erro.style.display = 'block';
    return;
  }

  erro.style.display = 'none';
  materiais.push({ nome: nome, unit: unid, preco: preco, cat: cat });

  document.getElementById('mat-nome-input').value = '';
  document.getElementById('mat-preco-input').value = '';
  document.getElementById('mat-unid-input').value = 'unidade';
  document.querySelectorAll('#mat-cat-row .filter-chip').forEach(function(c) { c.classList.remove('active'); });
  document.querySelector('#mat-cat-row .filter-chip').classList.add('active');

  goTo('screen-materiais');
}

var orcamentoAtual = { materiais: [], maoDeObra: [] };

function novoOrcamento() {
  orcamentoAtual = { materiais: [], maoDeObra: [] };
  goTo('screen-orcamento');
}

function renderOrcamento() {
  var matList = document.getElementById('orc-mat-list');
  if (matList) {
    if (orcamentoAtual.materiais.length === 0) {
      matList.innerHTML = '<div style="color:#aaa;font-size:13px;padding:8px 0;">Nenhum material adicionado.</div>';
    } else {
      matList.innerHTML = orcamentoAtual.materiais.map(function(m, i) {
        var total = (m.preco * m.qty).toFixed(2).replace('.', ',');
        var preco = m.preco.toFixed(2).replace('.', ',');
        var unit = m.unit === 'metro' ? 'metro' : 'un.';
        return '<div class="orc-item-row">'
          + '<div><div class="orc-item-nome">' + m.nome + '</div><div class="orc-item-preco">R$ ' + preco + ' / ' + unit + '</div></div>'
          + '<div class="orc-item-qty">' + m.qty + '</div>'
          + '<div class="orc-item-total">R$ ' + total + '</div>'
          + '<div class="orc-item-x" onclick="removerMatOrc(' + i + ')">✕</div>'
          + '</div>';
      }).join('');
    }
  }

  var mobList = document.getElementById('orc-mob-list');
  if (mobList) {
    if (orcamentoAtual.maoDeObra.length === 0) {
      mobList.innerHTML = '<div style="color:#aaa;font-size:13px;padding:8px 0;">Nenhum item adicionado.</div>';
    } else {
      mobList.innerHTML = orcamentoAtual.maoDeObra.map(function(m, i) {
        return '<div class="orc-item-row" style="grid-template-columns:1fr 90px 20px;">'
          + '<div class="orc-item-nome">' + m.nome + '</div>'
          + '<div class="orc-item-total">R$ ' + m.valor.toFixed(2).replace('.', ',') + '</div>'
          + '<div class="orc-item-x" onclick="removerMobOrc(' + i + ')">✕</div>'
          + '</div>';
      }).join('');
    }
  }

  var fmt = function(v) { return 'R$ ' + v.toLocaleString('pt-BR', { minimumFractionDigits: 2 }); };
  var totalMat = orcamentoAtual.materiais.reduce(function(s, m) { return s + m.preco * m.qty; }, 0);
  var totalMob = orcamentoAtual.maoDeObra.reduce(function(s, m) { return s + m.valor; }, 0);
  var el = document.getElementById('orc-total-mat'); if (el) el.textContent = fmt(totalMat);
  var el2 = document.getElementById('orc-total-mob'); if (el2) el2.textContent = fmt(totalMob);
  var el3 = document.getElementById('orc-total-geral'); if (el3) el3.textContent = fmt(totalMat + totalMob);
}

function removerMatOrc(i) { orcamentoAtual.materiais.splice(i, 1); renderOrcamento(); }
function removerMobOrc(i) { orcamentoAtual.maoDeObra.splice(i, 1); renderOrcamento(); }

function toggleFormMob() {
  var f = document.getElementById('orc-mob-form');
  f.style.display = f.style.display === 'none' ? 'block' : 'none';
}

function adicionarMobOrc() {
  var nome = document.getElementById('mob-nome-input').value.trim();
  var valor = parseFloat(document.getElementById('mob-valor-input').value);
  if (!nome || isNaN(valor) || valor <= 0) return;
  orcamentoAtual.maoDeObra.push({ nome: nome, valor: valor });
  document.getElementById('mob-nome-input').value = '';
  document.getElementById('mob-valor-input').value = '';
  document.getElementById('orc-mob-form').style.display = 'none';
  renderOrcamento();
}

function renderPickerMaterial() {
  var list = document.getElementById('picker-mat-list');
  if (!list) return;
  list.innerHTML = materiais.map(function(m, i) {
    var unit = m.unit === 'metro' ? 'metro' : 'un.';
    var preco = 'R$ ' + m.preco.toFixed(2).replace('.', ',');
    return '<div class="mat-row" style="align-items:center;">'
      + '<div><div class="mat-nome">' + m.nome + '</div><div class="mat-unit">' + preco + ' / ' + unit + '</div></div>'
      + '<div style="display:flex;align-items:center;gap:6px;">'
      + '<input id="pqty-' + i + '" type="number" min="1" value="1" style="width:50px;padding:4px 6px;border:1.5px solid #d0d0d0;border-radius:6px;font-size:13px;text-align:center;">'
      + '<button onclick="adicionarMatOrc(' + i + ')" style="background:#1e3a5f;color:#fff;border:none;border-radius:6px;padding:6px 10px;font-size:12px;font-weight:700;cursor:pointer;">ADD</button>'
      + '</div></div>';
  }).join('');
}

function adicionarMatOrc(i) {
  var qtyEl = document.getElementById('pqty-' + i);
  var qty = parseInt(qtyEl ? qtyEl.value : 1);
  if (isNaN(qty) || qty <= 0) qty = 1;
  var m = materiais[i];
  var existing = null;
  orcamentoAtual.materiais.forEach(function(x) { if (x.nome === m.nome) existing = x; });
  if (existing) { existing.qty += qty; } else { orcamentoAtual.materiais.push({ nome: m.nome, unit: m.unit, preco: m.preco, qty: qty }); }
  if (qtyEl) qtyEl.value = 1;
  goTo('screen-orcamento');
}

function goTo(id) {
  var prev = document.querySelector('.screen.active');
  if (prev) _prevScreen = prev.id;
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  var el = document.getElementById(id);
  el.classList.add('active');
  var sb = el.querySelector('.scroll-body');
  if (sb) sb.scrollTop = 0;
  if (id === 'screen-orcamento') renderOrcamento();
  if (id === 'screen-picker-material') renderPickerMaterial();
  if (id === 'screen-agenda') { renderCalendar(); renderAgenda(); }
  if (id === 'screen-materiais') renderMateriais();
  if (id === 'screen-pagamentos') renderPagamentos();
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
  var mesStr = year + '-' + (month + 1 < 10 ? '0' + (month + 1) : month + 1);
  var eventDays = agendamentos
    .filter(function(a) { return a.data.indexOf(mesStr) === 0; })
    .map(function(a) { return parseInt(a.data.split('-')[2]); });

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
