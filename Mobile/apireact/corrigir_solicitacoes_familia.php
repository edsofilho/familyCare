<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

include_once('conexao.php');

try {
    $conn->query("DROP TABLE IF EXISTS solicitacoes_familia");
    $sql = "CREATE TABLE solicitacoes_familia (
        id INT AUTO_INCREMENT PRIMARY KEY,
        familiaId INT NOT NULL,
        usuarioId INT NOT NULL,
        cuidadorId INT NOT NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'pendente',
        criadoEm DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )";
    if ($conn->query($sql)) {
        echo json_encode([
            'status' => 'sucesso',
            'mensagem' => 'Tabela solicitacoes_familia recriada com sucesso'
        ]);
    } else {
        echo json_encode([
            'status' => 'erro',
            'mensagem' => 'Erro ao recriar tabela'
        ]);
    }
} catch (Exception $e) {
    echo json_encode([
        'status' => 'erro',
        'mensagem' => 'Erro ao corrigir tabela'
    ]);
}
?> 