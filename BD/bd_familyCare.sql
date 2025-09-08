-- =====================================================
-- FAMILYCARE DATABASE - COMPLETE AND UPDATED
-- Sistema de Cuidado Familiar para Idosos
-- =====================================================

-- Criação e popularização do banco FamilyCare para ambiente de testes
CREATE DATABASE IF NOT EXISTS familycare;
USE familycare;

-- =====================================================
-- TABELAS PRINCIPAIS
-- =====================================================

-- Tabela de usuários (cuidadores)
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    telefone VARCHAR(20),
    email VARCHAR(100) NOT NULL UNIQUE,
    senhaHash VARCHAR(255) NOT NULL,
    criadoEm DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS recados (
  id INT AUTO_INCREMENT PRIMARY KEY,
  familia_id INT NOT NULL,
  usuario VARCHAR(150) NOT NULL,
  mensagem TEXT NOT NULL,
  status ENUM('enviado','entregue','lido') NOT NULL DEFAULT 'enviado',
  data_hora TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_recados_familia_id (familia_id),
  INDEX idx_recados_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabela de idosos
CREATE TABLE IF NOT EXISTS idosos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    idade INT,
    sexo ENUM('Masculino', 'Feminino', 'Outro'),
    altura INT, -- Altura em centímetros
    peso DECIMAL(5,2),
    carteiraSUS VARCHAR(30),
    contatoEmergenciaNome VARCHAR(100),
    contatoEmergenciaTelefone VARCHAR(20),
    telefone VARCHAR(20),
    email VARCHAR(100) UNIQUE,
    senhaHash VARCHAR(255),
    cuidadorId INT,
    criadoEm DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cuidadorId) REFERENCES usuarios(id) ON DELETE SET NULL
);

-- Tabela de famílias
CREATE TABLE IF NOT EXISTS familias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    codigoEspecial VARCHAR(50) NOT NULL UNIQUE,
    criadoEm DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABELAS ASSOCIATIVAS
-- =====================================================

-- Associativa: usuarios (cuidadores) vinculados a famílias
CREATE TABLE IF NOT EXISTS usuarios_familias (
    usuarioId INT NOT NULL,
    familiaId INT NOT NULL,
    PRIMARY KEY (usuarioId, familiaId),
    FOREIGN KEY (usuarioId) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (familiaId) REFERENCES familias(id) ON DELETE CASCADE
);

-- Associativa: idosos vinculados a famílias
CREATE TABLE IF NOT EXISTS familias_idosos (
    familiaId INT NOT NULL,
    idosoId INT NOT NULL,
    PRIMARY KEY (familiaId, idosoId),
    FOREIGN KEY (familiaId) REFERENCES familias(id) ON DELETE CASCADE,
    FOREIGN KEY (idosoId) REFERENCES idosos(id) ON DELETE CASCADE
);

-- =====================================================
-- TABELAS MÉDICAS
-- =====================================================

-- Tabela de condições médicas normalizada
CREATE TABLE IF NOT EXISTS condicoes_medicas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE
);

-- Relação N:N entre idosos e condições
CREATE TABLE IF NOT EXISTS idosos_condicoes (
    idosoId INT NOT NULL,
    condicaoId INT NOT NULL,
    PRIMARY KEY (idosoId, condicaoId),
    FOREIGN KEY (idosoId) REFERENCES idosos(id) ON DELETE CASCADE,
    FOREIGN KEY (condicaoId) REFERENCES condicoes_medicas(id) ON DELETE CASCADE
);

-- Tabela de remédios
CREATE TABLE IF NOT EXISTS remedios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    horario TIME NOT NULL,
    familiaId INT NOT NULL,
    idosoId INT,
    tomado BOOLEAN DEFAULT FALSE,
    criadoEm DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (familiaId) REFERENCES familias(id) ON DELETE CASCADE,
    FOREIGN KEY (idosoId) REFERENCES idosos(id) ON DELETE SET NULL
);

-- =====================================================
-- TABELAS DE ALERTAS
-- =====================================================

