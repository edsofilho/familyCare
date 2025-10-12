<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$conn = new mysqli("localhost", "root", "", "familycare");
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["erro" => "Falha na conexão: " . $conn->connect_error]);
    exit;
}

$input = json_decode(file_get_contents("php://input"), true);
$familiaId = isset($input['familia_id']) ? intval($input['familia_id']) : 0;
$usuario = isset($input['usuario']) ? trim($input['usuario']) : '';

if ($familiaId <= 0 || $usuario === '') {
    http_response_code(400);
    echo json_encode(["erro" => "Parâmetros inválidos. Envie familia_id e usuario."]);
    $conn->close();
    exit;
}

// Marcar como 'entregue' para esta família (mensagens não enviadas por este usuário)
$stmtEntregue = $conn->prepare("UPDATE recados SET status = 'entregue' WHERE familia_id = ? AND usuario != ? AND status = 'enviado'");
if ($stmtEntregue) {
    $stmtEntregue->bind_param('is', $familiaId, $usuario);
    $stmtEntregue->execute();
    $entregues = $stmtEntregue->affected_rows;
    $stmtEntregue->close();
} else {
    $entregues = 0;
}

// Marcar como 'lido' as que já foram entregues
$stmtLido = $conn->prepare("UPDATE recados SET status = 'lido' WHERE familia_id = ? AND usuario != ? AND status = 'entregue'");
if ($stmtLido) {
    $stmtLido->bind_param('is', $familiaId, $usuario);
    $stmtLido->execute();
    $lidos = $stmtLido->affected_rows;
    $stmtLido->close();
} else {
    $lidos = 0;
}

echo json_encode(["sucesso" => true, "atualizados_entregue" => $entregues, "atualizados_lido" => $lidos]);
$conn->close();
