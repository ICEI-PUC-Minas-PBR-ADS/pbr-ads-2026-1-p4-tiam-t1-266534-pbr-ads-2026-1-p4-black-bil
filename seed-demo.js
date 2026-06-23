require('dotenv').config();
const { MongoClient } = require('mongodb');

const SERVICOS_DEMO = [
    { servico: 'Corte curto simples (máquina, raspado, disfarçado)', categoria: 'Cabelos Curtos', preco: 45, duracao: 30 },
    { servico: 'Corte curto + desenho simples',                       categoria: 'Cabelos Curtos', preco: 50, duracao: 45 },
    { servico: 'Corte curto com acabamento fixo',                     categoria: 'Cabelos Curtos', preco: 55, duracao: 45 },
    { servico: 'Pézinho',                                             categoria: 'Cabelos Curtos', preco: 20, duracao: 30 },
    { servico: 'Corte simples + Barba',                               categoria: 'Combos — Curtos', preco: 60, duracao: 60 },
    { servico: 'Corte simples + Hidratação + Finalização',            categoria: 'Combos — Curtos', preco: 75, duracao: 90 },
    { servico: 'Corte simples + Barba + Design de sobrancelhas',      categoria: 'Combos — Curtos', preco: 75, duracao: 90 },
    { servico: 'Corte + Barba + Design + Hidratação + Limpeza Facial',categoria: 'Combos — Curtos', preco: 155, duracao: 150 },
    { servico: 'Corte longo',                                         categoria: 'Cabelos Longos', preco: 70, duracao: 60 },
    { servico: 'Hidratação simples',                                  categoria: 'Cabelos Longos', preco: 85, duracao: 60 },
    { servico: 'Corte longo + Hidratação + Finalização',              categoria: 'Combos — Longos', preco: 165, duracao: 120 },
    { servico: 'Design de Sobrancelha',                               categoria: 'Rosto', preco: 35, duracao: 30 },
    { servico: 'Barba',                                               categoria: 'Rosto', preco: 30, duracao: 30 },
    { servico: 'Limpeza Facial Zona T',                               categoria: 'Rosto', preco: 25, duracao: 30 },
];

const CLIENTES_DEMO = [
    { nome: 'Ana Lima',        telefone: '(31) 99801-2345' },
    { nome: 'Bruno Souza',     telefone: '(31) 98712-3456' },
    { nome: 'Carla Matos',     telefone: '(31) 97623-4567' },
    { nome: 'Diego Ferreira',  telefone: '(31) 96534-5678' },
    { nome: 'Elena Costa',     telefone: '(31) 95445-6789' },
    { nome: 'Felipe Santos',   telefone: '(31) 94356-7890' },
    { nome: 'Gabriela Rocha',  telefone: '(31) 93267-8901' },
    { nome: 'Henrique Alves',  telefone: '(31) 92178-9012' },
    { nome: 'Isabela Nunes',   telefone: '(31) 91089-0123' },
    { nome: 'João Ribeiro',    telefone: '(31) 90900-1234' },
];

const HORARIOS = ['09:00','09:30','10:00','10:30','11:00','13:00','13:30','14:00','14:30','15:00','15:30','16:00','16:30','17:00','17:30','18:00','18:30','19:00'];

function rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function isoData(d) { return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; }

async function main() {
    const client = new MongoClient(process.env.MONGO_URI);
    await client.connect();
    const db = client.db('blackbil_db');

    const jaExiste = await db.collection('agendamentos').findOne({ clienteNome: 'Ana Lima' });
    if (jaExiste) {
        console.log('Dados demo já existem no banco. Encerrando sem inserir duplicatas.');
        await client.close(); return;
    }

    const agendamentos = [];
    const hoje = new Date(); hoje.setHours(0,0,0,0);

    for (let diasAtras = 90; diasAtras >= 1; diasAtras--) {
        const data = new Date(hoje);
        data.setDate(data.getDate() - diasAtras);
        const diaSemana = data.getDay();
        if (diaSemana === 0 || diaSemana === 1) continue;

        const qtd = Math.floor(Math.random() * 5) + 2;
        const horariosUsados = new Set();

        for (let i = 0; i < qtd; i++) {
            let horario;
            let tentativas = 0;
            do { horario = rand(HORARIOS); tentativas++; } while (horariosUsados.has(horario) && tentativas < 20);
            if (horariosUsados.has(horario)) continue;
            horariosUsados.add(horario);

            const servico = rand(SERVICOS_DEMO);
            const cliente = rand(CLIENTES_DEMO);
            const status  = Math.random() < 0.08 ? 'cancelado' : 'concluido';

            agendamentos.push({
                clienteId:       null,
                clienteNome:     cliente.nome,
                clienteTelefone: cliente.telefone,
                servico:         servico.servico,
                categoria:       servico.categoria,
                preco:           servico.preco,
                duracao:         servico.duracao,
                apartirde:       false,
                data:            isoData(data),
                horario,
                status,
            });
        }
    }

    const result = await db.collection('agendamentos').insertMany(agendamentos);
    console.log(`✓ ${result.insertedCount} agendamentos demo inseridos (últimos 90 dias).`);
    await client.close();
}

main().catch(e => { console.error(e); process.exit(1); });
