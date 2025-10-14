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

$familiaId = isset($postjson['familiaId']) ? intval($postjson['familiaId']) : null;
$ultimaVerificacao = isset($postjson['ultimaVerificacao']) ? $postjson['ultimaVerificacao'] : null;

if (!$familiaId) {
    echo json_encode(['status' => 'erro', 'mensagem' => 'ID da família não fornecido']);
    exit;
}

try {
    // Buscar alertas novos da família (últimos 5 minutos por padrão)
    $sql = "
        SELECT a.*, i.nome as nomeIdoso, i.contatoEmergenciaNome, i.contatoEmergenciaTelefone, i.telefone as telefoneIdoso
        FROM alertas a
        INNER JOIN idosos i ON a.idosoId = i.id
        INNER JOIN familias_idosos fi ON i.id = fi.idosoId
        WHERE fi.familiaId = ? AND a.visualizado = FALSE
    ";
    
    if ($ultimaVerificacao) {
        $sql .= " AND a.dataAlerta > ?";
    } else {
        // Se não há última verificação, buscar alertas dos últimos 5 minutos
        $sql .= " AND a.dataAlerta >= DATE_SUB(NOW(), INTERVAL 5 MINUTE)";
    }
    
    $sql .= " ORDER BY a.dataAlerta DESC";
    
    $stmt = $conn->prepare($sql);
    
    if ($ultimaVerificacao) {
        $stmt->bind_param("is", $familiaId, $ultimaVerificacao);
    } else {
        $stmt->bind_param("i", $familiaId);
    }
    
    $stmt->execute();
    $result = $stmt->get_result();
    $alertas = $result->fetch_all(MYSQLI_ASSOC);
    
    // Buscar cuidadores da família para notificação
    $stmtCuidadores = $conn->prepare("
        SELECT u.id, u.nome, u.telefone, u.email
        FROM usuarios u
        INNER JOIN usuarios_familias uf ON u.id = uf.usuarioId
        WHERE uf.familiaId = ?
    ");
    $stmtCuidadores->bind_param("i", $familiaId);
    $stmtCuidadores->execute();
    $resultCuidadores = $stmtCuidadores->get_result();
    $cuidadores = $resultCuidadores->fetch_all(MYSQLI_ASSOC);
    
    echo json_encode([
        'status' => 'sucesso',
        'alertas' => $alertas,
        'cuidadores' => $cuidadores,
        'timestamp' => date('Y-m-d H:i:s')
    ]);
    
} catch (Exception $e) {
    echo json_encode(['status' => 'erro', 'mensagem' => 'Erro ao buscar alertas']);
}
?> 