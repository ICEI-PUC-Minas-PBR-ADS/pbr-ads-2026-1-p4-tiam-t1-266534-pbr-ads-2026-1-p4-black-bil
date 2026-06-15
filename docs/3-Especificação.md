
# 3. Especificações do Projeto

📌 **Pré-requisito:** Planejamento do Projeto (Cronograma e Sprints definidos).

Nesta seção serão detalhados:

- ✅ Requisitos Funcionais  
- ✅ Histórias de Usuário  
- ✅ Requisitos Não Funcionais  
- ✅ Restrições do Projeto  

O objetivo é organizar claramente as funcionalidades, qualidades e limites da solução.

---

# 3.1 Requisitos Funcionais

Os **Requisitos Funcionais (RF)** descrevem o que o sistema deve fazer.

📌 Cada requisito deve:
- Representar uma funcionalidade única
- Ser claro e objetivo
- Orientar diretamente o desenvolvimento

---

## Tabela de Requisitos Funcionais

| ID    | Descrição do Requisito | Prioridade |
|-------|------------------------|------------|
| RF-01 | O sistema deve permitir que os usuários criem uma conta informando nome, e-mail, senha e endereço. | 🔴 ALTA |
| RF-02 | O sistema deve permitir que os usuários adicionem produtos ao carrinho de compras. | 🟡 MÉDIA |
| RF-03 | O sistema deve exibir os horários de funcionamento da barbearia. | 🔴Alta |
| RF-04 | O sistema deve permitir que funcionários façam login na área de funcionarios | (Alta/Média/Baixa) |
| RF-05 | O sistema deve exibir um dashboard com a quantidade de atendimentos realizados | 🟢Baixa |
| RF-06 | O sistema deve permitir que o proprietário cadastre e edite os serviços/produtos exibidos no site. | Média🟡 |

---

# 3.2 Histórias de Usuário

Cada história deve seguir o padrão ensinado na disciplina:

> **Como** [persona],  
> **eu quero** [funcionalidade],  
> **para que** [benefício].

⚠️ **ATENÇÃO:**  
Cada História de Usuário deve estar associada a um Requisito Funcional específico (RF-XX).

---

## Exemplos

**História 1 (relacionada ao RF-02):**
Como cliente, quero visualizar os serviços e produtos oferecidos com seus preços, para decidir o que contratar antes de ir até a barbearia.

**História 2 (relacionada ao RF-03):**
Como cliente, quero ver os horários de funcionamento da barbearia, para saber quando posso ser atendido.

**História 3 (relacionada ao RF-05):**
Como cliente, quero acessar os contatos da barbearia, para tirar dúvidas ou agendar um horário.

**História 4 (relacionada ao RF-06):**
Como funcionário, quero fazer login na área restrita, para acessar informações exclusivas do negócio.

**História 5 (relacionada ao RF-07):**
Como funcionário, quero registrar os atendimentos realizados, para manter o histórico de serviços atualizado.

---

## Histórias do Projeto

---

### História 1 (relacionada ao RF-01)

Como __________________________________________  
Eu quero _______________________________________  
Para que _______________________________________

---

### História 2 (relacionada ao RF-02)

Como __________________________________________  
Eu quero _______________________________________  
Para que _______________________________________

---

### História 3 (relacionada ao RF-__)

Como __________________________________________  
Eu quero _______________________________________  
Para que _______________________________________

---

> 💡 Dica: Agrupe as histórias por módulo (Cadastro, Relatórios, Pagamentos, etc.) para melhor organização.

---

# 3.3 Requisitos Não Funcionais

Os **Requisitos Não Funcionais (RNF)** definem características de qualidade do sistema, como:

- ⚡ Desempenho  
- 🔒 Segurança  
- 🎨 Usabilidade  
- 📈 Escalabilidade  
- 🌐 Compatibilidade  

Eles garantem a qualidade da solução.

---

## Tabela de Requisitos Não Funcionais

| ID     | Descrição do Requisito | Prioridade |
|--------|------------------------|------------|
| RNF-01 | O sistema deve carregar as páginas em até 3 segundos. | 🟡 MÉDIA |
| RNF-02 | O sistema deve proteger as informações dos clientes por meio de criptografia. | 🔴 ALTA |
| RNF-03 | (Descreva aqui o requisito não funcional 3 do seu sistema) | (Alta/Média/Baixa) |
| RNF-04 | (Descreva aqui o requisito não funcional 4 do seu sistema) | (Alta/Média/Baixa) |
| RNF-05 | (Descreva aqui o requisito não funcional 5 do seu sistema) | (Alta/Média/Baixa) |
| RNF-06 | (Descreva aqui o requisito não funcional 6 do seu sistema) | (Alta/Média/Baixa) |

---

# 3.4 Restrições do Projeto

📌 **Restrições** são limitações externas impostas ao projeto.

Elas podem envolver:
- 📅 Prazo
- 🖥️ Tecnologia obrigatória ou proibida
- 🌐 Ambiente de execução
- 📜 Normas legais
- 🏢 Políticas institucionais

⚠️ Diferente dos RNFs, as restrições impõem **limites fixos** ao projeto.

---

## Tabela de Restrições

| ID  | Restrição |
|-----|-----------|
| R-01 | O projeto deverá ser entregue até o final do semestre. |
| R-02 | O sistema deve funcionar apenas dentro da rede interna da empresa. |
| R-03 | O software deve ser compatível com Windows e Linux. |
| R-04 | (Descreva aqui a restrição 4 do seu projeto) |
| R-05 | (Descreva aqui a restrição 5 do seu projeto) |
| R-06 | (Descreva aqui a restrição 6 do seu projeto) |
| R-07 | (Descreva aqui a restrição 7 do seu projeto) |
| R-08 | (Descreva aqui a restrição 8 do seu projeto) |

---

# ✅ Checklist de Validação

Antes de entregar, confirme:

- [ ] Todos os RFs estão claros e numerados corretamente  
- [ ] Todas as Histórias estão associadas a um RF  
- [ ] RNFs estão mensuráveis  
- [ ] Restrições são realmente limitações externas  
- [ ] O documento está atualizado no GitHub  

---



> **Links Úteis**:
> - [O que são Requisitos Funcionais e Requisitos Não Funcionais?](https://codificar.com.br/requisitos-funcionais-nao-funcionais/)
> - [O que são requisitos funcionais e requisitos não funcionais?](https://analisederequisitos.com.br/requisitos-funcionais-e-requisitos-nao-funcionais-o-que-sao/)
