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
$alertaId = isset($postjson['alertaId']) ? intval($postjson['alertaId']) : null;
$familiaId = isset($postjson['familiaId']) ? intval($postjson['familiaId']) : null;

if (!$alertaId && !$familiaId) {
    echo json_encode(['status' => 'erro', 'mensagem' => 'ID do alerta ou família não fornecido']);
    exit;
}

try {
    if ($alertaId) {
        // Marcar alerta específico como visualizado
        $stmt = $conn->prepare("UPDATE alertas SET visualizado = TRUE WHERE id = ?");
        $stmt->bind_param("i", $alertaId);
        $stmt->execute();
        
        if ($stmt->affected_rows > 0) {
            echo json_encode([
                'status' => 'sucesso',
                'mensagem' => 'Alerta marcado como visualizado'
            ]);
        } else {
            echo json_encode([
                'status' => 'erro',
                'mensagem' => 'Alerta não encontrado'
            ]);
        }
    } else {
        // Marcar todos os alertas da família como visualizados
        $stmt = $conn->prepare("
            UPDATE alertas a
            INNER JOIN idosos i ON a.idosoId = i.id
            INNER JOIN familias_idosos fi ON i.id = fi.idosoId
            SET a.visualizado = TRUE
            WHERE fi.familiaId = ? AND a.visualizado = FALSE
        ");
        $stmt->bind_param("i", $familiaId);
        $stmt->execute();
        
        $affectedRows = $stmt->affected_rows;
        
        echo json_encode([
            'status' => 'sucesso',
            'mensagem' => "{$affectedRows} alertas marcados como visualizados"
        ]);
    }
    
} catch (Exception $e) {
    echo json_encode(['status' => 'erro', 'mensagem' => 'Erro ao marcar alertas: ' . $e->getMessage()]);
}
?>
