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
$alertaId = isset($postjson['alertaId']) ? intval($postjson['alertaId']) : null;
$cuidadorId = isset($postjson['cuidadorId']) ? intval($postjson['cuidadorId']) : null;
$acao = isset($postjson['acao']) ? $postjson['acao'] : null;
$observacao = isset($postjson['observacao']) ? $postjson['observacao'] : null;
if (!$alertaId || !$cuidadorId || !$acao) {
    echo json_encode(['status' => 'erro', 'mensagem' => 'Dados obrigatórios não fornecidos']);
    exit;
}

try {
    $conn->autocommit(false);
    
    // Primeiro, vamos adicionar uma coluna para rastrear o status do alerta
    // Se a coluna não existir, vamos criar uma tabela de histórico
    $stmt = $conn->prepare("
        INSERT INTO alertas_respostas (alertaId, cuidadorId, acao, observacao, dataResposta) 
        VALUES (?, ?, ?, ?, NOW())
    ");
    $stmt->bind_param("iiss", $alertaId, $cuidadorId, $acao, $observacao);
    $stmt->execute();
    
    $conn->commit();
    
    echo json_encode([
        'status' => 'sucesso', 
        'mensagem' => 'Resposta ao alerta registrada com sucesso'
    ]);
    
} catch (Exception $e) {
    $conn->rollback();
    echo json_encode(['status' => 'erro', 'mensagem' => 'Erro ao registrar resposta']);
}
?> 