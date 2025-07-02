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
$remedioId = isset($postjson['remedioId']) ? intval($postjson['remedioId']) : null;

// Validar parâmetros
if (!$remedioId) {
    echo json_encode(['status' => 'erro', 'mensagem' => 'ID do remédio não fornecido']);
    exit;
}

try {
    // Excluir remédio
    $stmt = $conn->prepare("DELETE FROM remedios WHERE id = ?");
    $stmt->bind_param("i", $remedioId);
    $stmt->execute();
    
    echo json_encode([
        'status' => 'sucesso', 
        'mensagem' => 'Medicamento excluído com sucesso'
    ]);
    
} catch (Exception $e) {
    echo json_encode(['status' => 'erro', 'mensagem' => 'Erro ao excluir medicamento']);
}
?> 