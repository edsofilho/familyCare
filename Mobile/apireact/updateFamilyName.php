<?php
// Headers CORS para permitir requisições do app
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

// Responder a requisições OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

include_once('conexao.php');

$postjson = json_decode(file_get_contents('php://input'), true);

$familiaId = isset($postjson['familiaId']) ? intval($postjson['familiaId']) : null;
$nome = $postjson['nome'] ?? '';

if (!$familiaId) {
    echo json_encode(['status' => 'erro', 'mensagem' => 'ID da família não fornecido']);
    exit;
}

if (empty($nome)) {
    echo json_encode(['status' => 'erro', 'mensagem' => 'Nome da família não pode estar vazio']);
    exit;
}

try {
    // Atualizar nome da família
    $stmt = $conn->prepare("UPDATE familias SET nome = ? WHERE id = ?");
    $stmt->bind_param("si", $nome, $familiaId);
    $stmt->execute();
    
    if ($stmt->affected_rows > 0) {
        echo json_encode([
            'status' => 'sucesso', 
            'mensagem' => 'Nome da família atualizado com sucesso'
        ]);
    } else {
        echo json_encode([
            'status' => 'erro', 
            'mensagem' => 'Família não encontrada ou nenhuma alteração foi feita'
        ]);
    }
    
} catch (Exception $e) {
    echo json_encode(['status' => 'erro', 'mensagem' => 'Erro ao atualizar nome da família']);
}
?> 