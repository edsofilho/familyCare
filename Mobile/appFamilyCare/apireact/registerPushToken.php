<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'conexao.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Método não permitido']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    echo json_encode(['success' => false, 'message' => 'Dados inválidos']);
    exit;
}

$userId = $input['userId'] ?? null;
$userType = $input['userType'] ?? null;
$pushToken = $input['pushToken'] ?? null;
$platform = $input['platform'] ?? 'unknown';

if (!$userId || !$userType || !$pushToken) {
    echo json_encode(['success' => false, 'message' => 'Dados obrigatórios não fornecidos']);
    exit;
}

try {
    // Verificar se o token já existe
    $stmt = $conn->prepare("SELECT id FROM push_tokens WHERE userId = ? AND userType = ? AND pushToken = ?");
    $stmt->bind_param("iss", $userId, $userType, $pushToken);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        // Token já existe, atualizar timestamp
        $stmt = $conn->prepare("UPDATE push_tokens SET updatedAt = NOW() WHERE userId = ? AND userType = ? AND pushToken = ?");
        $stmt->bind_param("iss", $userId, $userType, $pushToken);
        $stmt->execute();
        
        echo json_encode(['success' => true, 'message' => 'Token atualizado']);
    } else {
        // Inserir novo token
        $stmt = $conn->prepare("INSERT INTO push_tokens (userId, userType, pushToken, platform, createdAt, updatedAt) VALUES (?, ?, ?, ?, NOW(), NOW())");
        $stmt->bind_param("isss", $userId, $userType, $pushToken, $platform);
        $stmt->execute();
        
        echo json_encode(['success' => true, 'message' => 'Token registrado com sucesso']);
    }
    
} catch (Exception $e) {
    error_log("registerPushToken.php - Erro: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Erro interno do servidor']);
}
?>
