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
$codigoFamilia = $postjson['codigoFamilia'] ?? '';
if (!$usuarioId || empty($codigoFamilia)) {
    echo json_encode(['status' => 'erro', 'mensagem' => 'Dados obrigatórios não fornecidos']);
    exit;
}

try {
    // Verificar se o código de família existe
    $stmt = $conn->prepare("SELECT id FROM familias WHERE codigoEspecial = ?");
    $stmt->bind_param("s", $codigoFamilia);
    $stmt->execute();
    $result = $stmt->get_result();
    $familia = $result->fetch_assoc();
    
    if (!$familia) {
        echo json_encode(['status' => 'erro', 'mensagem' => 'Código de família inválido']);
        exit;
    }
    
    $familiaId = $familia['id'];
    
    // Verificar se o usuário já está na família
    $stmt = $conn->prepare("SELECT id FROM usuarios_familias WHERE usuarioId = ? AND familiaId = ?");
    $stmt->bind_param("ii", $usuarioId, $familiaId);
    $stmt->execute();
    $result = $stmt->get_result();
    $existe = $result->fetch_assoc();
    
    if ($existe) {
        echo json_encode(['status' => 'erro', 'mensagem' => 'Você já está nesta família']);
        exit;
    }
    
    // Vincular usuário à família
    $stmt = $conn->prepare("INSERT INTO usuarios_familias (usuarioId, familiaId) VALUES (?, ?)");
    $stmt->bind_param("ii", $usuarioId, $familiaId);
    $stmt->execute();
    
    echo json_encode([
        'status' => 'sucesso',
        'mensagem' => 'Entrou na família com sucesso',
        'familiaId' => $familiaId
    ]);
    
} catch (Exception $e) {
    echo json_encode(['status' => 'erro', 'mensagem' => 'Erro ao entrar na família']);
}
?> 