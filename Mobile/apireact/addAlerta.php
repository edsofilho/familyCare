<?php
// Headers CORS para permitir requisições do app
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Log de início
error_log("=== ADD ALERTA DEBUG ===");
error_log("Método: " . $_SERVER['REQUEST_METHOD']);

// Responder a requisições OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

include_once('conexao.php');

try {
    // Log dos dados recebidos
    $input = file_get_contents('php://input');
    error_log("Dados recebidos: " . $input);
    
    $data = json_decode($input, true);
    error_log("Dados decodificados: " . print_r($data, true));
    
    if (!$data) {
        error_log("ERRO: Dados JSON inválidos");
        echo json_encode(['success' => false, 'message' => 'Dados inválidos']);
        exit;
    }
    
    $id_idoso = $data['id_idoso'] ?? null;
    $tipo_alerta = $data['tipo_alerta'] ?? 'manual';
    $descricao = $data['descricao'] ?? 'Alerta de emergência';
    
    // Mapear tipo de alerta para valores válidos do ENUM
    $tipo_enum = 'manual'; // Padrão
    if (strtolower($tipo_alerta) === 'sos' || strtolower($tipo_alerta) === 'emergencia') {
        $tipo_enum = 'manual';
    } elseif (strtolower($tipo_alerta) === 'automatico') {
        $tipo_enum = 'automatico';
    } elseif (strtolower($tipo_alerta) === 'virtual') {
        $tipo_enum = 'virtual';
    }
    
    if (!$id_idoso) {
        error_log("ERRO: ID do idoso não fornecido");
        echo json_encode(['success' => false, 'message' => 'ID do idoso é obrigatório']);
        exit;
    }
    
    // Verificar se o idoso existe
    $check_stmt = $conn->prepare("SELECT id, nome FROM idosos WHERE id = ?");
    $check_stmt->bind_param("i", $id_idoso);
    $check_stmt->execute();
    $check_result = $check_stmt->get_result();
    $idoso = $check_result->fetch_assoc();
    
    if (!$idoso) {
        echo json_encode(['success' => false, 'message' => 'Idoso não encontrado']);
        exit;
    }
    
    // Inserir alerta
    $stmt = $conn->prepare("INSERT INTO alertas (idosoId, tipo, dataAlerta, status) 
                           VALUES (?, ?, NOW(), 'ativo')");
    $stmt->bind_param("is", $id_idoso, $tipo_enum);
    
    if ($stmt->execute()) {
        $alerta_id = $conn->insert_id;
        
        // Buscar cuidadores da família do idoso
        $cuidadores_stmt = $conn->prepare("
            SELECT DISTINCT u.id, u.nome, u.email, u.telefone, uf.familiaId
            FROM usuarios u 
            JOIN usuarios_familias uf ON u.id = uf.usuarioId 
            JOIN familias_idosos fi ON uf.familiaId = fi.familiaId 
            WHERE fi.idosoId = ?
        ");
        $cuidadores_stmt->bind_param("i", $id_idoso);
        $cuidadores_stmt->execute();
        $cuidadores_result = $cuidadores_stmt->get_result();
        $cuidadores = [];
        $familiaId = null;
        while ($cuidador = $cuidadores_result->fetch_assoc()) {
            $cuidadores[] = $cuidador;
            $familiaId = $cuidador['familiaId']; // Pegar o ID da família
        }
        
        // Enviar notificação push para os cuidadores
        $pushSent = false;
        if ($familiaId && !empty($cuidadores)) {
            $pushSent = sendPushNotification($familiaId, $idoso['nome'], $tipo_alerta, $alerta_id);
        }
        
        $response = [
            'success' => true,
            'message' => 'Alerta enviado com sucesso',
            'alerta' => [
                'id' => $alerta_id,
                'idoso' => $idoso['nome'],
                'tipo' => $tipo_alerta,
                'descricao' => $descricao,
                'data_hora' => date('Y-m-d H:i:s'),
                'status' => 'ativo'
            ],
            'cuidadores_notificados' => count($cuidadores),
            'push_notification_sent' => $pushSent,
            'cuidadores' => $cuidadores
        ];
        
        echo json_encode($response);
    } else {
        echo json_encode(['success' => false, 'message' => 'Erro ao inserir alerta']);
    }
    
} catch (Exception $e) {
    error_log("EXCEÇÃO: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Erro interno ao inserir alerta']);
}

// Função para enviar notificação push
function sendPushNotification($familiaId, $nomeIdoso, $tipoAlerta, $alertaId) {
    try {
        $title = "🚨 Alerta de {$nomeIdoso}";
        $body = "Tipo: {$tipoAlerta}\nData: " . date('d/m/Y H:i');
        
        $data = [
            'familiaId' => $familiaId,
            'title' => $title,
            'body' => $body,
            'data' => [
                'alertaId' => $alertaId,
                'tipo' => 'alerta',
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