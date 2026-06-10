// ===== TOGGLE SENHA =====
document.querySelectorAll('.btn-olho').forEach(btn => {
    btn.addEventListener('click', () => {
        const input      = document.getElementById(btn.dataset.target);
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
document.getElementById('form-login').addEventListener('submit', async e => {
    e.preventDefault();

    const email = document.getElementById('input-email').value.trim().toLowerCase();
    const senha = document.getElementById('input-senha').value;
    const erro  = document.getElementById('erro-login');

    const resultado = await API.loginFuncionario(email, senha);

    if (resultado.erro) {
        erro.classList.remove('escondido');
        return;
    }

    erro.classList.add('escondido');
    localStorage.setItem('blackbil_sessao', JSON.stringify(resultado));
    window.location.href = '../agenda/agenda.html';
});
