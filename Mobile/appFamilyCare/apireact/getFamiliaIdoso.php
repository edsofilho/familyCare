<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

include 'conexao.php';

try {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    if (!$data) {
        echo json_encode(['success' => false, 'message' => 'Dados inválidos']);
        exit;
    }
    $idosoId = isset($data['idosoId']) ? intval($data['idosoId']) : null;
    if (!$idosoId) {
        echo json_encode(['success' => false, 'message' => 'ID do idoso é obrigatório']);
        exit;
    }
    $query = "SELECT f.id, f.nome, f.codigoEspecial FROM familias f JOIN familias_idosos fi ON f.id = fi.familiaId WHERE fi.idosoId = ?";
    $stmt = $conn->prepare($query);
    if (!$stmt) {
        echo json_encode(['success' => false, 'message' => 'Erro ao buscar família do idoso']);
        exit;
    }
    $stmt->bind_param("i", $idosoId);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result->num_rows === 0) {
        echo json_encode(['success' => false, 'message' => 'Família não encontrada para este idoso']);
        exit;
    }
    $familia = $result->fetch_assoc();
    echo json_encode([
        'success' => true,
        'familia' => $familia
    ]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Erro interno ao buscar família do idoso']);
}
$conn->close();
?> 