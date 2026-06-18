
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

**História 6 (relacionada ao RF-08):**
Como proprietário, quero visualizar a quantidade de atendimentos realizados, para acompanhar o desempenho da barbearia.

**História 7 (relacionada ao RF-09):**
Como proprietário, quero visualizar quais serviços são mais procurados, para planejar promoções e estoque de produtos.

**História 8 (relacionada ao RF-10):**
Como proprietário, quero cadastrar e editar os serviços e produtos do site, para manter as informações sempre atualizadas.

---

## Histórias do Projeto

---

### História 1 (relacionada ao RF-01)

Como cliente,
Eu quero visualizar as informações institucionais da barbearia Black Bil,
Para que eu possa conhecer melhor o estabelecimento antes de visitá-lo

---

### História 2 (relacionada ao RF-02)

Como cliente,
Eu quero visualizar os serviços e produtos oferecidos com seus respectivos preços,
Para que eu possa decidir o que contratar antes de ir até a barbearia.

---

### História 3 (relacionada ao RF-__)

Como cliente,
Eu quero ver os horários de funcionamento da barbearia,
Para que eu saiba quando posso comparecer e ser atendido.

---
 ### História 4 (relacionada ao RF-04)
 
Como cliente,
Eu quero visualizar a localização e o endereço da barbearia no mapa,
Para que eu possa me orientar e chegar com facilidade ao estabelecimento.

---
### História 5 (relacionada ao RF-05)
Como cliente,
Eu quero acessar os canais de contato da barbearia,
Para que eu possa tirar dúvidas ou agendar um horário com facilidade.

---
### História 6 (relacionada ao RF-06)
Como funcionário,
Eu quero fazer login em uma área restrita do site,
Para que eu possa acessar informações exclusivas do negócio com segurança.

---

### História 7 (relacionada ao RF-07)
Como funcionário,
Eu quero registrar os atendimentos realizados no sistema,
Para que o histórico de serviços seja mantido atualizado.

---

### História 8 (relacionada ao RF-08)
Como proprietário,
Eu quero visualizar a quantidade de atendimentos realizados no dashboard,
Para que eu possa acompanhar o desempenho da barbearia.

---
### História 9 (relacionada ao RF-09)
Como proprietário,
Eu quero visualizar quais serviços são mais procurados pelos clientes,
Para que eu possa planejar promoções e melhorar a oferta do negócio.

---
### História 10 (relacionada ao RF-10)
Como proprietário,
Eu quero cadastrar e editar os serviços e produtos exibidos no site,
Para que as informações estejam sempre atualizadas para os clientes.

---

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
| RNF-03 | O sistema deve ser responsivo, adaptando-se a diferentes tamanhos de tela (desktop, tablet e mobile). | 🔴 ALTA |
| RNF-04 |  O sistema deve ter uma interface simples e intuitiva, permitindo que qualquer usuário navegue sem dificuldades.  | 🔴 ALTA  |
| RNF-05 | O sistema deve estar disponível 24 horas por dia, 7 dias por semana.| 🟡 MÉDIA  |
| RNF-06 | A área restrita de funcionários deve exigir autenticação segura para acesso. |🔴 ALTA|
| RNF-07 |  O sistema deve ser compatível com os principais navegadores do mercado (Chrome, Firefox, Edge e Safari).| 🟡 MÉDIA  | 



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
| R-04 |   O banco de dados utilizado deve ser gratuito e de fácil configuração, compatível com o ambiente de desenvolvimento da equipe.  |
| R-05 |  A interface deve ser desenvolvida em português, voltada ao público brasileiro.  |
| R-06 |  O código-fonte do projeto deverá ser versionado utilizando o Git/GitHub  |
| R-07 |  O sistema não deve armazenar dados sensíveis de cartão de crédito ou informações financeiras dos clientes.  |
| R-08 |  O sistema deve ser compatível com os principais tamanhos de tela de dispositivos móveis (smartphones e tablets).  |

---

# ✅ Checklist de Validação

Antes de entregar, confirme:

- [✅] Todos os RFs estão claros e numerados corretamente  
- [✅] Todas as Histórias estão associadas a um RF  
- [✅] RNFs estão mensuráveis  
- [✅] Restrições são realmente limitações externas  
- [✅] O documento está atualizado no GitHub  

---



> **Links Úteis**:
> - [O que são Requisitos Funcionais e Requisitos Não Funcionais?](https://codificar.com.br/requisitos-funcionais-nao-funcionais/)
> - [O que são requisitos funcionais e requisitos não funcionais?](https://analisederequisitos.com.br/requisitos-funcionais-e-requisitos-nao-funcionais-o-que-sao/)
