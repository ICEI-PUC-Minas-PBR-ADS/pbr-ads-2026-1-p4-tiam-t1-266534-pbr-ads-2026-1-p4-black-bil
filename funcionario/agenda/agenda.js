// ===== PROTEÇÃO =====
(function() {
    const sessao = JSON.parse(localStorage.getItem('blackbil_sessao') || 'null');
    if (!sessao || sessao.tipo !== 'funcionario') window.location.href = '../login/login.html';
    if (['proprietario', 'admin'].includes(sessao?.role)) {
        const li = document.getElementById('nav-equipe');
        if (li) li.style.display = '';
    }
})();

const HORARIOS_MANHA = ['09:00','09:30','10:00','10:30','11:00'];
const HORARIOS_TARDE = ['13:00','13:30','14:00','14:30','15:00','15:30','16:00','16:30','17:00','17:30'];
const HORARIOS_NOITE = ['18:00','18:30','19:00'];
const TODOS_HORARIOS = [...HORARIOS_MANHA, ...HORARIOS_TARDE, ...HORARIOS_NOITE];

const MESES = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
const DIAS_EXTENSO = ['Domingo','Segunda-feira','Terça-feira','Quarta-feira','Quinta-feira','Sexta-feira','Sábado'];

// ===== ESTADO =====
const estado = {
    dataAtual: (() => { const d = new Date(); d.setHours(0,0,0,0); return d; })()
};

// ===== CACHE LOCAL =====
let _agendamentos   = [];
let _bloqueios      = [];
let _diasBloqueados = [];

// ===== HELPERS =====
function isoData(date) {
    return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
}

function formatPreco(ag) {
    return `${ag.apartirde ? 'A partir de ' : ''}R$ ${ag.preco.toFixed(2).replace('.', ',')}`;
}

function formatarDuracao(min) {
    if (min < 60) return `${min} min`;
    const h = Math.floor(min / 60); const m = min % 60;
    return m === 0 ? `${h}h` : `${h}h ${m}min`;
}

function slotsCobertos(horarioInicio, duracao) {
    const inicio = TODOS_HORARIOS.indexOf(horarioInicio);
    if (inicio === -1) return [];
    return TODOS_HORARIOS.slice(inicio, inicio + Math.ceil((duracao || 30) / 30));
}

// ===== LEITURA DO CACHE =====
function carregarAgendamentos() { return _agendamentos; }
function carregarBloqueios()    { return _bloqueios; }
function diaBloqueado(dataISO)  { return _diasBloqueados.includes(dataISO); }

function slotsExtensao(dataISO) {
    const extensoes = new Set();
    _agendamentos
        .filter(a => a.data === dataISO && a.status === 'confirmado')
        .forEach(ag => slotsCobertos(ag.horario, ag.duracao || 30).slice(1).forEach(h => extensoes.add(h)));
    return extensoes;
}

function estadoSlot(dataISO, horario) {
    const ag = _agendamentos.find(a => a.data === dataISO && a.horario === horario && a.status === 'confirmado');
    if (ag) return { tipo: 'ocupado', agendamento: ag };
    const bl = _bloqueios.find(b => b.data === dataISO && b.horario === horario);
    if (bl) return { tipo: 'bloqueado' };
    return { tipo: 'livre' };
}

// ===== SINCRONIZAÇÃO =====
async function sincronizar(dataISO) {
    [_agendamentos, _bloqueios, _diasBloqueados] = await Promise.all([
        API.getAgendamentos({ data: dataISO }),
        API.getBloqueios(dataISO),
        API.getDiasBloqueados()
    ]);
}

