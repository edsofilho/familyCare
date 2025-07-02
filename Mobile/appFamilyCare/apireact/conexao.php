<?php

// Configurações do banco de dados
$host = 'localhost';
$dbname = 'familycare';
$username = 'root';
$password = '';

try {
    // Criar conexão com o banco de dados usando mysqli
    $conn = new mysqli($host, $username, $password, $dbname);
    
    // Verificar conexão
    if ($conn->connect_error) {
        throw new Exception("Conexão falhou");
    }
    
    // Configurar charset para UTF-8
    $conn->set_charset("utf8");
} catch(Exception $e) {
    throw $e;
}

// Função para fechar a conexão
function closeConnection($conn) {
    if ($conn) {
        $conn->close();
    }
}
?>
