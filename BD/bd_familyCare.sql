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