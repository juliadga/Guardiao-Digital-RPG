/**
 * @param {string} idTelaAlvo 
 */
function mostrarTela(idTelaAlvo) {
    console.log(`Mudando para a tela: ${idTelaAlvo}`);
    
    const telas = document.querySelectorAll('.tela');
    telas.forEach(tela => {
        tela.classList.remove('ativa');
    });

    const telaDesejada = document.getElementById(idTelaAlvo);
    if (telaDesejada) {
        telaDesejada.classList.add('ativa');
    } else {
        console.error("Erro: Tela não encontrada - " + idTelaAlvo);
    }
}

let progresso = {
    nome: "",
    capitulosConcluidos: 0,
    historicoEscolhas: []
};

let jogador = {
    nome: "",
    capitulosConcluidos: 0,
    escolhas: []
};

function iniciarJogo() {
    const inputNome = document.getElementById('nome-personagem').value;
    
    if (inputNome.trim() === "") {
        alert("Por favor, digite o nome do seu personagem para iniciar a aventura!");
        return;
    }

    jogador.nome = inputNome;
    jogador.capitulosConcluidos = 0;
    jogador.escolhas = [];

    console.log("Jogador iniciado:", jogador);

    const perfilNome = document.getElementById('perfil-nome');
    if (perfilNome) {
        perfilNome.innerText = jogador.nome;
    }

    mostrarTela('tela-selecao-capitulo');
}

/**
 * @param {string} textoDecisao 
 * @param {boolean} foiSeguro 
 * @param {string} feedbackEducativo 
 */
function fazerEscolha(textoDecisao, foiSeguro, feedbackEducativo) {
    jogador.escolhas.push({
        decisao: textoDecisao,
        seguro: foiSeguro,
        aprendizado: feedbackEducativo
    });

    jogador.capitulosConcluidos++;

    document.getElementById('texto-feedback').innerText = feedbackEducativo;
    
    mostrarTela(foiSeguro ? 'tela-feedback-educativo' : 'tela-feedback-negativo');
}

function finalizarJogo() {
    const divResumo = document.getElementById('resumo-decisoes');
    divResumo.innerHTML = ""; 
    
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

    document.getElementById('perfil-nome').innerText = jogador.nome;

    mostrarTela('tela-historia-final');
}

const express = require('express');
const mysql = require('mysql2');
const app = express();

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'sua_senha',
    database: 'rpg_seguranca_digital'
});

app.get('/api/capitulos/:id', (req, res) => {
    const chapterId = req.params.id;

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

        document.getElementById('titulo-capitulo').innerText = dados.titulo;
        document.getElementById('texto-situacao').innerText = dados.situacao;

        const containerOpcoes = document.getElementById('opcoes-escolha');
        containerOpcoes.innerHTML = "";

        dados.opcoes.forEach(opcao => {
            const btn = document.createElement('button');
            btn.innerText = opcao.texto;
            btn.onclick = () => fazerEscolha(opcao.texto, opcao.seguro, opcao.feedback);
            containerOpcoes.appendChild(btn);
        });

        mostrarTela('tela-historia-decisao');
    } catch (erro) {
        console.error("Erro ao carregar o capítulo:", erro);
    }
}

app.use(express.json());

app.post('/api/escolhas', (req, res) => {
    const { usuario_id, capitulo_id, opcao_id } = req.body;

    if (!usuario_id || !capitulo_id || !opcao_id) {
        return res.status(400).json({ error: "Dados incompletos para registrar escolha." });
    }

    const sql = `INSERT INTO escolhas_jogador (usuario_id, capitulo_id, opcao_id) VALUES (?, ?, ?)`;

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

function atualizarProgresso(capitulo, escolhaCorreta) {
    console.log(`Capítulo: ${capitulo}, Escolha correta: ${escolhaCorreta}`);

    progresso.capitulosConcluidos++;
    progresso.historicoEscolhas.push({
        capitulo: capitulo,
        escolhaCorreta: escolhaCorreta
    });

    console.log("Progresso atualizado:", jogador);
}

function mostrarProgresso() {
    document.getElementById("perfil-nome").innerText = progresso.nome;
    document.querySelector("#tela-perfil-progresso p:nth-child(3)").innerText = 
        `Capítulos concluídos: ${progresso.capitulosConcluidos}`;
    document.querySelector("#tela-perfil-progresso p:nth-child(4)").innerText = 
        `Histórico de escolhas: ${progresso.historicoEscolhas.map(e => 
            `Capítulo ${e.capitulo}: ${e.escolhaCorreta ? "Correta" : "Errada"}`).join(", ")}`;
}

function mostrarTela(telaId) {
    document.querySelectorAll(".tela").forEach(tela => tela.classList.remove("ativa"));
    document.getElementById(telaId).classList.add("ativa");

    if (telaId === "tela-perfil-progresso") {
        mostrarProgresso();
    }
}