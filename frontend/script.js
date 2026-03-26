/**
 * Função responsável por ocultar a tela atual e mostrar a tela desejada.
 * @param {string} idTelaAlvo - O ID da seção HTML que deve ser exibida.
 */
function mostrarTela(idTelaAlvo) {
    // 1. Pega todas as seções que possuem a classe 'tela'
    const telas = document.querySelectorAll('.tela');
    
    // 2. Remove a classe 'ativa' de todas elas (ocultando-as)
    telas.forEach(tela => {
        tela.classList.remove('ativa');
    });

    // 3. Adiciona a classe 'ativa' apenas na tela que foi chamada
    const telaDesejada = document.getElementById(idTelaAlvo);
    if (telaDesejada) {
        telaDesejada.classList.add('ativa');
    } else {
        console.error("Erro: Tela não encontrada - " + idTelaAlvo);
    }
}

// Objeto que representa o Jogador
let jogador = {
    nome: "",
    capitulosConcluidos: 0,
    escolhas: [], // Vai guardar o histórico de cada decisão
    pontuacaoSeguranca: 0 // Opcional: para gamificar o "Perfil de Segurança"
};

function iniciarJogo() {
    const inputNome = document.getElementById('nome-personagem').value;
    
    if (inputNome.trim() === "") {
        alert("Por favor, digite o nome do seu personagem para iniciar a aventura!");
        return;
    }

    // Salva o nome e reseta o status
    jogador.nome = inputNome;
    jogador.escolhas = [];
    jogador.capitulosConcluidos = 0;
    jogador.pontuacaoSeguranca = 0;

    // Vai para a tela de seleção de capítulos
    mostrarTela('tela-selecao-capitulo');
}

/**
 * Registra a decisão do jogador e exibe a consequência
 * @param {string} textoDecisao - O que o jogador escolheu fazer
 * @param {boolean} foiSeguro - Se a escolha foi uma boa prática de segurança
 * @param {string} feedbackEducativo - A explicação da consequência
 */
function fazerEscolha(textoDecisao, foiSeguro, feedbackEducativo) {
    // 1. Registra a escolha no histórico do jogador
    jogador.escolhas.push({
        decisao: textoDecisao,
        seguro: foiSeguro,
        aprendizado: feedbackEducativo
    });

    // 2. Atualiza o progresso e pontuação
    jogador.capitulosConcluidos++;
    if (foiSeguro) {
        jogador.pontuacaoSeguranca += 10; // Ganha pontos por decisões seguras
    }

    // 3. Atualiza a tela de Feedback com a explicação educativa
    document.getElementById('texto-feedback').innerText = feedbackEducativo;
    
    // 4. Mostra a tela de feedback
    mostrarTela('tela-feedback-educativo');
}

function finalizarJogo() {
    // --- PARTE 1: Gerar a História Final ---
    const divResumo = document.getElementById('resumo-decisoes');
    divResumo.innerHTML = ""; // Limpa o conteúdo anterior
    
    let htmlResumo = `<h3>A Jornada de ${jogador.nome}</h3><ul>`;
    
    jogador.escolhas.forEach((escolha, index) => {
        let corTexto = escolha.seguro ? "green" : "red";
        htmlResumo += `
            <li style="margin-bottom: 15px;">
                <strong>Capítulo ${index + 1}:</strong> Você decidiu <em>"${escolha.decisao}"</em>.<br>
                <span style="color: ${corTexto};"><strong>Consequência:</strong> ${escolha.aprendizado}</span>
            </li>
        `;
    });
    
    htmlResumo += `</ul>`;
    divResumo.innerHTML = htmlResumo;

    // --- PARTE 2: Preencher o Perfil de Segurança ---
    document.getElementById('perfil-nome').innerText = jogador.nome;
    
    // Define o nível do jogador baseado nas escolhas seguras
    let nivelSeguranca = "Iniciante";
    if (jogador.pontuacaoSeguranca >= 20) nivelSeguranca = "Especialista em Cibersegurança";
    else if (jogador.pontuacaoSeguranca >= 10) nivelSeguranca = "Sobrevivente Digital";

    // Você precisará adicionar um <span id="perfil-nivel"> no HTML da tela de perfil para isso:
    // document.getElementById('perfil-nivel').innerText = nivelSeguranca;

    // Mostra a tela final
    mostrarTela('tela-historia-final');
}

/**
 * Estende a lógica anterior para persistir os dados no banco de dados.
 */
async function fazerEscolha(textoDecisao, foiSeguro, feedbackEducativo, capituloId, opcaoId) {
    // 1. Lógica visual e imediata (Feedback Educativo) [cite: 41]
    jogador.escolhas.push({ decisao: textoDecisao, seguro: foiSeguro, aprendizado: feedbackEducativo });
    document.getElementById('texto-feedback').innerText = feedbackEducativo;
    mostrarTela('tela-feedback-educativo');

    // 2. Persistência no Banco de Dados (RF04) 
    try {
        const response = await fetch('http://localhost:3000/api/escolhas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                usuario_id: jogador.id, // Supondo que o ID foi guardado no login
                capitulo_id: capituloId,
                opcao_id: opcaoId
            })
        });

        if (!response.ok) throw new Error("Falha ao comunicar com o servidor.");
        console.log("Progresso salvo remotamente.");
    } catch (erro) {
        console.warn("Aviso: Escolha salva apenas localmente. Erro de conexão:", erro);
    }
}

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