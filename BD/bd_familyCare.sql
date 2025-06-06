create database familyCare;

CREATE TABLE alertas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nomeIdoso VARCHAR(100),
  tipo VARCHAR(50),
  dataQueda DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO alertas (nomeIdoso, tipo, dataQueda)
VALUES ('João da Silva', 'Urgente', NOW());

select * from alertas;

INSERT INTO alertas (nomeIdoso, tipo, dataQueda)
VALUES ('Arthut', 'Urgente', NOW());

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    telefone VARCHAR(20),
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL
);

CREATE TABLE idosos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    telefone VARCHAR(20),
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL
);