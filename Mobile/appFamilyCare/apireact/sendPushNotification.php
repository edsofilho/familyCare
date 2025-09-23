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

$familiaId = $input['familiaId'] ?? null;
$title = $input['title'] ?? 'FamilyCare';
$body = $input['body'] ?? '';
$data = $input['data'] ?? [];

if (!$familiaId || !$body) {
    echo json_encode(['success' => false, 'message' => 'Dados obrigatórios não fornecidos']);
    exit;
}

try {
    // Buscar tokens de todos os cuidadores da família
    $stmt = $conn->prepare("
        SELECT pt.pushToken, pt.platform 
        FROM push_tokens pt
        INNER JOIN usuarios_familias uf ON pt.userId = uf.usuarioId
        WHERE uf.familiaId = ? AND pt.userType = 'cuidador'
    ");
    $stmt->bind_param("i", $familiaId);
    $stmt->execute();
    $result = $stmt->get_result();
    $tokens = $result->fetch_all(MYSQLI_ASSOC);
    
    if (empty($tokens)) {
        echo json_encode(['success' => false, 'message' => 'Nenhum token encontrado para esta família']);
        exit;
    }
    
    // Preparar dados para envio
    $messages = [];
    foreach ($tokens as $tokenData) {
        $messages[] = [
            'to' => $tokenData['pushToken'],
            'title' => $title,
            'body' => $body,
            'data' => $data,
            'sound' => 'default',
            'badge' => 1,
            'priority' => 'high'
        ];
    }
    
    // Enviar notificações via Expo Push API
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, 'https://exp.host/--/api/v2/push/send');
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($messages));
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'Accept: application/json',
        'Accept-Encoding: gzip, deflate'
    ]);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($httpCode === 200) {
        $responseData = json_decode($response, true);
        echo json_encode([
            'success' => true, 
            'message' => 'Notificações enviadas com sucesso',
            'sent' => count($messages),
            'response' => $responseData
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Erro ao enviar notificações: ' . $response]);
    }
    
} catch (Exception $e) {
    error_log("sendPushNotification.php - Erro: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Erro interno do servidor']);
}
?>

