-- Criação do Banco de Dados
CREATE DATABASE IF NOT EXISTS rpg_seguranca_digital;
USE rpg_seguranca_digital;

-- 1. Tabela de Usuários (Jogadores e Administradores)
-- Atende aos requisitos de Entidades [cite: 30, 31] e Segurança [cite: 51]
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    tipo ENUM('jogador', 'admin') DEFAULT 'jogador', -- [cite: 31, 51]
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabela de Capítulos
-- Armazena o conteúdo educativo e a situação narrativa [cite: 32, 45]
CREATE TABLE capitulos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    descricao_contexto TEXT,
    situacao_narrativa TEXT NOT NULL,
    ordem INT NOT NULL -- Para definir a sequência dos capítulos no mapa [cite: 26]
);

-- 3. Tabela de Opções e Consequências
-- Define as perguntas, opções e o feedback educativo [cite: 32, 47, 48]
CREATE TABLE opcoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    capitulo_id INT NOT NULL,
    texto_escolha TEXT NOT NULL,
    consequencia_narrativa TEXT NOT NULL,
    feedback_educativo TEXT NOT NULL,
    e_seguro BOOLEAN DEFAULT FALSE, -- Usado para o Perfil de Segurança Digital [cite: 43]
    FOREIGN KEY (capitulo_id) REFERENCES capitulos(id) ON DELETE CASCADE
);

-- 4. Tabela de Progresso e Escolhas (Relacionamento Jogador vs Decisões)
-- Essencial para gerar a história personalizada ao final [cite: 40, 42, 64]
CREATE TABLE escolhas_jogador (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    capitulo_id INT NOT NULL,
    opcao_id INT NOT NULL,
    data_escolha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (capitulo_id) REFERENCES capitulos(id),
    FOREIGN KEY (opcao_id) REFERENCES opcoes(id)
);