const titulos = document.querySelectorAll('.titulo-servico');

titulos.forEach(titulo => {
    titulo.addEventListener('click', () => {
        const grupo = titulo.parentElement;

        // fecha todos
        document.querySelectorAll('.grupo-servico')
            .forEach(g => g.classList.remove('ativo'));

        // abre o clicado
        grupo.classList.add('ativo');
    });
});