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

$codigoColete = $postjson['codigoColete'] ?? '';
$intensidade = isset($postjson['intensidade']) ? floatval($postjson['intensidade']) : null;
$latitude = isset($postjson['latitude']) ? floatval($postjson['latitude']) : null;
$longitude = isset($postjson['longitude']) ? floatval($postjson['longitude']) : null;
$timestamp = $postjson['timestamp'] ?? date('Y-m-d H:i:s');

if (!$codigoColete) {
    echo json_encode(['status' => 'erro', 'mensagem' => 'Código do colete é obrigatório']);
    exit;
}

try {
    // Buscar o idoso vinculado ao colete
    $stmt = $conn->prepare("
        SELECT c.idosoId, i.nome as nomeIdoso, i.contatoEmergenciaNome, i.contatoEmergenciaTelefone
        FROM coletes c
        INNER JOIN idosos i ON c.idosoId = i.id
        WHERE c.codigo = ? AND c.ativo = 1
    ");
    $stmt->bind_param("s", $codigoColete);
    $stmt->execute();
    $result = $stmt->get_result();
    $coleteInfo = $result->fetch_assoc();
    
    if (!$coleteInfo) {
        echo json_encode(['status' => 'erro', 'mensagem' => 'Colete não encontrado ou não vinculado']);
        exit;
    }
    
    // Inserir a queda na tabela quedas
    $stmt = $conn->prepare("
        INSERT INTO quedas (idosoId, codigoColete, intensidade, latitude, longitude, dataQueda, status) 
        VALUES (?, ?, ?, ?, ?, ?, 'detectada')
    ");
    $stmt->bind_param("isddds", $coleteInfo['idosoId'], $codigoColete, $intensidade, $latitude, $longitude, $timestamp);
    $stmt->execute();
    $quedaId = $conn->insert_id;
    
    // Criar alerta de queda
    $stmt = $conn->prepare("
        INSERT INTO alertas (idosoId, tipo, dataAlerta, status, descricao, quedaId) 
        VALUES (?, 'queda', ?, 'ativo', 'Queda detectada pelo colete', ?)
    ");
    $stmt->bind_param("isi", $coleteInfo['idosoId'], $timestamp, $quedaId);
    $stmt->execute();
    $alertaId = $conn->insert_id;
    
    // Buscar cuidadores da família do idoso para notificação
    $stmtCuidadores = $conn->prepare("
        SELECT DISTINCT u.id, u.nome, u.email, u.telefone, uf.familiaId
        FROM usuarios u 
        JOIN usuarios_familias uf ON u.id = uf.usuarioId 
        JOIN familias_idosos fi ON uf.familiaId = fi.familiaId 
        WHERE fi.idosoId = ?
    ");
    $stmtCuidadores->bind_param("i", $coleteInfo['idosoId']);
    $stmtCuidadores->execute();
    $resultCuidadores = $stmtCuidadores->get_result();
    $cuidadores = [];
    $familiaId = null;
    while ($cuidador = $resultCuidadores->fetch_assoc()) {
        $cuidadores[] = $cuidador;
        $familiaId = $cuidador['familiaId'];
    }
    
    // Enviar notificação push para os cuidadores
    $pushSent = false;
    if ($familiaId && !empty($cuidadores)) {
        $pushSent = sendPushNotification($familiaId, $coleteInfo['nomeIdoso'], 'queda', $alertaId);
    }
    
    echo json_encode([
        'status' => 'sucesso',
        'mensagem' => 'Queda registrada com sucesso',
        'queda' => [
            'id' => $quedaId,
            'alertaId' => $alertaId,
            'idosoId' => $coleteInfo['idosoId'],
            'nomeIdoso' => $coleteInfo['nomeIdoso'],
            'intensidade' => $intensidade,
            'dataQueda' => $timestamp,
            'status' => 'detectada'
        ],
        'cuidadores_notificados' => count($cuidadores),
        'push_notification_sent' => $pushSent
    ]);
    
} catch (Exception $e) {
    echo json_encode(['status' => 'erro', 'mensagem' => 'Erro ao registrar queda: ' . $e->getMessage()]);
}

// Função para enviar notificação push
function sendPushNotification($familiaId, $nomeIdoso, $tipoAlerta, $alertaId) {
    try {
        $title = "🚨 Queda detectada - {$nomeIdoso}";
        $body = "Uma queda foi detectada pelo colete em " . date('d/m/Y H:i');
        
        $data = [
            'familiaId' => $familiaId,
            'title' => $title,
            'body' => $body,
            'data' => [
                'alertaId' => $alertaId,
                'tipo' => 'queda',
                'idoso' => $nomeIdoso
            ]
        ];
        
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, 'http://localhost/apireact/sendPushNotification.php');
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 10);
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        
        if ($httpCode === 200) {
            $responseData = json_decode($response, true);
            return $responseData['success'] ?? false;
        }
        
        return false;
    } catch (Exception $e) {
        error_log("Erro ao enviar push notification: " . $e->getMessage());
        return false;
    }
}
?>
