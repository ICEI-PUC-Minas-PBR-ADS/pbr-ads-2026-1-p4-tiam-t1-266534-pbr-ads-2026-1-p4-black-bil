const API = (() => {
    const BASE = '/api';

    async function req(method, rota, corpo) {
        const opts = { method, headers: { 'Content-Type': 'application/json' } };
        if (corpo !== undefined) opts.body = JSON.stringify(corpo);
        const r = await fetch(BASE + rota, opts);
        return r.json();
    }

    function qs(params) {
        const q = new URLSearchParams(params).toString();
        return q ? '?' + q : '';
    }

    return {
        // Clientes
        loginCliente:     (email, senha) => req('POST', '/clientes/login',    { email, senha }),
        registrarCliente: (dados)        => req('POST', '/clientes/registro', dados),

        // Funcionários
        loginFuncionario: (email, senha) => req('POST', '/funcionarios/login', { email, senha }),

        // Agendamentos
        getAgendamentos:      (params = {}) => req('GET',   '/agendamentos' + qs(params)),
        criarAgendamento:     (dados)       => req('POST',  '/agendamentos', dados),
        atualizarAgendamento: (id, dados)   => req('PATCH', `/agendamentos/${id}`, dados),

        // Serviços
        getServicos:      ()              => req('GET',    '/servicos'),
        salvarCategoria:  (slug, dados)   => req('PUT',    `/servicos/${slug}`, dados),
        deletarCategoria: (slug)          => req('DELETE', `/servicos/${slug}`),

        // Bloqueios de slot
        getBloqueios:    (data)           => req('GET',    '/bloqueios' + qs(data ? { data } : {})),
        bloquearSlot:    (data, horario)  => req('POST',   '/bloqueios', { data, horario }),
        desbloquearSlot: (data, horario)  => req('DELETE', `/bloqueios?data=${data}&horario=${encodeURIComponent(horario)}`),

        // Dias bloqueados
        getDiasBloqueados: ()             => req('GET',    '/dias-bloqueados'),
        bloquearDia:       (data)         => req('POST',   '/dias-bloqueados', { data }),
        desbloquearDia:    (data)         => req('DELETE', `/dias-bloqueados/${data}`),
    };
})();