// ===== RENDER NAV DATA =====
function renderNavData() {
    const d = estado.dataAtual;
    document.getElementById('dia-semana').textContent    = DIAS_EXTENSO[d.getDay()];
    document.getElementById('data-completa').textContent = `${d.getDate()} de ${MESES[d.getMonth()]} de ${d.getFullYear()}`;
    const hoje = new Date(); hoje.setHours(0,0,0,0);
    document.getElementById('btn-hoje').classList.toggle('ativo', d.getTime() === hoje.getTime());
    const bloqueado = diaBloqueado(isoData(d));
    const btnBloqDia = document.getElementById('btn-bloquear-dia');
    btnBloqDia.textContent = bloqueado ? 'Desbloquear dia' : 'Bloquear dia';
    btnBloqDia.classList.toggle('bloqueado', bloqueado);
}

// ===== RENDER RESUMO =====
function renderResumo() {
    const dataISO = isoData(estado.dataAtual);
    const div     = document.getElementById('resumo-dia');
    if (diaBloqueado(dataISO)) {
        div.innerHTML = '<span class="badge badge-dia-bloqueado">Dia inteiro bloqueado</span>';
        return;
    }
    const ags = _agendamentos.filter(a => a.data === dataISO && a.status === 'confirmado');
    const bls = _bloqueios.filter(b => b.data === dataISO);
    if (ags.length === 0 && bls.length === 0) {
        div.innerHTML = '<span class="badge badge-livre">Dia livre</span>'; return;
    }
    let html = '';
    if (ags.length > 0) html += `<span class="badge badge-ocupado">${ags.length} agendamento${ags.length > 1 ? 's' : ''}</span>`;
    if (bls.length > 0) html += `<span class="badge badge-bloqueado">${bls.length} bloqueio${bls.length > 1 ? 's' : ''}</span>`;
    div.innerHTML = html;
}

// ===== RENDER SLOTS =====
function renderSlots() {
    const dataISO = isoData(estado.dataAtual);
    const aviso   = document.getElementById('aviso-dia-bloqueado');
    const blocos  = document.querySelectorAll('.bloco-periodo');
    if (diaBloqueado(dataISO)) {
        aviso.classList.remove('escondido');
        blocos.forEach(b => b.classList.add('escondido'));
        return;
    }
    aviso.classList.add('escondido');
    blocos.forEach(b => b.classList.remove('escondido'));
    const extensao = slotsExtensao(dataISO);
    renderPeriodo('slots-manha', HORARIOS_MANHA, extensao);
    renderPeriodo('slots-tarde', HORARIOS_TARDE, extensao);
    renderPeriodo('slots-noite', HORARIOS_NOITE, extensao);
}

function renderPeriodo(containerId, horarios, extensao) {
    const dataISO   = isoData(estado.dataAtual);
    const container = document.getElementById(containerId);
    const html = horarios.filter(h => !extensao.has(h)).map(h => {
        const { tipo, agendamento } = estadoSlot(dataISO, h);
        let conteudo = '';
        if (tipo === 'ocupado') {
            conteudo = `
                <div class="slot-info">
                    <span class="slot-servico">${agendamento.servico}</span>
                    <span class="slot-cat">${agendamento.categoria} · ${formatarDuracao(agendamento.duracao || 30)}</span>
                </div>
                <span class="slot-preco">${formatPreco(agendamento)}</span>`;
        } else if (tipo === 'bloqueado') {
            conteudo = `<span class="slot-label">Bloqueado</span>`;
        } else {
            conteudo = `<span class="slot-label">Livre</span>`;
        }
        return `
            <div class="slot slot-${tipo}" data-horario="${h}" data-data="${dataISO}" data-tipo="${tipo}">
                <span class="slot-hora">${h}</span>
                <div class="slot-conteudo">${conteudo}</div>
                <span class="slot-chevron">›</span>
            </div>`;
    }).join('');
    container.innerHTML = html || '<p class="horarios-vazio">Sem slots neste período</p>';
    container.querySelectorAll('.slot').forEach(slot => {
        slot.addEventListener('click', () => abrirModal(slot.dataset.data, slot.dataset.horario, slot.dataset.tipo));
    });
}

