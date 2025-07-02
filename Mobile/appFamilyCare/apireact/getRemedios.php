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
$idosoId = isset($postjson['idosoId']) ? intval($postjson['idosoId']) : null;

try {
    // Validar parâmetros
    if (!$familiaId) {
        echo json_encode(['status' => 'erro', 'mensagem' => 'ID da família não fornecido']);
        exit;
    }
    
    // Buscar remédios da família
    if ($idosoId) {
        // Filtrar por idoso específico
        $stmt = $conn->prepare("
            SELECT id, nome, horario
            FROM remedios
            WHERE familiaId = ? AND idosoId = ?
            ORDER BY horario
        ");
        $stmt->bind_param("ii", $familiaId, $idosoId);
    } else {
        // Buscar todos os remédios da família
        $stmt = $conn->prepare("
            SELECT id, nome, horario
            FROM remedios
            WHERE familiaId = ?
            ORDER BY horario
        ");
        $stmt->bind_param("i", $familiaId);
    }
    $stmt->execute();
    $result = $stmt->get_result();
    $remedios = $result->fetch_all(MYSQLI_ASSOC);
    
    echo json_encode([
        'status' => 'sucesso',
        'remedios' => $remedios
    ]);
} catch (Exception $e) {
    echo json_encode(['status' => 'erro', 'mensagem' => 'Erro ao buscar remédios']);
}
?> 