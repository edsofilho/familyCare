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

$idosoId = isset($postjson['idosoId']) ? intval($postjson['idosoId']) : null;

if (!$idosoId) {
    echo json_encode(['status' => 'erro', 'mensagem' => 'ID do idoso não fornecido']);
    exit;
}

try {
    // Buscar informações do colete vinculado ao idoso
    $stmt = $conn->prepare("
        SELECT c.*, i.nome as nomeIdoso
        FROM coletes c
        INNER JOIN idosos i ON c.idosoId = i.id
        WHERE c.idosoId = ? AND c.ativo = 1
    ");
    $stmt->bind_param("i", $idosoId);
    $stmt->execute();
    $result = $stmt->get_result();
    $colete = $result->fetch_assoc();
    
    if (!$colete) {
        echo json_encode([
            'status' => 'sucesso',
            'coleteVinculado' => false,
            'mensagem' => 'Nenhum colete vinculado a este idoso'
        ]);
        exit;
    }
    
    // Buscar estatísticas de quedas do idoso
    $stmtQuedas = $conn->prepare("
        SELECT 
            COUNT(*) as totalQuedas,
            COUNT(CASE WHEN DATE(q.dataQueda) = CURDATE() THEN 1 END) as quedasHoje,
            COUNT(CASE WHEN q.dataQueda >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 1 END) as quedasSemana,
            MAX(q.dataQueda) as ultimaQueda
        FROM quedas q
        WHERE q.idosoId = ?
    ");
    $stmtQuedas->bind_param("i", $idosoId);
    $stmtQuedas->execute();
    $resultQuedas = $stmtQuedas->get_result();
    $estatisticas = $resultQuedas->fetch_assoc();
    
    // Buscar última queda
    $stmtUltimaQueda = $conn->prepare("
        SELECT q.*, a.id as alertaId, a.status as statusAlerta
        FROM quedas q
        LEFT JOIN alertas a ON q.id = a.quedaId
        WHERE q.idosoId = ?
        ORDER BY q.dataQueda DESC
        LIMIT 1
    ");
    $stmtUltimaQueda->bind_param("i", $idosoId);
    $stmtUltimaQueda->execute();
    $resultUltimaQueda = $stmtUltimaQueda->get_result();
    $ultimaQueda = $resultUltimaQueda->fetch_assoc();
    
    echo json_encode([
        'status' => 'sucesso',
        'coleteVinculado' => true,
        'colete' => [
            'codigo' => $colete['codigo'],
            'dataVinculacao' => $colete['dataVinculacao'],
            'ativo' => $colete['ativo'],
            'nomeIdoso' => $colete['nomeIdoso']
        ],
        'estatisticas' => [
            'totalQuedas' => intval($estatisticas['totalQuedas']),
            'quedasHoje' => intval($estatisticas['quedasHoje']),
            'quedasSemana' => intval($estatisticas['quedasSemana']),
            'ultimaQueda' => $estatisticas['ultimaQueda']
        ],
        'ultimaQueda' => $ultimaQueda
    ]);
    
} catch (Exception $e) {
    echo json_encode(['status' => 'erro', 'mensagem' => 'Erro ao buscar informações do colete: ' . $e->getMessage()]);
}
?>
