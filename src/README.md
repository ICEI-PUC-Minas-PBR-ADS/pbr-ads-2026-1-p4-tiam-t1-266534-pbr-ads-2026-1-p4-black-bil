# Código-fonte do projeto


Aqui devem ficar os arquivos-fonte do projeto: HTML, CSS, Javascript, imagens, e outros necessários para o 
funcionamento do sistema.

 **Banco de dados**

   // ================================================================
//  BLACK BIL — Script MongoDB
//  Execute: mongosh < blackbil_mongodb.js
//  Colecoes: clientes, funcionarios, servicos,
//            agendamentos, bloqueios, pagamentos
// ================================================================

db = db.getSiblingDB("blackbil_db");

// ----------------------------------------------------------------
// Limpa colecoes caso o script seja rodado mais de uma vez
// ----------------------------------------------------------------
db.clientes.drop();
db.funcionarios.drop();
db.servicos.drop();
db.agendamentos.drop();
db.bloqueios.drop();
db.pagamentos.drop();

// ================================================================
// 1. CLIENTES
// ================================================================
db.createCollection("clientes");
db.clientes.createIndex({ email: 1 }, { unique: true });

db.clientes.insertMany([
  {
    nome:     "Joao Silva",
    email:    "joao@email.com",
    senha:    "senha123",
    telefone: "(31) 99999-0001",
    criadoEm: new Date("2026-01-10")
  },
  {
    nome:     "Maria Souza",
    email:    "maria@email.com",
    senha:    "senha456",
    telefone: "(31) 99999-0002",
    criadoEm: new Date("2026-02-05")
  },
  {
    nome:     "Pedro Alves",
    email:    "pedro@email.com",
    senha:    "senha789",
    telefone: "(31) 99999-0003",
    criadoEm: new Date("2026-03-15")
  }
]);

print("Clientes inseridos: " + db.clientes.countDocuments());

// ================================================================
// 2. FUNCIONARIOS
// ================================================================
db.createCollection("funcionarios");
db.funcionarios.createIndex({ email: 1 }, { unique: true });

db.funcionarios.insertMany([
  {
    nome:     "Bil Proprietario",
    email:    "bil@blackbil.com",
    senha:    "admin123",
    cargo:    "gerente",
    ativo:    true,
    criadoEm: new Date("2025-06-01")
  },
  {
    nome:     "Carlos Barbeiro",
    email:    "carlos@blackbil.com",
    senha:    "func123",
    cargo:    "barbeiro",
    ativo:    true,
    criadoEm: new Date("2025-08-01")
  }
]);

print("Funcionarios inseridos: " + db.funcionarios.countDocuments());

// ================================================================
// 3. SERVICOS
// ================================================================
db.createCollection("servicos");
db.servicos.createIndex({ categoriaSlug: 1 });

