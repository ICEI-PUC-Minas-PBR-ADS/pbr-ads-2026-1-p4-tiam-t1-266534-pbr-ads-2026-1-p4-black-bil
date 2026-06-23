// ===== PROTEÇÃO =====
(function () {
    const sessao = JSON.parse(localStorage.getItem('blackbil_sessao') || 'null');
    if (!sessao || sessao.tipo !== 'funcionario') window.location.href = '../login/login.html';
    if (['proprietario', 'admin'].includes(sessao?.role)) {
        const li = document.getElementById('nav-equipe');
        if (li) li.style.display = '';
    }
})();

// ===== ESTADO =====
let diasAtivos        = 30;
let graficoBarras     = null;
let graficoLinha      = null;
let graficoFuturos    = null;
let graficoFuturosCat = null;

// ===== HELPERS =====
function formatarReais(v) {
    return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// ===== FILTROS =====
document.querySelectorAll('.btn-periodo').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.btn-periodo').forEach(b => b.classList.remove('ativo'));
        btn.classList.add('ativo');
        diasAtivos = parseInt(btn.dataset.dias);
        carregarDashboard();
    });
});

// ===== GRÁFICO DE BARRAS — Receita por categoria =====
const CORES = ['#a1d5d9', '#7bbec3', '#8B5E3C', '#c4a882', '#a3c4bc', '#6b9e9f'];

function renderBarras(porCategoria) {
    const ctx = document.getElementById('grafico-categorias').getContext('2d');
    if (graficoBarras) graficoBarras.destroy();
    graficoBarras = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: porCategoria.map(c => c.categoria),
            datasets: [{
                data:            porCategoria.map(c => c.receita),
                backgroundColor: CORES.slice(0, porCategoria.length),
                borderRadius:    6,
                borderSkipped:   false,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: { callbacks: { label: ctx => formatarReais(ctx.parsed.y) } }
            },
            scales: {
                x: { ticks: { font: { family: 'Outfit', size: 11 }, maxRotation: 30 } },
                y: {
                    beginAtZero: true,
                    ticks: { callback: v => 'R$ ' + v.toLocaleString('pt-BR'), font: { family: 'Outfit', size: 11 } },
                    grid: { color: '#eef1f2' }
                }
            }
        }
    });
}

// ===== GRÁFICO DE LINHA — Serviços por dia =====
function renderLinha(porDia) {
    const ctx = document.getElementById('grafico-dias').getContext('2d');
    if (graficoLinha) graficoLinha.destroy();
    graficoLinha = new Chart(ctx, {
        type: 'line',
        data: {
            labels: porDia.map(d => {
                const [, mes, dia] = d.data.split('-');
                return `${dia}/${mes}`;
            }),
            datasets: [{
                label:                'Serviços',
                data:                 porDia.map(d => d.count),
                borderColor:          '#a1d5d9',
                backgroundColor:      'rgba(161,213,217,0.12)',
                fill:                 true,
                tension:              0.4,
                pointBackgroundColor: '#7bbec3',
                pointRadius:          3,
                pointHoverRadius:     5,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: { ticks: { font: { family: 'Outfit', size: 11 }, maxTicksLimit: 10 } },
                y: {
                    beginAtZero: true,
                    ticks: { stepSize: 1, font: { family: 'Outfit', size: 11 } },
                    grid: { color: '#eef1f2' }
                }
            }
        }
    });
}

// ===== GRÁFICO DE BARRAS — Agendamentos futuros =====
function renderFuturos(futuros) {
    const container = document.getElementById('container-futuros');
    const vazio     = document.getElementById('futuros-vazio');

    if (!futuros || futuros.length === 0) {
        container.style.display = 'none';
        vazio.classList.remove('escondido');
        if (graficoFuturos) { graficoFuturos.destroy(); graficoFuturos = null; }
        return;
    }

    container.style.display = '';
    vazio.classList.add('escondido');

    const ctx = document.getElementById('grafico-futuros').getContext('2d');
    if (graficoFuturos) graficoFuturos.destroy();
    graficoFuturos = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: futuros.map(d => {
                const [, mes, dia] = d.data.split('-');
                return `${dia}/${mes}`;
            }),
            datasets: [{
                data:            futuros.map(d => d.count),
                backgroundColor: '#c4a882',
                hoverBackgroundColor: '#8B5E3C',
                borderRadius:    6,
                borderSkipped:   false,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: { callbacks: { label: ctx => `${ctx.parsed.y} agendamento(s)` } }
            },
            scales: {
                x: { ticks: { font: { family: 'Outfit', size: 11 }, maxRotation: 30 } },
                y: {
                    beginAtZero: true,
                    ticks: { stepSize: 1, font: { family: 'Outfit', size: 11 } },
                    grid: { color: '#eef1f2' }
                }
            }
        }
    });
}

