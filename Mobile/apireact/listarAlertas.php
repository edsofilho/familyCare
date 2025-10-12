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
$idosoId = isset($postjson['idosoId']) ? intval($postjson['idosoId']) : null;

// Log para debug
error_log("listarAlertas.php - familiaId: " . $familiaId . ", idosoId: " . $idosoId);

// Validar parâmetros
if (!$familiaId) {
    echo json_encode(['status' => 'erro', 'mensagem' => 'ID da família não fornecido']);
    exit;
}

try {
    // Buscar alertas dos idosos da família
    if ($idosoId) {
        // Filtrar por idoso específico
        $stmt = $conn->prepare("
            SELECT a.*, i.nome as nomeIdoso, i.contatoEmergenciaNome, i.contatoEmergenciaTelefone,
                   (SELECT COUNT(*) FROM alertas_respostas ar WHERE ar.alertaId = a.id) as totalRespostas,
                   (SELECT ar.acao FROM alertas_respostas ar WHERE ar.alertaId = a.id ORDER BY ar.dataResposta DESC LIMIT 1) as ultimaAcao,
                   q.intensidade as quedaIntensidade, q.latitude as quedaLatitude, q.longitude as quedaLongitude,
                   q.dataQueda, q.codigoColete, q.status as statusQueda
            FROM alertas a
            INNER JOIN idosos i ON a.idosoId = i.id
            INNER JOIN familias_idosos fi ON i.id = fi.idosoId
            LEFT JOIN quedas q ON a.quedaId = q.id
            WHERE fi.familiaId = ? AND i.id = ?
            ORDER BY a.dataAlerta DESC
            LIMIT 50
        ");
        $stmt->bind_param("ii", $familiaId, $idosoId);
    } else {
        // Buscar todos os alertas da família
        $stmt = $conn->prepare("
            SELECT a.*, i.nome as nomeIdoso, i.contatoEmergenciaNome, i.contatoEmergenciaTelefone,
                   (SELECT COUNT(*) FROM alertas_respostas ar WHERE ar.alertaId = a.id) as totalRespostas,
                   (SELECT ar.acao FROM alertas_respostas ar WHERE ar.alertaId = a.id ORDER BY ar.dataResposta DESC LIMIT 1) as ultimaAcao,
                   q.intensidade as quedaIntensidade, q.latitude as quedaLatitude, q.longitude as quedaLongitude,
                   q.dataQueda, q.codigoColete, q.status as statusQueda
            FROM alertas a
            INNER JOIN idosos i ON a.idosoId = i.id
            INNER JOIN familias_idosos fi ON i.id = fi.idosoId
            LEFT JOIN quedas q ON a.quedaId = q.id
            WHERE fi.familiaId = ?
            ORDER BY a.dataAlerta DESC
            LIMIT 50
        ");
        $stmt->bind_param("i", $familiaId);
    }
    $stmt->execute();
    $result = $stmt->get_result();
    $alertas = $result->fetch_all(MYSQLI_ASSOC);
    
    error_log("listarAlertas.php - Alertas encontrados: " . count($alertas));
    
    echo json_encode([
        'status' => 'sucesso',
        'alertas' => $alertas
    ]);
    
} catch (Exception $e) {
    error_log("listarAlertas.php - Erro: " . $e->getMessage());
    echo json_encode(['status' => 'erro', 'mensagem' => 'Erro ao buscar alertas']);
}
?>
