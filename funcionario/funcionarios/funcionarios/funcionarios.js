// ===== PROTEÇÃO =====
const sessao = JSON.parse(localStorage.getItem('blackbil_sessao') || 'null');
const PODE_GERENCIAR = ['proprietario', 'admin'];
if (!sessao || sessao.tipo !== 'funcionario' || !PODE_GERENCIAR.includes(sessao.role)) {
    window.location.href = '../login/login.html';
}

// ===== ÍCONE DELETAR =====
const ICONE_DELETAR = `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>`;

// ===== ESTADO =====
let _funcionarios = [];

// ===== RENDER =====
function renderLista() {
    const lista = document.getElementById('funcionarios-lista');
    if (_funcionarios.length === 0) {
        lista.innerHTML = '<p class="lista-vazia">Nenhum funcionário cadastrado.</p>';
        return;
    }
    lista.innerHTML = _funcionarios.map(f => {
        const ehEuMesmo = f.id === sessao.id;
        const labelRole  = f.role === 'proprietario' ? 'Proprietário' : f.role === 'admin' ? 'Suporte' : 'Funcionário';
        const classeRole = f.role === 'proprietario' ? 'role-proprietario' : f.role === 'admin' ? 'role-admin' : 'role-funcionario';
        const avatar = f.foto
            ? `<img class="card-foto" src="${f.foto}" alt="${f.nome}">`
            : `<span class="card-inicial">${f.nome.charAt(0).toUpperCase()}</span>`;
        return `
            <div class="funcionario-card">
                <div class="card-avatar">${avatar}</div>
                <div class="funcionario-info">
                    <span class="funcionario-nome">${f.nome}</span>
                    <span class="funcionario-email">${f.email}</span>
                </div>
                <div class="funcionario-direita">
                    <span class="role-badge ${classeRole}">${labelRole}</span>
                    ${!ehEuMesmo ? `<button class="btn-deletar" data-id="${f.id}" title="Remover">${ICONE_DELETAR}</button>` : ''}
                </div>
            </div>`;
    }).join('');

    lista.querySelectorAll('.btn-deletar').forEach(btn => {
        btn.addEventListener('click', () => deletarFuncionario(btn.dataset.id));
    });
}

async function deletarFuncionario(id) {
    const f = _funcionarios.find(x => x.id === id);
    if (!confirm(`Remover "${f.nome}" da equipe?`)) return;
    _funcionarios = _funcionarios.filter(x => x.id !== id);
    renderLista();
    await API.deletarFuncionario(id);
}

// ===== MODAL =====
function abrirModal() {
    document.getElementById('modal-overlay').classList.remove('escondido');
    document.getElementById('input-nome').focus();
}
function fecharModal() {
    document.getElementById('modal-overlay').classList.add('escondido');
    document.getElementById('form-funcionario').reset();
    document.getElementById('erro-form').classList.add('escondido');
}

document.getElementById('btn-adicionar').addEventListener('click', abrirModal);
document.getElementById('modal-fechar').addEventListener('click', fecharModal);
document.getElementById('btn-cancelar').addEventListener('click', fecharModal);
document.getElementById('modal-overlay').addEventListener('click', e => {
    if (e.target.id === 'modal-overlay') fecharModal();
});

document.getElementById('form-funcionario').addEventListener('submit', async e => {
    e.preventDefault();
    const nome  = document.getElementById('input-nome').value.trim();
    const email = document.getElementById('input-email').value.trim();
    const senha = document.getElementById('input-senha').value;
    const role  = document.getElementById('input-role').value;
    const erro  = document.getElementById('erro-form');

    const resultado = await API.criarFuncionario({ nome, email, senha, role });

    if (resultado.erro) {
        erro.textContent = resultado.erro === 'Email já cadastrado'
            ? 'Este e-mail já está em uso.'
            : 'Erro ao criar funcionário. Tente novamente.';
        erro.classList.remove('escondido');
        return;
    }

    _funcionarios.push(resultado);
    renderLista();
    fecharModal();
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
        const idx = _funcionarios.findIndex(f => f.id === sessao.id);
        if (idx !== -1) { _funcionarios[idx].foto = base64; renderLista(); }
        await API.atualizarFuncionario(sessao.id, { foto: base64 });
        e.target.value = '';
    });
})();

// ===== INIT =====
API.getFuncionarios().then(lista => {
    _funcionarios = lista;
    renderLista();
}).catch(console.error);
