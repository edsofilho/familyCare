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
$termo = isset($postjson['termo']) ? trim($postjson['termo']) : '';

try {
    // Validar parâmetros
    if (!$familiaId) {
        echo json_encode(['status' => 'erro', 'mensagem' => 'ID da família não fornecido']);
        exit;
    }
    
    // Buscar apenas cuidadores (usuarios) da família
    $sql = "
        SELECT u.id, u.nome, u.telefone, u.email
        FROM usuarios u
        INNER JOIN usuarios_familias uf ON u.id = uf.usuarioId
        WHERE uf.familiaId = ?
    ";
    if (!empty($termo)) {
        $sql .= " AND (u.nome LIKE ? OR u.email LIKE ?)";
    }
    $sql .= " ORDER BY u.nome";
    
    $stmt = $conn->prepare($sql);
    if (!empty($termo)) {
        $termoBusca = "%{$termo}%";
        $stmt->bind_param("iss", $familiaId, $termoBusca, $termoBusca);
    } else {
        $stmt->bind_param("i", $familiaId);
    }
    $stmt->execute();
    $result = $stmt->get_result();
    $cuidadores = $result->fetch_all(MYSQLI_ASSOC);
    
    echo json_encode([
        'status' => 'sucesso',
        'cuidadores' => $cuidadores
    ]);
    
} catch (Exception $e) {
    echo json_encode(['status' => 'erro', 'mensagem' => 'Erro ao buscar cuidadores']);
}
?> 