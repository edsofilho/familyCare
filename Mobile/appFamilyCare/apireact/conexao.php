<?php

// Configurações do banco de dados
$host = 'localhost';
$dbname = 'familycare';
$username = 'root';
$password = '';

try {
    // Criar conexão com o banco de dados usando PDO
    $conn = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    
    // Configurar o modo de erro do PDO para exceção
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Configurar charset para UTF-8
    $conn->exec("SET NAMES utf8");
    
    // Habilitar modo de debug
    $conn->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
} catch(PDOException $e) {
    // Em ambiente de produção, não exibir a mensagem de erro completa
    error_log("Erro de conexão com o banco de dados: " . $e->getMessage());
    die("Erro: Não foi possível conectar ao banco de dados.");
}

// Função para fechar a conexão
function closeConnection($conn) {
    $conn = null;
}
?>