// ===== MODAL =====
function abrirModal(dataISO, horario, tipo) {
    const titulo = document.getElementById('modal-titulo');
    const body   = document.getElementById('modal-body');
    const acoes  = document.getElementById('modal-acoes');
    titulo.textContent = horario;
    body.innerHTML = ''; acoes.innerHTML = '';

    if (tipo === 'ocupado') {
        const ag = _agendamentos.find(a => a.data === dataISO && a.horario === horario && a.status === 'confirmado');
        body.innerHTML = `
            ${ag.clienteNome ? `<div class="detalhe-item"><span class="detalhe-rotulo">Cliente</span><span class="detalhe-valor">${ag.clienteNome}</span></div>` : ''}
            ${ag.clienteTelefone ? `<div class="detalhe-item"><span class="detalhe-rotulo">Telefone</span><span class="detalhe-valor">${ag.clienteTelefone}</span></div>` : ''}
            <div class="detalhe-item"><span class="detalhe-rotulo">Serviço</span><span class="detalhe-valor">${ag.servico}</span></div>
            <div class="detalhe-item"><span class="detalhe-rotulo">Categoria</span><span class="detalhe-valor">${ag.categoria}</span></div>
            <div class="detalhe-item"><span class="detalhe-rotulo">Duração</span><span class="detalhe-valor">${formatarDuracao(ag.duracao || 30)}</span></div>
            <div class="detalhe-item"><span class="detalhe-rotulo">Valor</span><span class="detalhe-valor destaque">${formatPreco(ag)}</span></div>`;
        acoes.innerHTML = `
            <button class="btn-concluir" id="btn-concluir">✓ Concluído</button>
            <button class="btn-cancelar-ag" id="btn-cancelar-ag">✕ Cancelar</button>`;
        document.getElementById('btn-concluir').addEventListener('click', () => {
            atualizarStatus(ag.id, 'concluido'); fecharModal();
        });
        document.getElementById('btn-cancelar-ag').addEventListener('click', () => {
            if (confirm('Cancelar este agendamento?')) { atualizarStatus(ag.id, 'cancelado'); fecharModal(); }
        });
    } else if (tipo === 'bloqueado') {
        body.innerHTML = `<p class="detalhe-info">Este horário está bloqueado e não aparece para agendamento.</p>`;
        acoes.innerHTML = `<button class="btn-desbloquear" id="btn-desbloquear">Desbloquear horário</button>`;
        document.getElementById('btn-desbloquear').addEventListener('click', () => {
            desbloquearSlot(dataISO, horario); fecharModal();
        });
    } else {
        body.innerHTML = `<p class="detalhe-info">Este horário está livre para agendamento pelos clientes.</p>`;
        acoes.innerHTML = `<button class="btn-bloquear" id="btn-bloquear">Bloquear horário</button>`;
        document.getElementById('btn-bloquear').addEventListener('click', () => {
            bloquearSlot(dataISO, horario); fecharModal();
        });
    }
    document.getElementById('modal-overlay').classList.remove('escondido');
}

function fecharModal() {
    document.getElementById('modal-overlay').classList.add('escondido');
}

// ===== AÇÕES =====
function atualizarStatus(id, novoStatus) {
    const ag = _agendamentos.find(a => a.id === id);
    if (ag) ag.status = novoStatus;
    renderResumo(); renderSlots();
    API.atualizarAgendamento(id, { status: novoStatus }).catch(console.error);
}

function bloquearSlot(dataISO, horario) {
    _bloqueios.push({ data: dataISO, horario });
    renderResumo(); renderSlots();
    API.bloquearSlot(dataISO, horario).catch(console.error);
}

function desbloquearSlot(dataISO, horario) {
    _bloqueios = _bloqueios.filter(b => !(b.data === dataISO && b.horario === horario));
    renderResumo(); renderSlots();
    API.desbloquearSlot(dataISO, horario).catch(console.error);
}

function bloquearDia(dataISO) {
    if (!_diasBloqueados.includes(dataISO)) _diasBloqueados.push(dataISO);
    renderTudo();
    API.bloquearDia(dataISO).catch(console.error);
}

