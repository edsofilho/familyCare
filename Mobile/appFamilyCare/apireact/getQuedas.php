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
$limite = isset($postjson['limite']) ? intval($postjson['limite']) : 50;

// Validar parâmetros
if (!$familiaId) {
    echo json_encode(['status' => 'erro', 'mensagem' => 'ID da família não fornecido']);
    exit;
}

try {
    if ($idosoId) {
        // Buscar quedas de um idoso específico
        $stmt = $conn->prepare("
            SELECT q.*, i.nome as nomeIdoso, a.id as alertaId, a.status as statusAlerta
            FROM quedas q
            INNER JOIN idosos i ON q.idosoId = i.id
            INNER JOIN familias_idosos fi ON i.id = fi.idosoId
            LEFT JOIN alertas a ON q.id = a.quedaId
            WHERE fi.familiaId = ? AND i.id = ?
            ORDER BY q.dataQueda DESC
            LIMIT ?
        ");
        $stmt->bind_param("iii", $familiaId, $idosoId, $limite);
    } else {
        // Buscar todas as quedas da família
        $stmt = $conn->prepare("
            SELECT q.*, i.nome as nomeIdoso, a.id as alertaId, a.status as statusAlerta
            FROM quedas q
            INNER JOIN idosos i ON q.idosoId = i.id
            INNER JOIN familias_idosos fi ON i.id = fi.idosoId
            LEFT JOIN alertas a ON q.id = a.quedaId
            WHERE fi.familiaId = ?
            ORDER BY q.dataQueda DESC
            LIMIT ?
        ");
        $stmt->bind_param("ii", $familiaId, $limite);
    }
    
    $stmt->execute();
    $result = $stmt->get_result();
    $quedas = $result->fetch_all(MYSQLI_ASSOC);
    
    // Formatar as quedas para incluir informações adicionais
    foreach ($quedas as &$queda) {
        $queda['dataQuedaFormatada'] = date('d/m/Y H:i:s', strtotime($queda['dataQueda']));
        $queda['intensidadeDescricao'] = getIntensidadeDescricao($queda['intensidade']);
        $queda['temAlerta'] = !empty($queda['alertaId']);
    }
    
    echo json_encode([
        'status' => 'sucesso',
        'quedas' => $quedas,
        'total' => count($quedas)
    ]);
    
} catch (Exception $e) {
    echo json_encode(['status' => 'erro', 'mensagem' => 'Erro ao buscar quedas: ' . $e->getMessage()]);
}

// Função para classificar a intensidade da queda
function getIntensidadeDescricao($intensidade) {
    if ($intensidade === null) {
        return 'Não informada';
    }
    
    if ($intensidade < 2.0) {
        return 'Leve';
    } else if ($intensidade < 4.0) {
        return 'Moderada';
    } else if ($intensidade < 6.0) {
        return 'Forte';
    } else {
        return 'Muito forte';
    }
}
?>
