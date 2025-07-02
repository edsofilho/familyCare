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
$cuidadorId = isset($postjson['cuidadorId']) ? intval($postjson['cuidadorId']) : null;
if (!$cuidadorId) {
    echo json_encode(['status' => 'erro', 'mensagem' => 'ID do cuidador não fornecido']);
    exit;
}

try {
    // Buscar solicitações pendentes para o cuidador
    $stmt = $conn->prepare("
        SELECT 
            sf.id,
            sf.status,
            sf.criadoEm,
            f.nome as familiaNome,
            f.codigoEspecial as familiaCodigo,
            u.nome as solicitanteNome,
            u.email as solicitanteEmail
        FROM solicitacoes_familia sf
        INNER JOIN familias f ON sf.familiaId = f.id
        INNER JOIN usuarios u ON sf.usuarioId = u.id
        WHERE sf.cuidadorId = ? 
        AND sf.status = 'pendente'
        ORDER BY sf.criadoEm DESC
    ");
    
    $stmt->bind_param("i", $cuidadorId);
    $stmt->execute();
    
    $result = $stmt->get_result();
    $solicitacoes = $result->fetch_all(MYSQLI_ASSOC);
    
    echo json_encode([
        'status' => 'sucesso',
        'solicitacoes' => $solicitacoes
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'status' => 'erro', 
        'mensagem' => 'Erro ao buscar solicitações'
    ]);
}
?> 