-- Tabela de alertas com localização e data
CREATE TABLE IF NOT EXISTS alertas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    idosoId INT NOT NULL,
    tipo VARCHAR(50),
    dataAlerta DATETIME DEFAULT CURRENT_TIMESTAMP,
    latitude DECIMAL(9,6),
    longitude DECIMAL(9,6),
    status ENUM('ativo', 'respondido', 'resolvido') DEFAULT 'ativo',
    FOREIGN KEY (idosoId) REFERENCES idosos(id) ON DELETE CASCADE
);

-- Tabela para rastrear respostas aos alertas
CREATE TABLE IF NOT EXISTS alertas_respostas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    alertaId INT NOT NULL,
    cuidadorId INT NOT NULL,
    acao ENUM('respondido', 'em_andamento', 'resolvido') NOT NULL,
    observacao TEXT,
    dataResposta DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (alertaId) REFERENCES alertas(id) ON DELETE CASCADE,
    FOREIGN KEY (cuidadorId) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- =====================================================
-- TABELAS DE CONVITES
-- =====================================================

-- Tabela de solicitações de família (convites para cuidadores)
CREATE TABLE IF NOT EXISTS solicitacoes_familia (
    id INT AUTO_INCREMENT PRIMARY KEY,
    familiaId INT NOT NULL,
    usuarioId INT NOT NULL, -- Quem enviou o convite
    cuidadorId INT NOT NULL, -- Quem recebeu o convite
    status ENUM('pendente', 'aceita', 'rejeitada') DEFAULT 'pendente',
    criadoEm DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (familiaId) REFERENCES familias(id) ON DELETE CASCADE,
    FOREIGN KEY (usuarioId) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (cuidadorId) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- =====================================================
-- ÍNDICES PARA PERFORMANCE
-- =====================================================

CREATE INDEX idx_email_usuarios ON usuarios(email);
CREATE INDEX idx_email_idosos ON idosos(email);
CREATE INDEX idx_data_alertas ON alertas(dataAlerta);
CREATE INDEX idx_codigo_familias ON familias(codigoEspecial);
CREATE INDEX idx_familia_remedios ON remedios(familiaId);
CREATE INDEX idx_idoso_remedios ON remedios(idosoId);
CREATE INDEX idx_idoso_alertas ON alertas(idosoId);
CREATE INDEX idx_cuidador_idosos ON idosos(cuidadorId);
CREATE INDEX idx_alertas_status ON alertas(status);
CREATE INDEX idx_alertas_data ON alertas(dataAlerta);
CREATE INDEX idx_respostas_alerta ON alertas_respostas(alertaId);
CREATE INDEX idx_respostas_data ON alertas_respostas(dataResposta);
CREATE INDEX idx_solicitacoes_familia ON solicitacoes_familia(familiaId);
CREATE INDEX idx_solicitacoes_cuidador ON solicitacoes_familia(cuidadorId);
CREATE INDEX idx_solicitacoes_status ON solicitacoes_familia(status);

-- =====================================================
-- DADOS DE EXEMPLO - CONDIÇÕES MÉDICAS
-- =====================================================

INSERT INTO condicoes_medicas (nome) VALUES 
('Hipertensão'),
('Diabetes Tipo 2'),
('Artrite'),
('Problemas Cardíacos'),
('Alzheimer'),
('Parkinson'),
('Osteoporose'),
('Câncer'),
('Asma'),
('Depressão'),
('Ansiedade'),
('Insônia'),
('Problemas de Visão'),
('Problemas Auditivos'),
('Doença Renal'),
('Doença Hepática'),
('Problemas Respiratórios'),
('Problemas Digestivos'),
('Problemas de Pele'),
('Problemas Neurológicos');

-- =====================================================
-- DADOS DE EXEMPLO - USUÁRIOS (CUIDADORES)
-- =====================================================

-- Usuários da Família Silva
INSERT INTO usuarios (id, nome, telefone, email, senhaHash) VALUES 
(1, 'Maria Silva', '(11) 99999-1111', 'maria.silva@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
(2, 'João Silva', '(11) 99999-1112', 'joao.silva@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
(3, 'Ana Silva', '(11) 99999-1113', 'ana.silva@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
(4, 'Ricardo Mendes', '(11) 99999-6661', 'ricardo.mendes@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
(5, 'Juliana Alves', '(11) 99999-6662', 'juliana.alves@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
(6, 'Claudia Lima', '(11) 99999-6663', 'claudia.lima@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
(7, 'Marcos Souza', '(11) 99999-6664', 'marcos.souza@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

-- Usuários da Família Santos
INSERT INTO usuarios (id, nome, telefone, email, senhaHash) VALUES 
(8, 'Carlos Santos', '(11) 99999-2221', 'carlos.santos@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
(9, 'Lucia Santos', '(11) 99999-2222', 'lucia.santos@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

-- Usuários da Família Oliveira
INSERT INTO usuarios (id, nome, telefone, email, senhaHash) VALUES 
(10, 'Pedro Oliveira', '(11) 99999-3331', 'pedro.oliveira@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
(11, 'Fernanda Oliveira', '(11) 99999-3332', 'fernanda.oliveira@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

-- Usuários da Família Costa
INSERT INTO usuarios (id, nome, telefone, email, senhaHash) VALUES 
(12, 'Roberto Costa', '(11) 99999-4441', 'roberto.costa@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
(13, 'Patricia Costa', '(11) 99999-4442', 'patricia.costa@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

-- Usuários da Família Pereira
INSERT INTO usuarios (id, nome, telefone, email, senhaHash) VALUES 
(14, 'Antonio Pereira', '(11) 99999-5551', 'antonio.pereira@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
(15, 'Sandra Pereira', '(11) 99999-5552', 'sandra.pereira@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

-- Cuidador independente para convites
INSERT INTO usuarios (id, nome, telefone, email, senhaHash) VALUES 
(16, 'Teste Cuidador', '(11) 99999-0000', 'teste@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

-- =====================================================
-- DADOS DE EXEMPLO - FAMÍLIAS
-- =====================================================

INSERT INTO familias (id, nome, codigoEspecial) VALUES 
(1, 'Família Silva', 'SILVA2024'),
(2, 'Família Santos', 'SANTOS2024'),
(3, 'Família Oliveira', 'OLIVEIRA2024'),
(4, 'Família Costa', 'COSTA2024'),
(5, 'Família Pereira', 'PEREIRA2024');

-- =====================================================
-- VINCULAÇÕES USUÁRIOS-FAMÍLIAS
-- =====================================================

-- Vincular cuidadores à Família Silva
INSERT INTO usuarios_familias (usuarioId, familiaId) VALUES 
(1, 1), (2, 1), (3, 1), (4, 1), (5, 1), (6, 1), (7, 1);

-- Vincular cuidadores à Família Santos
INSERT INTO usuarios_familias (usuarioId, familiaId) VALUES 
(8, 2), (9, 2);

-- Vincular cuidadores à Família Oliveira
INSERT INTO usuarios_familias (usuarioId, familiaId) VALUES 
(10, 3), (11, 3);

-- Vincular cuidadores à Família Costa
INSERT INTO usuarios_familias (usuarioId, familiaId) VALUES 
(12, 4), (13, 4);

-- Vincular cuidadores à Família Pereira
INSERT INTO usuarios_familias (usuarioId, familiaId) VALUES 
(14, 5), (15, 5);

-- =====================================================
-- DADOS DE EXEMPLO - IDOSOS
-- =====================================================

-- Idosos da Família Silva
INSERT INTO idosos (id, nome, idade, sexo, altura, peso, carteiraSUS, contatoEmergenciaNome, contatoEmergenciaTelefone, telefone, email, senhaHash, cuidadorId) VALUES 
(1, 'Dona Maria Silva', 75, 'Feminino', 160, 65.5, '123456789012345', 'João Silva', '(11) 99999-1112', '(11) 88888-1111', 'maria.idoso@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 2),
(2, 'Seu José Silva', 78, 'Masculino', 175, 80.0, '987654321098765', 'Maria Silva', '(11) 99999-1111', '(11) 88888-1112', 'jose.idoso@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1),
(3, 'Ana Paula Souza', 82, 'Feminino', 155, 58.0, '111222333444555', 'Claudia Lima', '(11) 99999-6663', '(11) 99999-2222', 'ana.paula@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 6),
(4, 'Carlos Mendes', 80, 'Masculino', 170, 75.0, '555444333222111', 'Ricardo Mendes', '(11) 99999-6661', '(11) 99999-3333', 'carlos.mendes@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 4);

-- Idosos da Família Santos
INSERT INTO idosos (id, nome, idade, sexo, altura, peso, carteiraSUS, contatoEmergenciaNome, contatoEmergenciaTelefone, telefone, email, senhaHash, cuidadorId) VALUES 
(5, 'Dona Rosa Santos', 76, 'Feminino', 158, 62.0, '222333444555666', 'Carlos Santos', '(11) 99999-2221', '(11) 88888-2221', 'rosa.santos@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 8),
(6, 'Seu Manuel Santos', 79, 'Masculino', 172, 78.5, '333444555666777', 'Lucia Santos', '(11) 99999-2222', '(11) 88888-2222', 'manuel.santos@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 9);

-- Idosos da Família Oliveira
INSERT INTO idosos (id, nome, idade, sexo, altura, peso, carteiraSUS, contatoEmergenciaNome, contatoEmergenciaTelefone, telefone, email, senhaHash, cuidadorId) VALUES 
(7, 'Dona Beatriz Oliveira', 74, 'Feminino', 163, 68.0, '444555666777888', 'Pedro Oliveira', '(11) 99999-3331', '(11) 88888-3331', 'beatriz.oliveira@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 10),
(8, 'Seu Francisco Oliveira', 81, 'Masculino', 168, 72.0, '555666777888999', 'Fernanda Oliveira', '(11) 99999-3332', '(11) 88888-3332', 'francisco.oliveira@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 11);

-- Idosos da Família Costa
INSERT INTO idosos (id, nome, idade, sexo, altura, peso, carteiraSUS, contatoEmergenciaNome, contatoEmergenciaTelefone, telefone, email, senhaHash, cuidadorId) VALUES 
(9, 'Dona Isabel Costa', 77, 'Feminino', 161, 64.5, '666777888999000', 'Roberto Costa', '(11) 99999-4441', '(11) 88888-4441', 'isabel.costa@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 12),
(10, 'Seu Alberto Costa', 83, 'Masculino', 174, 76.0, '777888999000111', 'Patricia Costa', '(11) 99999-4442', '(11) 88888-4442', 'alberto.costa@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 13);

-- Idosos da Família Pereira
INSERT INTO idosos (id, nome, idade, sexo, altura, peso, carteiraSUS, contatoEmergenciaNome, contatoEmergenciaTelefone, telefone, email, senhaHash, cuidadorId) VALUES 
(11, 'Dona Carmem Pereira', 75, 'Feminino', 159, 61.0, '888999000111222', 'Antonio Pereira', '(11) 99999-5551', '(11) 88888-5551', 'carmem.pereira@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 14),
(12, 'Seu Vicente Pereira', 80, 'Masculino', 171, 79.5, '999000111222333', 'Sandra Pereira', '(11) 99999-5552', '(11) 88888-5552', 'vicente.pereira@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 15);

-- =====================================================
-- VINCULAÇÕES FAMÍLIAS-IDOSOS
-- =====================================================

INSERT INTO familias_idosos (familiaId, idosoId) VALUES 
-- Família Silva
(1, 1), (1, 2), (1, 3), (1, 4),
-- Família Santos
(2, 5), (2, 6),
-- Família Oliveira
(3, 7), (3, 8),
-- Família Costa
(4, 9), (4, 10),
-- Família Pereira
(5, 11), (5, 12);

-- =====================================================
-- VINCULAÇÕES IDOSOS-CONDIÇÕES MÉDICAS
-- =====================================================

INSERT INTO idosos_condicoes (idosoId, condicaoId) VALUES 
-- Família Silva
(1, 1), (1, 2), -- Maria: Hipertensão, Diabetes
(2, 3), (2, 4), -- José: Artrite, Problemas Cardíacos
(3, 5), (3, 10), -- Ana Paula: Alzheimer, Depressão
(4, 7), (4, 8), -- Carlos: Osteoporose, Câncer

-- Família Santos
(5, 1), (5, 9), -- Rosa: Hipertensão, Asma
(6, 4), (6, 13), -- Manuel: Problemas Cardíacos, Problemas de Visão

-- Família Oliveira
(7, 2), (7, 11), -- Beatriz: Diabetes, Ansiedade
(8, 6), (8, 14), -- Francisco: Parkinson, Problemas Auditivos

-- Família Costa
(9, 15), (9, 16), -- Isabel: Doença Renal, Doença Hepática
(10, 17), (10, 18), -- Alberto: Problemas Respiratórios, Problemas Digestivos

-- Família Pereira
(11, 19), (11, 20), -- Carmem: Problemas de Pele, Problemas Neurológicos
(12, 12), (12, 1); -- Vicente: Insônia, Hipertensão

-- =====================================================
-- DADOS DE EXEMPLO - REMÉDIOS
-- =====================================================

INSERT INTO remedios (nome, horario, familiaId, idosoId) VALUES 
-- Família Silva
('Paracetamol', '08:00:00', 1, 1),
('Metformina', '12:00:00', 1, 1),
('AAS', '20:00:00', 1, 2),
('Donepezila', '09:00:00', 1, 3),
('Alendronato', '07:30:00', 1, 4),

-- Família Santos
('Losartana', '08:00:00', 2, 5),
('Salbutamol', '12:00:00', 2, 5),
('Atenolol', '20:00:00', 2, 6),
('Vitamina D', '07:00:00', 2, 6),

-- Família Oliveira
('Glicazida', '08:00:00', 3, 7),
('Diazepam', '14:00:00', 3, 7),
('Levodopa', '08:00:00', 3, 8),
('Levodopa', '14:00:00', 3, 8),
('Levodopa', '20:00:00', 3, 8),

-- Família Costa
('Furosemida', '08:00:00', 4, 9),
('Espironolactona', '12:00:00', 4, 9),
('Lactulose', '08:00:00', 4, 10),
('Omeprazol', '20:00:00', 4, 10),

-- Família Pereira
('Hidrocortisona', '08:00:00', 5, 11),
('Memantina', '12:00:00', 5, 12),
('Zolpidem', '22:00:00', 5, 12);

-- =====================================================
-- DADOS DE EXEMPLO - ALERTAS
-- =====================================================

INSERT INTO alertas (idosoId, tipo, latitude, longitude) VALUES 
-- Família Silva
(1, 'Queda', -23.5505, -46.6333),
(2, 'SOS', -23.5505, -46.6333),
(3, 'Queda', -23.5510, -46.6340),
(4, 'SOS', -23.5520, -46.6350),

-- Família Santos
(5, 'Queda', -23.5530, -46.6360),
(6, 'SOS', -23.5540, -46.6370),

-- Família Oliveira
(7, 'Queda', -23.5550, -46.6380),
(8, 'SOS', -23.5560, -46.6390),

-- Família Costa
(9, 'Queda', -23.5570, -46.6400),
(10, 'SOS', -23.5580, -46.6410),

-- Família Pereira
(11, 'Queda', -23.5590, -46.6420),
(12, 'SOS', -23.5600, -46.6430);

-- Atualizar alertas existentes para status 'ativo'
UPDATE alertas SET status = 'ativo' WHERE status IS NULL;

-- =====================================================
-- DADOS DE EXEMPLO - RESPOSTAS AOS ALERTAS
-- =====================================================

INSERT INTO alertas_respostas (alertaId, cuidadorId, acao, observacao) VALUES 
-- Família Silva
(1, 1, 'respondido', 'Alerta verificado, idoso está bem'),
(2, 2, 'resolvido', 'Situação resolvida, idoso recebeu atendimento'),
(3, 1, 'em_andamento', 'Em contato com serviços de emergência'),
(4, 3, 'respondido', 'Alerta verificado, tudo em ordem'),

-- Família Santos
(5, 8, 'respondido', 'Idoso está bem, foi apenas um susto'),
(6, 9, 'resolvido', 'Situação controlada'),

-- Família Oliveira
(7, 10, 'respondido', 'Verificação realizada, tudo normal'),
(8, 11, 'em_andamento', 'Aguardando ambulância'),

-- Família Costa
(9, 12, 'respondido', 'Idoso está bem'),
(10, 13, 'resolvido', 'Problema resolvido'),

-- Família Pereira
(11, 14, 'respondido', 'Verificação concluída'),
(12, 15, 'em_andamento', 'Em atendimento médico');

-- =====================================================
-- FIM DO SCRIPT
-- =====================================================
