// Alternar abas
document.getElementById("btn-login").addEventListener("click", () => {
    document.getElementById("form-login").classList.remove("escondido");
    document.getElementById("form-cadastro").classList.add("escondido");
    document.getElementById("btn-login").classList.add("ativa");
    document.getElementById("btn-cadastro").classList.remove("ativa");
});

document.getElementById("btn-cadastro").addEventListener("click", () => {
    document.getElementById("form-cadastro").classList.remove("escondido");
    document.getElementById("form-login").classList.add("escondido");
    document.getElementById("btn-cadastro").classList.add("ativa");
    document.getElementById("btn-login").classList.remove("ativa");
});

// Redirecionar para agendamento.html
document.querySelectorAll("form").forEach(form => {
    form.addEventListener("submit", e => {
        e.preventDefault();
        window.location.href = "../agendamento/agendamento.html";
    });
});

