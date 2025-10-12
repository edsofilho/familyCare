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
    $stmt = $conn->prepare("SHOW TABLES LIKE 'solicitacoes_familia'");
    $stmt->execute();
    $result = $stmt->get_result();
    $existe = $result->num_rows > 0;
    if (!$existe) {
        $sql = "
        CREATE TABLE solicitacoes_familia (
            id INT AUTO_INCREMENT PRIMARY KEY,
            familiaId INT NOT NULL,
            usuarioId INT NOT NULL,
            cuidadorId INT NOT NULL,
            status ENUM('pendente', 'aceita', 'rejeitada') DEFAULT 'pendente',
            criadoEm DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (familiaId) REFERENCES familias(id) ON DELETE CASCADE,
            FOREIGN KEY (usuarioId) REFERENCES usuarios(id) ON DELETE CASCADE,
            FOREIGN KEY (cuidadorId) REFERENCES usuarios(id) ON DELETE CASCADE
        )";
        $conn->query($sql);
        $conn->query("CREATE INDEX idx_solicitacoes_familia ON solicitacoes_familia(familiaId)");
        $conn->query("CREATE INDEX idx_solicitacoes_cuidador ON solicitacoes_familia(cuidadorId)");
        $conn->query("CREATE INDEX idx_solicitacoes_status ON solicitacoes_familia(status)");
        echo json_encode([
            'status' => 'sucesso',
            'mensagem' => 'Tabela solicitacoes_familia criada com sucesso'
        ]);
    } else {
        echo json_encode([
            'status' => 'sucesso',
            'mensagem' => 'Tabela solicitacoes_familia já existe'
        ]);
    }
} catch (Exception $e) {
    echo json_encode([
        'status' => 'erro',
        'mensagem' => 'Erro ao criar tabela'
    ]);
}
?> 