<?php

// Configurações do banco de dados
$host = 'localhost';
$dbname = 'familycare';
$username = 'root';
$password = '';

// Habilitar exceptions no mysqli para capturar erros reais
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

try {
    // Criar conexão com o banco de dados usando mysqli
    $conn = new mysqli($host, $username, $password, $dbname);
    
    // Verificar conexão
    if ($conn->connect_error) {
        throw new Exception("Conexão falhou: " . $conn->connect_error);
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