function desbloquearDia(dataISO) {
    _diasBloqueados = _diasBloqueados.filter(d => d !== dataISO);
    renderTudo();
    API.desbloquearDia(dataISO).catch(console.error);
}

// ===== BOTÃO BLOQUEAR DIA =====
document.getElementById('btn-bloquear-dia').addEventListener('click', () => {
    const dataISO = isoData(estado.dataAtual);
    if (diaBloqueado(dataISO)) {
        desbloquearDia(dataISO);
    } else {
        const ags = _agendamentos.filter(a => a.data === dataISO && a.status === 'confirmado');
        if (ags.length > 0 && !confirm(`Há ${ags.length} agendamento${ags.length > 1 ? 's' : ''} neste dia. Deseja bloquear mesmo assim?`)) return;
        bloquearDia(dataISO);
    }
});

// ===== NAVEGAÇÃO DE DATA =====
document.getElementById('btn-dia-ant').addEventListener('click', () => {
    estado.dataAtual.setDate(estado.dataAtual.getDate() - 1);
    renderTudo().catch(console.error);
});
document.getElementById('btn-dia-pro').addEventListener('click', () => {
    estado.dataAtual.setDate(estado.dataAtual.getDate() + 1);
    renderTudo().catch(console.error);
});
document.getElementById('btn-hoje').addEventListener('click', () => {
    estado.dataAtual = new Date(); estado.dataAtual.setHours(0,0,0,0);
    renderTudo().catch(console.error);
});

// ===== MODAL EVENTOS =====
document.getElementById('modal-fechar').addEventListener('click', fecharModal);
document.getElementById('modal-overlay').addEventListener('click', e => {
    if (e.target.id === 'modal-overlay') fecharModal();
});

// ===== LOGOUT =====
document.getElementById('btn-sair').addEventListener('click', () => {
    localStorage.removeItem('blackbil_sessao');
    window.location.href = '../login/login.html';
});

// ===== HAMBURGER =====
const hamburger = document.getElementById('hamburger');
const navMenu   = document.getElementById('nav-menu');
hamburger.addEventListener('click', () => { hamburger.classList.toggle('ativo'); navMenu.classList.toggle('aberto'); });
navMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    hamburger.classList.remove('ativo'); navMenu.classList.remove('aberto');
}));

// ===== FOTO DE PERFIL =====
function redimensionar(file, max = 200) {
    return new Promise(resolve => {
        const reader = new FileReader();
        reader.onload = e => {
            const img = new Image();
            img.onload = () => {
                const scale = Math.min(max / img.width, max / img.height, 1);
                const canvas = document.createElement('canvas');
                canvas.width = img.width * scale;
                canvas.height = img.height * scale;
                canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
                resolve(canvas.toDataURL('image/jpeg', 0.85));
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    });
}

function aplicarFotoAvatar(base64) {
    const img = document.getElementById('perfil-foto');
    const ini = document.getElementById('perfil-inicial');
    img.src = base64;
    img.classList.add('visivel');
    ini.style.display = 'none';
}

(async function initAvatar() {
    const sessao = JSON.parse(localStorage.getItem('blackbil_sessao') || 'null');
    if (!sessao) return;
    document.getElementById('perfil-inicial').textContent = sessao.nome.charAt(0).toUpperCase();
    try {
        const f = await API.getFuncionario(sessao.id);
        if (f.foto) aplicarFotoAvatar(f.foto);
    } catch (e) {}
    document.getElementById('btn-perfil').addEventListener('click', () => {
        document.getElementById('input-foto-perfil').click();
    });
    document.getElementById('input-foto-perfil').addEventListener('change', async e => {
        const file = e.target.files[0];
        if (!file) return;
        const base64 = await redimensionar(file);
        aplicarFotoAvatar(base64);
        await API.atualizarFuncionario(sessao.id, { foto: base64 });
        e.target.value = '';
    });
})();

// ===== INIT =====
async function renderTudo() {
    await sincronizar(isoData(estado.dataAtual));
    renderNavData();
    renderResumo();
    renderSlots();
}

renderTudo().catch(console.error);
