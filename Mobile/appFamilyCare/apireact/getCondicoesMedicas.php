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

try {
    // Receber dados do POST
    $input = json_decode(file_get_contents('php://input'), true);
    $idosoId = isset($input['idosoId']) ? intval($input['idosoId']) : null;
    
    if (!$idosoId) {
        echo json_encode(['status' => 'erro', 'mensagem' => 'ID do idoso não fornecido']);
        exit;
    }
    
    // Buscar condições médicas do idoso específico
    $stmt = $conn->prepare("
        SELECT cm.nome 
        FROM condicoes_medicas cm
        INNER JOIN idosos_condicoes ic ON cm.id = ic.condicaoId
        WHERE ic.idosoId = ?
        ORDER BY cm.nome
    ");
    $stmt->bind_param("i", $idosoId);
    $stmt->execute();
    $result = $stmt->get_result();
    $condicoes = [];
    
    while ($row = $result->fetch_assoc()) {
        $condicoes[] = $row['nome'];
    }
    
    echo json_encode([
        'status' => 'sucesso',
        'condicoes' => $condicoes
    ]);
    
} catch (Exception $e) {
    echo json_encode(['status' => 'erro', 'mensagem' => 'Erro ao buscar condições médicas']);
}
?> 