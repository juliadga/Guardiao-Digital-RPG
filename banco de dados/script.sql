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

INSERT INTO capitulos (titulo, situacao_narrativa) VALUES
('Capítulo 1: O E-mail Suspeito', 'Você recebeu um e-mail informando que sua conta bancária foi bloqueada. O que você faz?'),
('Capítulo 2: Wi-Fi Grátis', 'Você está em um café e precisa acessar sua conta bancária. O que você faz?'),
('Capítulo 3: Amigo no PIX', 'Um amigo pede dinheiro via PIX, mas parece estranho. O que você faz?'),
('Capítulo 4: Senha Segura', 'Você precisa criar uma senha. O que você faz?'),
('Capítulo 5: Bilhete Premiado', 'Você ganhou um prêmio. O que você faz ao postar?'),
('Capítulo 6: Segurança das Contas', 'Você está configurando segurança. O que você faz?');

INSERT INTO opcoes (capitulo_id, texto_escolha, feedback_educativo, e_seguro) VALUES
(1, 'Clicar no link do e-mail imediatamente', 'Isso pode ser phishing!', false),
(1, 'Acessar o app oficial do banco', 'Boa escolha! Evita golpes.', true);

INSERT INTO opcoes (capitulo_id, texto_escolha, feedback_educativo, e_seguro) VALUES
(2, 'Usar Wi-Fi aberto', 'Perigoso! Pode ser interceptado.', false),
(2, 'Usar dados móveis', 'Conexão mais segura!', true);

INSERT INTO opcoes (capitulo_id, texto_escolha, feedback_educativo, e_seguro) VALUES
(3, 'Enviar dinheiro', 'Pode ser golpe!', false),
(3, 'Confirmar com ligação', 'Boa prática de segurança!', true);

INSERT INTO opcoes (capitulo_id, texto_escolha, feedback_educativo, e_seguro) VALUES
(4, 'Senha 123456', 'Senha fraca!', false),
(4, 'Senha com símbolos', 'Senha forte!', true);

INSERT INTO opcoes (capitulo_id, texto_escolha, feedback_educativo, e_seguro) VALUES
(5, 'Postar QR Code', 'Risco de fraude!', false),
(5, 'Esconder dados', 'Protege sua informação!', true);

INSERT INTO opcoes (capitulo_id, texto_escolha, feedback_educativo, e_seguro) VALUES
(6, 'Desativar 2FA', 'Muito inseguro!', false),
(6, 'Ativar 2FA', 'Excelente proteção!', true);
