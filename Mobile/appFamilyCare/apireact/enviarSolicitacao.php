<?php
ini_set('display_errors', 0);
ini_set('display_startup_errors', 0);
error_reporting(0);

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

$familiaId = isset($postjson['familiaId']) ? intval($postjson['familiaId']) : 0;
$usuarioId = isset($postjson['usuarioId']) ? intval($postjson['usuarioId']) : 0;
$cuidadorId = isset($postjson['cuidadorId']) ? intval($postjson['cuidadorId']) : 0;

if (!$familiaId || !$usuarioId || !$cuidadorId) {
    echo json_encode([
        'status' => 'erro',
        'mensagem' => 'Dados inválidos.'
    ]);
    exit;
}

try {
    // Verificar se já existe solicitação pendente
    $stmt = $conn->prepare("
        SELECT id FROM solicitacoes_familia 
        WHERE familiaId = ? 
        AND cuidadorId = ? 
        AND status = 'pendente'
    ");
    $stmt->bind_param("ii", $familiaId, $cuidadorId);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result->fetch_assoc()) {
        echo json_encode([
            'status' => 'erro',
            'mensagem' => 'Já existe uma solicitação pendente para este cuidador'
        ]);
        exit;
    }
    
    // Verificar se o cuidador já está na família
    $stmt = $conn->prepare("
        SELECT id FROM usuarios_familias 
        WHERE familiaId = ? 
        AND usuarioId = ?
    ");
    $stmt->bind_param("ii", $familiaId, $cuidadorId);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result->fetch_assoc()) {
        echo json_encode([
            'status' => 'erro',
            'mensagem' => 'Este cuidador já está na família'
        ]);
        exit;
    }
    
    // Verificar se o usuário que está enviando pertence à família
    $stmt = $conn->prepare("
        SELECT id FROM usuarios_familias 
        WHERE familiaId = ? 
        AND usuarioId = ?
    ");
    $stmt->bind_param("ii", $familiaId, $usuarioId);
    $stmt->execute();
    $result = $stmt->get_result();
    if (!$result->fetch_assoc()) {
        echo json_encode([
            'status' => 'erro',
            'mensagem' => 'Você não pertence a esta família'
        ]);
        exit;
    }
    
    // Inserir solicitação
    $stmt = $conn->prepare("
        INSERT INTO solicitacoes_familia (familiaId, usuarioId, cuidadorId, status, criadoEm) 
        VALUES (?, ?, ?, 'pendente', NOW())
    ");
    $stmt->bind_param("iii", $familiaId, $usuarioId, $cuidadorId);
    if (!$stmt->execute()) {
        throw new Exception("Erro ao inserir solicitação: " . $stmt->error);
    }
    $idInserido = $conn->insert_id;
    
    echo json_encode([
        'status' => 'sucesso',
        'mensagem' => 'Convite enviado com sucesso! O cuidador receberá uma notificação.',
        'id' => $idInserido
    ]);
} catch (Exception $e) {
    echo json_encode([
        'status' => 'erro', 
        'mensagem' => 'Erro ao enviar solicitação: ' . $e->getMessage()
    ]);
}
?> 