// ===== PROTEÇÃO =====
(function() {
    const sessao = JSON.parse(localStorage.getItem('blackbil_sessao') || 'null');
    if (!sessao || sessao.tipo !== 'funcionario') window.location.href = '../login/login.html';
})();

// ===== HELPERS =====
function formatarDuracao(min) {
    if (min < 60) return `${min} min`;
    const h = Math.floor(min / 60); const m = min % 60;
    return m === 0 ? `${h}h` : `${h}h ${m}min`;
}

function gerarSlug(nome) {
    return nome.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

// ===== ESTADO =====
let catalogo       = {};
let categoriaAtual = null;
let editandoIndex  = null;

// As fotos ficam apenas no localStorage (não são sincronizadas com o banco)
const CHAVE_FOTOS = 'blackbil_fotos';

function carregarFotos() {
    return JSON.parse(localStorage.getItem(CHAVE_FOTOS) || '{}');
}
function salvarFotos(fotos) {
    localStorage.setItem(CHAVE_FOTOS, JSON.stringify(fotos));
}

// ===== PERSISTÊNCIA =====
async function carregarCatalogo() {
    catalogo = await API.getServicos();
    const fotos = carregarFotos();
    Object.keys(catalogo).forEach(slug => {
        catalogo[slug].fotos = fotos[slug] || [];
    });
    if (!categoriaAtual || !catalogo[categoriaAtual]) {
        categoriaAtual = Object.keys(catalogo)[0] || null;
    }
}

async function salvarCategoria(slug) {
    const { titulo, itens } = catalogo[slug];
    await API.salvarCategoria(slug, { titulo, itens });
    // Salva fotos separadamente no localStorage
    const fotos = carregarFotos();
    fotos[slug] = catalogo[slug].fotos || [];
    salvarFotos(fotos);
}

// ===== ÍCONES =====
const ICONE_EDITAR = `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`;
const ICONE_DELETAR = `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>`;

// ===== RENDER TABS =====
function renderTabs() {
    const container = document.getElementById('categorias-tabs');
    container.innerHTML = Object.keys(catalogo).map(cat => `
        <button class="tab ${cat === categoriaAtual ? 'ativo' : ''}" data-cat="${cat}">
            ${catalogo[cat].titulo}
            <span class="tab-x" data-delete="${cat}" title="Excluir categoria">×</span>
        </button>`).join('');
    container.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => {
            categoriaAtual = tab.dataset.cat;
            renderTabs(); renderServicos(); renderFotos();
        });
    });
    container.querySelectorAll('.tab-x').forEach(x => {
        x.addEventListener('click', e => { e.stopPropagation(); deletarCategoria(x.dataset.delete); });
    });
}

// ===== RENDER SERVIÇOS =====
function renderServicos() {
    const lista = document.getElementById('servicos-lista');
    if (!categoriaAtual) { lista.innerHTML = '<p class="lista-vazia">Nenhuma categoria.</p>'; return; }
    const itens = catalogo[categoriaAtual].itens;
    if (itens.length === 0) { lista.innerHTML = '<p class="lista-vazia">Nenhum serviço cadastrado nesta categoria.</p>'; return; }
    lista.innerHTML = itens.map((s, i) => `
        <div class="servico-card">
            <div class="servico-info">
                <span class="servico-nome">${s.nome}</span>
                <span class="servico-meta">
                    <span class="servico-duracao">${formatarDuracao(s.duracao || 30)}</span>
                    <span class="servico-preco-wrap">
                        ${s.apartirde ? '<span class="apartirde">a partir de</span>' : ''}
                        <span class="servico-preco">R$ ${s.preco.toFixed(2).replace('.', ',')}</span>
                    </span>
                </span>
            </div>
            <div class="servico-acoes">
                <button class="btn-acao btn-editar" data-index="${i}" title="Editar">${ICONE_EDITAR}</button>
                <button class="btn-acao btn-deletar" data-index="${i}" title="Excluir">${ICONE_DELETAR}</button>
            </div>
        </div>`).join('');
    lista.querySelectorAll('.btn-editar').forEach(btn => btn.addEventListener('click', () => abrirEdicao(parseInt(btn.dataset.index))));
    lista.querySelectorAll('.btn-deletar').forEach(btn => btn.addEventListener('click', () => deletarServico(parseInt(btn.dataset.index))));
}

// ===== MODAL SERVIÇO =====
function abrirModal(titulo) {
    document.getElementById('modal-titulo').textContent = titulo;
    document.getElementById('modal-overlay').classList.remove('escondido');
}
function fecharModal() {
    document.getElementById('modal-overlay').classList.add('escondido');
    document.getElementById('form-servico').reset();
    editandoIndex = null;
}
function abrirAdicao() { editandoIndex = null; abrirModal('Novo Serviço — ' + catalogo[categoriaAtual].titulo); }
function abrirEdicao(index) {
    editandoIndex = index;
    const s = catalogo[categoriaAtual].itens[index];
    document.getElementById('input-nome').value        = s.nome;
    document.getElementById('input-preco').value       = s.preco;
    document.getElementById('input-duracao').value     = s.duracao || 30;
    document.getElementById('input-apartirde').checked = !!s.apartirde;
    abrirModal('Editar Serviço');
}

