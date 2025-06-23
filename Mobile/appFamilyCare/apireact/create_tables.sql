-- Cria o banco de dados
CREATE DATABASE IF NOT EXISTS familycare;
USE familycare;

-- Cria a tabela de alertas
CREATE TABLE IF NOT EXISTS alertas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome_idoso VARCHAR(100) NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    data_queda DATETIME NOT NULL,
    localizacao VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
