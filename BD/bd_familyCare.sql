create database familyCare;

CREATE TABLE alertas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome_idoso VARCHAR(100),
  tipo VARCHAR(50),
  data DATETIME DEFAULT CURRENT_TIMESTAMP
);