db.servicos.insertMany([
  {
    categoriaSlug:   "cabelos-curtos",
    categoriaTitulo: "Cabelos Curtos",
    nome:            "Corte curto simples",
    preco:           45.00,
    apartirde:       true,
    duracao:         30,
    ativo:           true,
    criadoEm:        new Date()
  },
  {
    categoriaSlug:   "cabelos-curtos",
    categoriaTitulo: "Cabelos Curtos",
    nome:            "Sidecut / Undercut",
    preco:           25.00,
    apartirde:       false,
    duracao:         30,
    ativo:           true,
    criadoEm:        new Date()
  },
  {
    categoriaSlug:   "cabelos-curtos",
    categoriaTitulo: "Cabelos Curtos",
    nome:            "Corte curto + desenho simples",
    preco:           50.00,
    apartirde:       false,
    duracao:         45,
    ativo:           true,
    criadoEm:        new Date()
  },
  {
    categoriaSlug:   "cabelos-curtos",
    categoriaTitulo: "Cabelos Curtos",
    nome:            "Corte curto + desenho grande",
    preco:           55.00,
    apartirde:       false,
    duracao:         60,
    ativo:           true,
    criadoEm:        new Date()
  },
  {
    categoriaSlug:   "cabelos-curtos",
    categoriaTitulo: "Cabelos Curtos",
    nome:            "Corte curto com acabamento fixo",
    preco:           55.00,
    apartirde:       false,
    duracao:         45,
    ativo:           true,
    criadoEm:        new Date()
  },
  {
    categoriaSlug:   "cabelos-curtos",
    categoriaTitulo: "Cabelos Curtos",
    nome:            "Pezinho",
    preco:           20.00,
    apartirde:       false,
    duracao:         15,
    ativo:           true,
    criadoEm:        new Date()
  },
  {
    categoriaSlug:   "cabelos-curtos",
    categoriaTitulo: "Cabelos Curtos",
    nome:            "Realinhamento de cachos curtos",
    preco:           20.00,
    apartirde:       true,
    duracao:         30,
    ativo:           true,
    criadoEm:        new Date()
  },
  {
    categoriaSlug:   "cabelos-curtos",
    categoriaTitulo: "Cabelos Curtos",
    nome:            "Hidratacao simples cabelo curto",
    preco:           50.00,
    apartirde:       true,
    duracao:         45,
    ativo:           true,
    criadoEm:        new Date()
  },
  {
    categoriaSlug:   "cabelos-curtos",
    categoriaTitulo: "Cabelos Curtos",
    nome:            "Cronograma Capilar cabelo curto",
    preco:           150.00,
    apartirde:       true,
    duracao:         90,
    ativo:           true,
    criadoEm:        new Date()
  },
  {
    categoriaSlug:   "combos-curtos",
    categoriaTitulo: "Combos - Cabelos Curtos",
    nome:            "Corte simples + Barba",
    preco:           60.00,
    apartirde:       false,
    duracao:         60,
    ativo:           true,
    criadoEm:        new Date()
  },
  {
    categoriaSlug:   "combos-curtos",
    categoriaTitulo: "Combos - Cabelos Curtos",
    nome:            "Corte simples + Design",
    preco:           60.00,
    apartirde:       false,
    duracao:         60,
    ativo:           true,
    criadoEm:        new Date()
  },
  {
    categoriaSlug:   "combos-curtos",
    categoriaTitulo: "Combos - Cabelos Curtos",
    nome:            "Corte simples + Hidratacao + Finalizacao",
    preco:           75.00,
    apartirde:       false,
    duracao:         75,
    ativo:           true,
    criadoEm:        new Date()
  },
  {
    categoriaSlug:   "combos-curtos",
    categoriaTitulo: "Combos - Cabelos Curtos",
    nome:            "Corte simples + Limpeza Facial Zona T",
    preco:           65.00,
    apartirde:       false,
    duracao:         60,
    ativo:           true,
    criadoEm:        new Date()
  },
  {
    categoriaSlug:   "combos-curtos",
    categoriaTitulo: "Combos - Cabelos Curtos",
    nome:            "Corte simples + Barba + Design de sobrancelhas",
    preco:           75.00,
    apartirde:       false,
    duracao:         75,
    ativo:           true,
    criadoEm:        new Date()
  },
  {
    categoriaSlug:   "combos-curtos",
    categoriaTitulo: "Combos - Cabelos Curtos",
    nome:            "Corte simples + sobrancelhas + Hidratacao + Finalizacao",
    preco:           95.00,
    apartirde:       false,
    duracao:         90,
    ativo:           true,
    criadoEm:        new Date()
  },
  {
    categoriaSlug:   "combos-curtos",
    categoriaTitulo: "Combos - Cabelos Curtos",
    nome:            "Corte simples + Barba + sobrancelhas + Hidratacao + Finalizacao",
    preco:           125.00,
    apartirde:       false,
    duracao:         120,
    ativo:           true,
    criadoEm:        new Date()
  },
  {
    categoriaSlug:   "combos-curtos",
    categoriaTitulo: "Combos - Cabelos Curtos",
    nome:            "Corte + Barba + Design + Hidratacao + Limpeza Facial",
    preco:           155.00,
    apartirde:       false,
    duracao:         150,
    ativo:           true,
    criadoEm:        new Date()
  },
  {
    categoriaSlug:   "cabelos-longos",
    categoriaTitulo: "Cabelos Longos",
    nome:            "Corte longo",
    preco:           70.00,
    apartirde:       true,
    duracao:         60,
    ativo:           true,
    criadoEm:        new Date()
  },
  {
    categoriaSlug:   "cabelos-longos",
    categoriaTitulo: "Cabelos Longos",
    nome:            "Hidratacao simples cabelo longo",
    preco:           85.00,
    apartirde:       true,
    duracao:         60,
    ativo:           true,
    criadoEm:        new Date()
  },
  {
    categoriaSlug:   "cabelos-longos",
    categoriaTitulo: "Cabelos Longos",
    nome:            "Cronograma Capilar 12 hidratacoes",
    preco:           350.00,
    apartirde:       true,
    duracao:         120,
    ativo:           true,
    criadoEm:        new Date()
  },
  {
    categoriaSlug:   "combos-longos",
    categoriaTitulo: "Combos - Cabelos Longos",
    nome:            "Corte longo + Hidratacao + Finalizacao",
    preco:           165.00,
    apartirde:       false,
    duracao:         120,
    ativo:           true,
    criadoEm:        new Date()
  },
  {
    categoriaSlug:   "combos-longos",
    categoriaTitulo: "Combos - Cabelos Longos",
    nome:            "Corte longo + Hidratacao + Finalizacao + Limpeza Facial",
    preco:           180.00,
    apartirde:       false,
    duracao:         135,
    ativo:           true,
    criadoEm:        new Date()
  },
  {
    categoriaSlug:   "rosto",
    categoriaTitulo: "Rosto",
    nome:            "Design de Sobrancelha",
    preco:           35.00,
    apartirde:       false,
    duracao:         20,
    ativo:           true,
    criadoEm:        new Date()
  },
  {
    categoriaSlug:   "rosto",
    categoriaTitulo: "Rosto",
    nome:            "Design com Henna",
    preco:           50.00,
    apartirde:       false,
    duracao:         30,
    ativo:           true,
    criadoEm:        new Date()
  },
  {
    categoriaSlug:   "rosto",
    categoriaTitulo: "Rosto",
    nome:            "Epilacao Rosto",
    preco:           45.00,
    apartirde:       false,
    duracao:         30,
    ativo:           true,
    criadoEm:        new Date()
  },
  {
    categoriaSlug:   "rosto",
    categoriaTitulo: "Rosto",
    nome:            "Epilacao Buco",
    preco:           20.00,
    apartirde:       false,
    duracao:         15,
    ativo:           true,
    criadoEm:        new Date()
  },
  {
    categoriaSlug:   "rosto",
    categoriaTitulo: "Rosto",
    nome:            "Barba",
    preco:           30.00,
    apartirde:       false,
    duracao:         30,
    ativo:           true,
    criadoEm:        new Date()
  },
  {
    categoriaSlug:   "rosto",
    categoriaTitulo: "Rosto",
    nome:            "Limpeza Facial Zona T",
    preco:           25.00,
    apartirde:       false,
    duracao:         25,
    ativo:           true,
    criadoEm:        new Date()
  }
]);

