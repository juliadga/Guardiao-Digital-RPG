CREATE DATABASE IF NOT EXISTS rpg_seguranca_digital;
USE rpg_seguranca_digital;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    tipo ENUM('jogador', 'admin') DEFAULT 'jogador', 
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE capitulos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    descricao_contexto TEXT,
    situacao_narrativa TEXT NOT NULL,
    ordem INT NOT NULL 
);

CREATE TABLE opcoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    capitulo_id INT NOT NULL,
    texto_escolha TEXT NOT NULL,
    consequencia_narrativa TEXT NOT NULL,
    feedback_educativo TEXT NOT NULL,
    e_seguro BOOLEAN DEFAULT FALSE, 
    FOREIGN KEY (capitulo_id) REFERENCES capitulos(id) ON DELETE CASCADE
);

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