const express = require('express');
const mysql = require('mysql2');
const app = express();

// Configuração da conexão com o banco de dados 
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'sua_senha',
    database: 'rpg_seguranca_digital'
});

// Rota para buscar um capítulo específico por ID [cite: 32]
app.get('/api/capitulos/:id', (req, res) => {
    const chapterId = req.params.id;

    // Query que une o capítulo com suas opções (JOIN) [cite: 32, 47]
    const sql = `
        SELECT c.*, o.id AS opcao_id, o.texto_escolha, o.consequencia_narrativa, o.feedback_educativo, o.e_seguro
        FROM capitulos c
        LEFT JOIN opcoes o ON c.id = o.capitulo_id
        WHERE c.id = ?
    `;

    db.query(sql, [chapterId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Erro ao buscar dados do banco." });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "Capítulo não encontrado." });
        }

        // Organizando os dados: 1 capítulo com uma lista de opções [cite: 47, 48]
        const capitulo = {
            id: results[0].id,
            titulo: results[0].titulo,
            situacao: results[0].situacao_narrativa,
            opcoes: results.map(row => ({
                id: row.opcao_id,
                texto: row.texto_escolha,
                consequencia: row.consequencia_narrativa,
                feedback: row.feedback_educativo,
                seguro: row.e_seguro
            }))
        };

        res.json(capitulo);
    });
});

app.listen(3000, () => console.log('Servidor rodando na porta 3000'));

async function carregarCapitulo(id) {
    try {
        const resposta = await fetch(`http://localhost:3000/api/capitulos/${id}`);
        const dados = await resposta.json();

        // Atualiza os elementos da "Tela de História e Decisão" [cite: 75-77]
        document.getElementById('titulo-capitulo').innerText = dados.titulo;
        document.getElementById('texto-situacao').innerText = dados.situacao;

        // Limpa e gera os botões de opção dinamicamente 
        const containerOpcoes = document.getElementById('opcoes-escolha');
        containerOpcoes.innerHTML = "";

        dados.opcoes.forEach(opcao => {
            const btn = document.createElement('button');
            btn.innerText = opcao.texto;
            // Ao clicar, chama a função de lógica que criamos anteriormente [cite: 4, 41]
            btn.onclick = () => fazerEscolha(opcao.texto, opcao.seguro, opcao.feedback);
            containerOpcoes.appendChild(btn);
        });

        mostrarTela('tela-historia-decisao');
    } catch (erro) {
        console.error("Erro ao carregar o capítulo:", erro);
    }
}

// Middleware para permitir que o Express entenda JSON no corpo da requisição
app.use(express.json());

app.post('/api/escolhas', (req, res) => {
    const { usuario_id, capitulo_id, opcao_id } = req.body;

    // Validação básica
    if (!usuario_id || !capitulo_id || !opcao_id) {
        return res.status(400).json({ error: "Dados incompletos para registrar escolha." });
    }

    const sql = `INSERT INTO escolhas_jogador (usuario_id, capitulo_id, opcao_id) VALUES (?, ?, ?)`;

    // Uso de placeholders (?) para cumprir o RNF02 (Proteção contra ataques básicos/SQL Injection) 
    db.query(sql, [usuario_id, capitulo_id, opcao_id], (err, result) => {
        if (err) {
            console.error("Erro ao salvar no banco:", err);
            return res.status(500).json({ error: "Erro interno ao salvar progresso." });
        }

        res.status(201).json({ 
            message: "Escolha registrada com sucesso!", 
            registro_id: result.insertId 
        });
    });
});