<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

include_once('conexao.php');

$postjson = json_decode(file_get_contents('php://input'), true);
$familiaId = isset($postjson['familiaId']) ? intval($postjson['familiaId']) : null;
$idosoId = isset($postjson['idosoId']) ? intval($postjson['idosoId']) : null;
$incluirVisualizados = isset($postjson['incluirVisualizados']) ? $postjson['incluirVisualizados'] : false;

if (!$familiaId) {
    echo json_encode(['status' => 'erro', 'mensagem' => 'ID da família não fornecido']);
    exit;
}

try {
    // Buscar alertas dos idosos da família
    if ($idosoId) {
        // Filtrar por idoso específico
        $whereClause = "fi.familiaId = ? AND i.id = ?";
        $params = [$familiaId, $idosoId];
        
        if (!$incluirVisualizados) {
            $whereClause .= " AND a.visualizado = FALSE";
        }
        
        $stmt = $conn->prepare("
            SELECT a.*, i.nome as nomeIdoso, i.contatoEmergenciaNome, i.contatoEmergenciaTelefone,
                   (SELECT COUNT(*) FROM alertas_respostas ar WHERE ar.alertaId = a.id) as totalRespostas,
                   (SELECT ar.acao FROM alertas_respostas ar WHERE ar.alertaId = a.id ORDER BY ar.dataResposta DESC LIMIT 1) as ultimaAcao
            FROM alertas a
            INNER JOIN idosos i ON a.idosoId = i.id
            INNER JOIN familias_idosos fi ON i.id = fi.idosoId
            WHERE {$whereClause}
            ORDER BY a.dataAlerta DESC
            LIMIT 50
        ");
        $stmt->bind_param("ii", ...$params);
    } else {
        // Buscar todos os alertas da família
        $whereClause = "fi.familiaId = ?";
        $params = [$familiaId];
        
        if (!$incluirVisualizados) {
            $whereClause .= " AND a.visualizado = FALSE";
        }
        
        $stmt = $conn->prepare("
            SELECT a.*, i.nome as nomeIdoso, i.contatoEmergenciaNome, i.contatoEmergenciaTelefone,
                   (SELECT COUNT(*) FROM alertas_respostas ar WHERE ar.alertaId = a.id) as totalRespostas,
                   (SELECT ar.acao FROM alertas_respostas ar WHERE ar.alertaId = a.id ORDER BY ar.dataResposta DESC LIMIT 1) as ultimaAcao
            FROM alertas a
            INNER JOIN idosos i ON a.idosoId = i.id
            INNER JOIN familias_idosos fi ON i.id = fi.idosoId
            WHERE {$whereClause}
            ORDER BY a.dataAlerta DESC
            LIMIT 50
        ");
        $stmt->bind_param("i", ...$params);
    }
    $stmt->execute();
    $result = $stmt->get_result();
    $alertas = $result->fetch_all(MYSQLI_ASSOC);
    
    echo json_encode([
        'status' => 'sucesso',
        'alertas' => $alertas,
        'incluirVisualizados' => $incluirVisualizados
    ]);
    
} catch (Exception $e) {
    echo json_encode(['status' => 'erro', 'mensagem' => 'Erro ao buscar alertas: ' . $e->getMessage()]);
}
?>
