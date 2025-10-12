<?php
// Headers CORS para permitir requisições do app
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Responder a requisições OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

include_once('conexao.php');

try {
    // Receber dados do POST
    $input = json_decode(file_get_contents('php://input'), true);
    $familiaId = $input['familiaId'] ?? null;
    
    if (!$familiaId) {
        echo json_encode(['success' => false, 'message' => 'ID da família não fornecido']);
        exit;
    }
    
    // Buscar idosos apenas da família específica
    $query = "SELECT i.id, i.nome, i.idade, i.sexo, i.altura, i.peso, i.carteiraSUS, i.telefone, i.email
              FROM idosos i
              INNER JOIN familias_idosos fi ON i.id = fi.idosoId
              WHERE fi.familiaId = ?
              ORDER BY i.nome";
    
    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $familiaId);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if (!$result) {
        echo json_encode(['success' => false, 'message' => 'Erro na consulta']);
        exit;
    }
    
    $idosos = [];
    while ($row = $result->fetch_assoc()) {
        $idosos[] = $row;
    }
    
    echo json_encode([
        'success' => true,
        'idosos' => $idosos
    ]);
    
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Erro interno: ' . $e->getMessage()]);
}

$conn->close();
?> 