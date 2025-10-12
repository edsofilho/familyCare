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
$usuarioId = isset($postjson['usuarioId']) ? intval($postjson['usuarioId']) : null;
if (!$usuarioId) {
    echo json_encode(['status' => 'erro', 'mensagem' => 'ID do usuário não fornecido']);
    exit;
}

try {
    // Buscar famílias do usuário
    $stmt = $conn->prepare("
        SELECT f.id, f.nome, f.codigoEspecial, f.criadoEm
        FROM familias f
        INNER JOIN usuarios_familias uf ON f.id = uf.familiaId
        WHERE uf.usuarioId = ?
        ORDER BY f.nome
    ");
    $stmt->bind_param("i", $usuarioId);
    $stmt->execute();
    $result = $stmt->get_result();
    $familias = $result->fetch_all(MYSQLI_ASSOC);

    echo json_encode([
        'status' => 'sucesso',
        'familias' => $familias
    ]);

} catch (Exception $e) {
    echo json_encode(['status' => 'erro', 'mensagem' => 'Erro ao buscar famílias']);
}
?> 