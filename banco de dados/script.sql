CREATE TABLE usuarios (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    tipo VARCHAR(20) DEFAULT 'jogador' CHECK (tipo IN ('jogador')), 
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE capitulos (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    descricao_contexto TEXT,
    situacao_narrativa TEXT NOT NULL,
    ordem INT NOT NULL 
);

CREATE TABLE opcoes (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    capitulo_id INT NOT NULL,
    texto_escolha TEXT NOT NULL,
    consequencia_narrativa TEXT NOT NULL,
    feedback_educativo TEXT NOT NULL,
    e_seguro BOOLEAN DEFAULT FALSE, 
    FOREIGN KEY (capitulo_id) REFERENCES capitulos(id) ON DELETE CASCADE
);

CREATE TABLE escolhas_jogador (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    usuario_id INT NOT NULL,
    capitulo_id INT NOT NULL,
    opcao_id INT NOT NULL,
    resultado BOOLEAN NOT NULL, 
    data_escolha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (capitulo_id) REFERENCES capitulos(id),
    FOREIGN KEY (opcao_id) REFERENCES opcoes(id)
);

CREATE TABLE progresso_jogador (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    usuario_id INT NOT NULL,
    capitulo_atual INT NOT NULL,
    capitulos_concluidos INT DEFAULT 0,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (capitulo_atual) REFERENCES capitulos(id)
);

CREATE TABLE feedbacks (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    capitulo_id INT NOT NULL,
    tipo_feedback VARCHAR(20) CHECK (tipo_feedback IN ('positivo', 'negativo')) NOT NULL,
    mensagem TEXT NOT NULL,
    FOREIGN KEY (capitulo_id) REFERENCES capitulos(id) ON DELETE CASCADE
);

CREATE TABLE logs_atividades (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    usuario_id INT NOT NULL,
    atividade TEXT NOT NULL,
    data_atividade TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);