async function deletarServico(index) {
    const nome = catalogo[categoriaAtual].itens[index].nome;
    if (!confirm(`Excluir "${nome}"?`)) return;
    catalogo[categoriaAtual].itens.splice(index, 1);
    await salvarCategoria(categoriaAtual);
    renderServicos();
}

document.getElementById('form-servico').addEventListener('submit', async e => {
    e.preventDefault();
    const nome      = document.getElementById('input-nome').value.trim();
    const preco     = parseFloat(document.getElementById('input-preco').value);
    const duracao   = parseInt(document.getElementById('input-duracao').value);
    const apartirde = document.getElementById('input-apartirde').checked;
    if (!nome || isNaN(preco) || preco < 0) return;
    const servico = { nome, preco, duracao, ...(apartirde && { apartirde: true }) };
    if (editandoIndex !== null) catalogo[categoriaAtual].itens[editandoIndex] = servico;
    else catalogo[categoriaAtual].itens.push(servico);
    await salvarCategoria(categoriaAtual);
    fecharModal(); renderServicos();
});

document.getElementById('btn-adicionar').addEventListener('click', abrirAdicao);
document.getElementById('modal-fechar').addEventListener('click', fecharModal);
document.getElementById('btn-cancelar').addEventListener('click', fecharModal);
document.getElementById('modal-overlay').addEventListener('click', e => { if (e.target.id === 'modal-overlay') fecharModal(); });

// ===== FOTOS =====
function renderFotos() {
    const grid  = document.getElementById('fotos-gerenciar-grid');
    const fotos = catalogo[categoriaAtual]?.fotos || [];
    if (fotos.length === 0) {
        grid.innerHTML = '<p class="fotos-vazia-gerenciar">Nenhuma foto nesta categoria.</p>'; return;
    }
    grid.innerHTML = fotos.map((f, i) => `
        <div class="foto-card">
            <img src="${f.url}" alt="Foto ${i + 1}">
            <button class="foto-card-deletar" data-index="${i}" title="Remover foto">✕</button>
        </div>`).join('');
    grid.querySelectorAll('.foto-card-deletar').forEach(btn => {
        btn.addEventListener('click', async () => {
            catalogo[categoriaAtual].fotos.splice(parseInt(btn.dataset.index), 1);
            await salvarCategoria(categoriaAtual);
            renderFotos();
        });
    });
}

document.getElementById('input-foto').addEventListener('change', e => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    let processadas = 0;
    files.forEach(file => {
        const reader = new FileReader();
        reader.onload = async evt => {
            if (!catalogo[categoriaAtual].fotos) catalogo[categoriaAtual].fotos = [];
            catalogo[categoriaAtual].fotos.push({ url: evt.target.result });
            processadas++;
            if (processadas === files.length) { await salvarCategoria(categoriaAtual); renderFotos(); }
        };
        reader.readAsDataURL(file);
    });
    e.target.value = '';
});

// ===== NOVA CATEGORIA =====
async function deletarCategoria(cat) {
    const titulo = catalogo[cat].titulo;
    const qtd    = catalogo[cat].itens.length;
    const aviso  = qtd > 0 ? `Excluir "${titulo}"?\n\nIsso removerá ${qtd} serviço${qtd > 1 ? 's' : ''}.` : `Excluir "${titulo}"?`;
    if (!confirm(aviso)) return;
    await API.deletarCategoria(cat);
    delete catalogo[cat];
    const fotos = carregarFotos(); delete fotos[cat]; salvarFotos(fotos);
    categoriaAtual = Object.keys(catalogo)[0] || null;
    renderTabs(); renderServicos();
}

function fecharModalCategoria() {
    document.getElementById('modal-categoria-overlay').classList.add('escondido');
    document.getElementById('form-categoria').reset();
}

document.getElementById('btn-nova-categoria').addEventListener('click', () => {
    document.getElementById('modal-categoria-overlay').classList.remove('escondido');
    document.getElementById('input-cat-nome').focus();
});
document.getElementById('modal-cat-fechar').addEventListener('click', fecharModalCategoria);
document.getElementById('btn-cat-cancelar').addEventListener('click', fecharModalCategoria);
document.getElementById('modal-categoria-overlay').addEventListener('click', e => { if (e.target.id === 'modal-categoria-overlay') fecharModalCategoria(); });

document.getElementById('form-categoria').addEventListener('submit', async e => {
    e.preventDefault();
    const nome = document.getElementById('input-cat-nome').value.trim();
    if (!nome) return;
    let slug = gerarSlug(nome);
    if (catalogo[slug]) { let n = 2; while (catalogo[`${slug}-${n}`]) n++; slug = `${slug}-${n}`; }
    catalogo[slug] = { titulo: nome, itens: [], fotos: [] };
    await salvarCategoria(slug);
    categoriaAtual = slug;
    fecharModalCategoria(); renderTabs(); renderServicos();
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
navMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => { hamburger.classList.remove('ativo'); navMenu.classList.remove('aberto'); }));

// ===== INIT =====
carregarCatalogo().then(() => { renderTabs(); renderServicos(); renderFotos(); }).catch(console.error);
