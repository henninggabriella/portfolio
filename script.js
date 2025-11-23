// script.js - controla modais, calendário e comportamento de acessibilidade

// Abre o modal com id específico
function openModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.setAttribute('aria-hidden', 'false');
  modal.style.display = 'flex';
  // colocar foco no botão fechar para acessibilidade
  const closeBtn = modal.querySelector('.close');
  if (closeBtn) closeBtn.focus();
  // impedir scroll do body
  document.documentElement.style.overflow = 'hidden';
}

// Fecha o modal pelo id
function closeModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.setAttribute('aria-hidden', 'true');
  modal.style.display = 'none';
  document.documentElement.style.overflow = ''; // restaura scroll
}

// fecha ao clicar fora do conteúdo (delegação)
document.addEventListener('click', function(e) {
  // Se clicou numa área .modal (fundo)
  const target = e.target;
  if (target.classList && target.classList.contains('modal')) {
    target.setAttribute('aria-hidden', 'true');
    target.style.display = 'none';
    document.documentElement.style.overflow = '';
  }
});

// fecha com ESC (fecha qualquer modal aberto)
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape' || e.key === 'Esc') {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(m => {
      if (m.style.display === 'flex' || m.getAttribute('aria-hidden') === 'false') {
        m.setAttribute('aria-hidden', 'true');
        m.style.display = 'none';
      }
    });
    document.documentElement.style.overflow = '';
  }
});

// Cria calendario simples para dezembro do ano corrente
function createDecemberCalendar() {
  const grid = document.getElementById('calendar-grid');
  if (!grid) return;

  // limpar
  grid.innerHTML = '';

  const year = new Date().getFullYear();
  const month = 11; // dezembro (0-indexed)
  const firstDay = new Date(year, month, 1);
  const weekdayOfFirst = firstDay.getDay(); // 0-dom..6-sab

  // cabeçalhos dos dias
  const weekNames = ['D','S','T','Q','Q','S','S'];
  for (let i=0;i<7;i++){
    const w = document.createElement('div');
    w.className = 'day muted';
    w.textContent = weekNames[i];
    grid.appendChild(w);
  }

  // preencher espaços antes do 1º dia
  for (let i=0;i<weekdayOfFirst;i++){
    const empty = document.createElement('div');
    empty.className = 'day muted';
    empty.textContent = '';
    grid.appendChild(empty);
  }

  // dias do mês
  const daysInDec = 31;
  for (let d=1; d<=daysInDec; d++){
    const dayEl = document.createElement('div');
    dayEl.className = 'day';
    dayEl.textContent = d;

    // destacar eventos
    if (d === 19) dayEl.classList.add('event-end');    // fim das aulas
    if (d === 25) dayEl.classList.add('event-natal');  // natal

    // destacar hoje se for dezembro e dia coincide
    const today = new Date();
    if (today.getMonth() === 11 && today.getDate() === d && today.getFullYear() === year) {
      dayEl.classList.add('today');
    }

    grid.appendChild(dayEl);
  }

  // Observação: 01/01 (Ano Novo) fica na legenda (próximo ano)
}
createDecemberCalendar();

// Torna cards "enter/space" acessíveis (keyboard)
document.querySelectorAll('.project-item').forEach(card => {
  card.addEventListener('keydown', function(e){
    if (e.key === 'Enter' || e.key === ' ') {
      const onClick = card.getAttribute('onclick');
      if (onClick) {
        // extrai id do onclick openModal('projetoX')
        const match = onClick.match(/openModal\('([^']+)'\)/);
        if (match) openModal(match[1]);
      }
    }
  });
});

// Prevent focus trap: when modal closes return focus to last focused project-card
let lastFocused = null;
document.querySelectorAll('.project-item').forEach(card => {
  card.addEventListener('focus', () => lastFocused = card);
  card.addEventListener('click', () => lastFocused = card);
});

// When closing any modal, return focus
document.addEventListener('click', (e) => {
  if (e.target.classList && e.target.classList.contains('close')) {
    // find parent modal
    const modal = e.target.closest('.modal');
    if (modal) {
      modal.style.display = 'none';
      modal.setAttribute('aria-hidden','true');
      document.documentElement.style.overflow = '';
      if (lastFocused) lastFocused.focus();
    }
  }
});