print("Servicos inseridos: " + db.servicos.countDocuments());

// ================================================================
// 4. AGENDAMENTOS
// ================================================================
db.createCollection("agendamentos");
db.agendamentos.createIndex({ clienteId: 1 });
db.agendamentos.createIndex({ data: 1, horario: 1 });
db.agendamentos.createIndex({ status: 1 });

var cliente1 = db.clientes.findOne({ email: "joao@email.com" });
var cliente2 = db.clientes.findOne({ email: "maria@email.com" });
var cliente3 = db.clientes.findOne({ email: "pedro@email.com" });
var srv1 = db.servicos.findOne({ categoriaSlug: "cabelos-curtos", nome: "Corte curto simples" });
var srv2 = db.servicos.findOne({ categoriaSlug: "combos-curtos", nome: "Corte simples + Barba" });
var srv3 = db.servicos.findOne({ categoriaSlug: "rosto", nome: "Barba" });

db.agendamentos.insertMany([
  {
    clienteId:       cliente1._id,
    clienteNome:     "Joao Silva",
    servicoId:       srv1._id,
    servicoNome:     "Corte curto simples",
    categoriaTitulo: "Cabelos Curtos",
    preco:           45.00,
    apartirde:       true,
    duracao:         30,
    data:            "2026-06-10",
    horario:         "09:00",
    status:          "confirmado",
    criadoEm:        new Date("2026-06-08"),
    atualizadoEm:    new Date("2026-06-08")
  },
  {
    clienteId:       cliente2._id,
    clienteNome:     "Maria Souza",
    servicoId:       srv2._id,
    servicoNome:     "Corte simples + Barba",
    categoriaTitulo: "Combos - Cabelos Curtos",
    preco:           60.00,
    apartirde:       false,
    duracao:         60,
    data:            "2026-06-10",
    horario:         "13:00",
    status:          "confirmado",
    criadoEm:        new Date("2026-06-08"),
    atualizadoEm:    new Date("2026-06-08")
  },
  {
    clienteId:       cliente1._id,
    clienteNome:     "Joao Silva",
    servicoId:       srv1._id,
    servicoNome:     "Corte curto simples",
    categoriaTitulo: "Cabelos Curtos",
    preco:           45.00,
    apartirde:       true,
    duracao:         30,
    data:            "2026-05-20",
    horario:         "10:00",
    status:          "concluido",
    criadoEm:        new Date("2026-05-18"),
    atualizadoEm:    new Date("2026-05-20")
  },
  {
    clienteId:       cliente3._id,
    clienteNome:     "Pedro Alves",
    servicoId:       srv3._id,
    servicoNome:     "Barba",
    categoriaTitulo: "Rosto",
    preco:           30.00,
    apartirde:       false,
    duracao:         30,
    data:            "2026-06-12",
    horario:         "15:00",
    status:          "pendente",
    criadoEm:        new Date("2026-06-06"),
    atualizadoEm:    new Date("2026-06-06")
  }
]);

