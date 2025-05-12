create database familyCare;

CREATE TABLE alertas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nomeIdoso VARCHAR(100),
  tipo VARCHAR(50),
  data DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO alertas (nome_idoso, tipo, data)
VALUES ('João da Silva', 'Urgente', NOW());

select * from alertas;