// ===== GRÁFICO — Receita futura por categoria =====
function renderFuturosCategorias(futurosPorCategoria) {
    const container = document.getElementById('container-futuros-cat');
    const vazio     = document.getElementById('futuros-cat-vazio');

    if (!futurosPorCategoria || futurosPorCategoria.length === 0) {
        container.style.display = 'none';
        vazio.classList.remove('escondido');
        if (graficoFuturosCat) { graficoFuturosCat.destroy(); graficoFuturosCat = null; }
        return;
    }

    container.style.display = '';
    vazio.classList.add('escondido');

    const ctx = document.getElementById('grafico-futuros-cat').getContext('2d');
    if (graficoFuturosCat) graficoFuturosCat.destroy();
    graficoFuturosCat = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: futurosPorCategoria.map(c => c.categoria),
            datasets: [{
                data:            futurosPorCategoria.map(c => c.receita),
                backgroundColor: CORES.slice(0, futurosPorCategoria.length),
                borderRadius:    6,
                borderSkipped:   false,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: { callbacks: { label: ctx => formatarReais(ctx.parsed.y) } }
            },
            scales: {
                x: { ticks: { font: { family: 'Outfit', size: 11 }, maxRotation: 30 } },
                y: {
                    beginAtZero: true,
                    ticks: { callback: v => 'R$ ' + v.toLocaleString('pt-BR'), font: { family: 'Outfit', size: 11 } },
                    grid: { color: '#eef1f2' }
                }
            }
        }
    });
}

// ===== CARREGAR DADOS =====
async function carregarDashboard() {
    const dados = await API.getDashboard(diasAtivos);

    document.getElementById('kpi-concluidos').textContent = dados.totalConcluidos;
    document.getElementById('kpi-receita').textContent    = formatarReais(dados.receitaTotal);
    document.getElementById('kpi-ticket').textContent     = formatarReais(dados.ticketMedio);
    document.getElementById('kpi-cancelados').textContent = dados.totalCancelados;

    renderBarras(dados.porCategoria);
    renderLinha(dados.porDia);
    renderFuturos(dados.futuros);
    renderFuturosCategorias(dados.futurosPorCategoria);
}

// ===== AVATAR =====
function redimensionar(file, max = 200) {
    return new Promise(resolve => {
        const reader = new FileReader();
        reader.onload = e => {
            const img = new Image();
            img.onload = () => {
                const scale = Math.min(max / img.width, max / img.height, 1);
                const canvas = document.createElement('canvas');
                canvas.width = img.width * scale; canvas.height = img.height * scale;
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
    img.src = base64; img.classList.add('visivel'); ini.style.display = 'none';
}

(async function initAvatar() {
    const sessao = JSON.parse(localStorage.getItem('blackbil_sessao') || 'null');
    if (!sessao) return;
    document.getElementById('perfil-inicial').textContent = sessao.nome.charAt(0).toUpperCase();
    try { const f = await API.getFuncionario(sessao.id); if (f.foto) aplicarFotoAvatar(f.foto); } catch (e) {}
    document.getElementById('btn-perfil').addEventListener('click', () => document.getElementById('input-foto-perfil').click());
    document.getElementById('input-foto-perfil').addEventListener('change', async e => {
        const file = e.target.files[0]; if (!file) return;
        const base64 = await redimensionar(file);
        aplicarFotoAvatar(base64);
        await API.atualizarFuncionario(sessao.id, { foto: base64 });
        e.target.value = '';
    });
})();

// ===== HAMBURGER =====
const hamburger = document.getElementById('hamburger');
const navMenu   = document.getElementById('nav-menu');
hamburger.addEventListener('click', () => { hamburger.classList.toggle('ativo'); navMenu.classList.toggle('aberto'); });
navMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => { hamburger.classList.remove('ativo'); navMenu.classList.remove('aberto'); }));

// ===== LOGOUT =====
document.getElementById('btn-sair').addEventListener('click', () => {
    localStorage.removeItem('blackbil_sessao');
    window.location.href = '../login/login.html';
});

// ===== INIT =====
carregarDashboard();