print("Agendamentos inseridos: " + db.agendamentos.countDocuments());

// ================================================================
// 5. BLOQUEIOS
// ================================================================
db.createCollection("bloqueios");
db.bloqueios.createIndex({ data: 1, horario: 1 }, { unique: true });

db.bloqueios.insertMany([
  {
    data:     "2026-06-12",
    horario:  "12:00",
    motivo:   "Feriado - Corpus Christi",
    criadoEm: new Date()
  },
  {
    data:     "2026-06-10",
    horario:  "11:00",
    motivo:   "Pausa para almoco",
    criadoEm: new Date()
  }
]);

print("Bloqueios inseridos: " + db.bloqueios.countDocuments());

// ================================================================
// 6. PAGAMENTOS
// ================================================================
db.createCollection("pagamentos");
db.pagamentos.createIndex({ agendamentoId: 1 });
db.pagamentos.createIndex({ status: 1 });

var ag1 = db.agendamentos.findOne({ clienteNome: "Joao Silva", status: "concluido" });
var ag2 = db.agendamentos.findOne({ clienteNome: "Maria Souza" });
var ag3 = db.agendamentos.findOne({ clienteNome: "Pedro Alves" });

db.pagamentos.insertMany([
  {
    agendamentoId:  ag1._id,
    valor:          45.00,
    formaPagamento: "pix",
    status:         "pago",
    parcelas:       1,
    observacao:     "Pago via Pix",
    dataPagamento:  new Date("2026-05-20"),
    criadoEm:       new Date("2026-05-20"),
    atualizadoEm:   new Date("2026-05-20")
  },
  {
    agendamentoId:  ag2._id,
    valor:          60.00,
    formaPagamento: "cartao_credito",
    status:         "pendente",
    parcelas:       1,
    observacao:     "",
    dataPagamento:  null,
    criadoEm:       new Date(),
    atualizadoEm:   new Date()
  },
  {
    agendamentoId:  ag3._id,
    valor:          30.00,
    formaPagamento: "dinheiro",
    status:         "pendente",
    parcelas:       1,
    observacao:     "",
    dataPagamento:  null,
    criadoEm:       new Date(),
    atualizadoEm:   new Date()
  }
]);

print("Pagamentos inseridos: " + db.pagamentos.countDocuments());

// ================================================================
// RESUMO FINAL
// ================================================================
print("================================================");
print("  Banco blackbil_db criado com sucesso!");
print("  clientes:     " + db.clientes.countDocuments());
print("  funcionarios: " + db.funcionarios.countDocuments());
print("  servicos:     " + db.servicos.countDocuments());
print("  agendamentos: " + db.agendamentos.countDocuments());
print("  bloqueios:    " + db.bloqueios.countDocuments());
print("  pagamentos:   " + db.pagamentos.countDocuments());
print("================================================");

