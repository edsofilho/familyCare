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
$alertaId = isset($postjson['alertaId']) ? intval($postjson['alertaId']) : null;
if (!$alertaId) {
    echo json_encode(['status' => 'erro', 'mensagem' => 'ID do alerta não fornecido']);
    exit;
}

try {
    // Excluir alerta
    $stmt = $conn->prepare("DELETE FROM alertas WHERE id = ?");
    $stmt->bind_param("i", $alertaId);
    $stmt->execute();
    
    echo json_encode([
        'status' => 'sucesso', 
        'mensagem' => 'Alerta excluído com sucesso'
    ]);
    
} catch (Exception $e) {
    echo json_encode(['status' => 'erro', 'mensagem' => 'Erro ao excluir alerta']);
}
?> 