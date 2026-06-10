// ===== ABAS =====
const btnLogin      = document.getElementById('btn-login');
const btnCadastro   = document.getElementById('btn-cadastro');
const formLogin     = document.getElementById('form-login');
const formCadastro  = document.getElementById('form-cadastro');
const formTitulo    = document.getElementById('form-titulo');
const formSubtitulo = document.getElementById('form-subtitulo');

btnLogin.addEventListener('click', () => {
    formLogin.classList.remove('escondido');
    formCadastro.classList.add('escondido');
    btnLogin.classList.add('ativa');
    btnCadastro.classList.remove('ativa');
    formTitulo.textContent    = 'Bem-vindo(a) de volta';
    formSubtitulo.textContent = 'Acesse sua conta para agendar seu atendimento';
});

btnCadastro.addEventListener('click', () => {
    formCadastro.classList.remove('escondido');
    formLogin.classList.add('escondido');
    btnCadastro.classList.add('ativa');
    btnLogin.classList.remove('ativa');
    formTitulo.textContent    = 'Criar sua conta';
    formSubtitulo.textContent = 'Junte-se ao Black Bil e agende com facilidade';
});

// ===== TOGGLE SENHA =====
document.querySelectorAll('.btn-olho').forEach(btn => {
    btn.addEventListener('click', () => {
        const input       = document.getElementById(btn.dataset.target);
        const olhoAberto  = btn.querySelector('.olho-aberto');
        const olhoFechado = btn.querySelector('.olho-fechado');
        if (input.type === 'password') {
            input.type = 'text';
            olhoAberto.classList.add('escondido');
            olhoFechado.classList.remove('escondido');
        } else {
            input.type = 'password';
            olhoAberto.classList.remove('escondido');
            olhoFechado.classList.add('escondido');
        }
    });
});

// ===== SUBMIT LOGIN =====
formLogin.addEventListener('submit', async e => {
    e.preventDefault();

    const email = formLogin.querySelector('input[type="email"]').value.trim().toLowerCase();
    const senha = document.getElementById('senha-login').value;
    const erro  = document.getElementById('erro-login');

    const resultado = await API.loginCliente(email, senha);

    if (resultado.erro) {
        erro.classList.remove('escondido');
        return;
    }

    erro.classList.add('escondido');
    localStorage.setItem('blackbil_sessao', JSON.stringify(resultado));
    window.location.href = '../agendamento/agendamento.html';
});

// ===== SUBMIT CADASTRO =====
formCadastro.addEventListener('submit', async e => {
    e.preventDefault();

    const nome      = formCadastro.querySelector('input[type="text"]').value.trim();
    const telefone  = formCadastro.querySelector('input[type="tel"]').value.trim();
    const email     = formCadastro.querySelector('input[type="email"]').value.trim().toLowerCase();
    const senha     = document.getElementById('senha-cad').value;
    const conf      = document.getElementById('senha-conf').value;
    const erroSenha = document.getElementById('erro-senha');
    const erroEmail = document.getElementById('erro-email');

    erroSenha.classList.add('escondido');
    erroEmail.classList.add('escondido');

    if (senha !== conf) {
        erroSenha.classList.remove('escondido');
        return;
    }

    const resultado = await API.registrarCliente({ nome, email, senha, telefone });

    if (resultado.erro) {
        erroEmail.classList.remove('escondido');
        return;
    }

    localStorage.setItem('blackbil_sessao', JSON.stringify(resultado));
    window.location.href = '../agendamento/agendamento.html';
});
