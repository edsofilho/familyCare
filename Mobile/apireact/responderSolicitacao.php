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

$solicitacaoId = isset($postjson['solicitacaoId']) ? intval($postjson['solicitacaoId']) : null;
$acao = $postjson['acao'] ?? '';

if (!$solicitacaoId || !in_array($acao, ['aceitar', 'rejeitar'])) {
    echo json_encode([
        'status' => 'erro',
        'mensagem' => 'Dados inválidos para solicitação.'
    ]);
    exit;
}

try {
    $conn->autocommit(false);
    
    // Buscar dados da solicitação
    $stmt = $conn->prepare("
        SELECT familiaId, cuidadorId 
        FROM solicitacoes_familia 
        WHERE id = ? 
        AND status = 'pendente'
    ");
    $stmt->bind_param("i", $solicitacaoId);
    $stmt->execute();
    
    $result = $stmt->get_result();
    $solicitacao = $result->fetch_assoc();
    
    if (!$solicitacao) {
        $conn->rollback();
        echo json_encode([
            'status' => 'erro',
            'mensagem' => 'Solicitação não encontrada ou já respondida'
        ]);
        exit;
    }
    
    if ($acao === 'aceitar') {
        // Verificar se o cuidador já está na família
        $stmt = $conn->prepare("
            SELECT id FROM usuarios_familias 
            WHERE familiaId = ? 
            AND usuarioId = ?
        ");
        $stmt->bind_param("ii", $solicitacao['familiaId'], $solicitacao['cuidadorId']);
        $stmt->execute();
        
        $result = $stmt->get_result();
        if ($result->fetch_assoc()) {
            $conn->rollback();
            echo json_encode([
                'status' => 'erro',
                'mensagem' => 'Você já está nesta família'
            ]);
            exit;
        }
        
        // Adicionar cuidador à família
        $stmt = $conn->prepare("
            INSERT INTO usuarios_familias (usuarioId, familiaId) 
            VALUES (?, ?)
        ");
        $stmt->bind_param("ii", $solicitacao['cuidadorId'], $solicitacao['familiaId']);
        $stmt->execute();
    }
    
    // Atualizar status da solicitação
    $stmt = $conn->prepare("
        UPDATE solicitacoes_familia 
        SET status = ? 
        WHERE id = ?
    ");
    $status = ($acao === 'aceitar') ? 'aceita' : 'rejeitada';
    $stmt->bind_param("si", $status, $solicitacaoId);
    $stmt->execute();
    
    $conn->commit();
    
    echo json_encode([
        'status' => 'sucesso',
        'mensagem' => $acao === 'aceitar' ? 'Convite aceito com sucesso!' : 'Convite rejeitado'
    ]);
    
} catch (Exception $e) {
    $conn->rollback();
    echo json_encode([
        'status' => 'erro', 
        'mensagem' => 'Erro ao processar solicitação'
    ]);
}
?> 