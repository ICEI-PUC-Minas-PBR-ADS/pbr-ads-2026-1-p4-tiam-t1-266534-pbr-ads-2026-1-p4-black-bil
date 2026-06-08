(function protegerPagina() {
    const sessao = JSON.parse(localStorage.getItem('blackbil_sessao') || 'null');
    if (!sessao || sessao.tipo !== 'cliente') {
        window.location.href = '../login/login.html';
    }
})();

const sessao = JSON.parse(localStorage.getItem('blackbil_sessao'));

// ===== USUÁRIO DROPDOWN =====
(function iniciarDropdown() {
    const inicial = document.getElementById('usuario-inicial');
    const dropdown = document.getElementById('usuario-dropdown');
    const btnUsuario = document.getElementById('btn-usuario');
    const dropdownNome = document.getElementById('dropdown-nome');
    const btnSair = document.getElementById('btn-sair');

    inicial.textContent = sessao.nome.charAt(0).toUpperCase();
    dropdownNome.textContent = sessao.nome;

    btnUsuario.addEventListener('click', function (e) {
        e.stopPropagation();
        dropdown.classList.toggle('escondido');
    });

    document.addEventListener('click', function () {
        dropdown.classList.add('escondido');
    });

    dropdown.addEventListener('click', function (e) {
        e.stopPropagation();
    });

    btnSair.addEventListener('click', function () {
        localStorage.removeItem('blackbil_sessao');
        window.location.href = '../agendamento/agendamento.html';
    });
})();

// ===== HELPERS =====
function formatarData(isoDate) {
    const [ano, mes, dia] = isoDate.split('-');
    const data = new Date(ano, mes - 1, dia);
    const dias = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const meses = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
    return `${dias[data.getDay()]}, ${dia} de ${meses[mes - 1]}.`;
}

function formatarDuracao(min) {
    if (min < 60) return `${min} min`;
    const h = Math.floor(min / 60);
    const m = min % 60;
    return m === 0 ? `${h}h` : `${h}h ${m}min`;
}

function isFuturo(isoDate, horario) {
    const [ano, mes, dia] = isoDate.split('-');
    const [hh, mm] = horario.split(':');
    const dt = new Date(ano, mes - 1, dia, hh, mm);
    return dt > new Date();
}

function labelStatus(status) {
    const labels = { confirmado: 'Confirmado', concluido: 'Concluído', cancelado: 'Cancelado' };
    return labels[status] || status;
}

function classeBadge(status) {
    const classes = { confirmado: 'badge-confirmado', concluido: 'badge-concluido', cancelado: 'badge-cancelado' };
    return classes[status] || '';
}

// ===== RENDERIZAÇÃO =====
let filtroAtivo = 'todos';

function carregarAgendamentos() {
    const todos = JSON.parse(localStorage.getItem('blackbil_agendamentos') || '[]');
    return todos.filter(a => a.clienteId === sessao.id);
}

function renderLista() {
    const lista = carregarAgendamentos();
    const filtrados = filtroAtivo === 'todos'
        ? lista
        : lista.filter(a => a.status === filtroAtivo);

    const container = document.getElementById('lista-agendamentos');
    container.innerHTML = '';

    if (filtrados.length === 0) {
        container.innerHTML = `
            <div class="lista-vazia">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                <p>Nenhum agendamento encontrado.</p>
            </div>`;
        return;
    }

    filtrados
        .slice()
        .sort((a, b) => {
            const da = new Date(`${a.data}T${a.horario}`);
            const db = new Date(`${b.data}T${b.horario}`);
            return db - da;
        })
        .forEach(ag => {
            const podeCancelar = ag.status === 'confirmado' && isFuturo(ag.data, ag.horario);
            const card = document.createElement('div');
            card.className = 'card-agendamento';
            card.innerHTML = `
                <div class="card-topo">
                    <div>
                        <div class="card-servico">${ag.servico}</div>
                        <div class="card-categoria">${ag.categoria}</div>
                    </div>
                    <span class="badge-status ${classeBadge(ag.status)}">${labelStatus(ag.status)}</span>
                </div>
                <div class="card-detalhes">
                    <div class="card-detalhe">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                            <line x1="16" y1="2" x2="16" y2="6"/>
                            <line x1="8" y1="2" x2="8" y2="6"/>
                            <line x1="3" y1="10" x2="21" y2="10"/>
                        </svg>
                        ${formatarData(ag.data)}
                    </div>
                    <div class="card-detalhe">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="12" r="10"/>
                            <polyline points="12 6 12 12 16 14"/>
                        </svg>
                        ${ag.horario}
                    </div>
                    <div class="card-detalhe">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M12 2v10l4 4"/>
                            <circle cx="12" cy="14" r="8"/>
                        </svg>
                        ${formatarDuracao(ag.duracao || 30)}
                    </div>
                </div>
                <div class="card-rodape">
                    <div>
                        ${ag.apartirde ? '<span class="card-preco-apartirde">A partir de</span>' : ''}
                        <span class="card-preco">R$ ${parseFloat(ag.preco).toFixed(2).replace('.', ',')}</span>
                    </div>
                    ${podeCancelar
                        ? `<button class="btn-cancelar" data-id="${ag.id}">Cancelar</button>`
                        : ''}
                </div>`;
            container.appendChild(card);
        });

    container.querySelectorAll('.btn-cancelar').forEach(btn => {
        btn.addEventListener('click', function () {
            cancelarAgendamento(this.dataset.id);
        });
    });
}

function cancelarAgendamento(id) {
    if (!confirm('Deseja cancelar este agendamento?')) return;
    const todos = JSON.parse(localStorage.getItem('blackbil_agendamentos') || '[]');
    const idx = todos.findIndex(a => a.id === id);
    if (idx !== -1) {
        todos[idx].status = 'cancelado';
        localStorage.setItem('blackbil_agendamentos', JSON.stringify(todos));
        renderLista();
    }
}

// ===== FILTROS =====
document.getElementById('filtros').addEventListener('click', function (e) {
    const btn = e.target.closest('.filtro');
    if (!btn) return;
    document.querySelectorAll('.filtro').forEach(b => b.classList.remove('ativo'));
    btn.classList.add('ativo');
    filtroAtivo = btn.dataset.filtro;
    renderLista();
});

// ===== INIT =====
renderLista();
