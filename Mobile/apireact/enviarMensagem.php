<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
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
$mensagem = isset($input['mensagem']) ? trim($input['mensagem']) : '';

if ($familiaId <= 0 || $usuario === '' || $mensagem === '') {
    http_response_code(400);
    echo json_encode(["erro" => "Parâmetros inválidos. Envie familia_id, usuario e mensagem."]);
    $conn->close();
    exit;
}

$stmt = $conn->prepare("INSERT INTO recados (familia_id, usuario, mensagem, status) VALUES (?, ?, ?, 'enviado')");
if (!$stmt) {
    http_response_code(500);
    echo json_encode(["erro" => "Falha ao preparar statement: " . $conn->error]);
    $conn->close();
    exit;
}

$stmt->bind_param('iss', $familiaId, $usuario, $mensagem);
$ok = $stmt->execute();

if ($ok) {
    $novoId = $stmt->insert_id;
    $getStmt = $conn->prepare("SELECT id, familia_id, usuario, mensagem, data_hora, status FROM recados WHERE id = ?");
    $getStmt->bind_param('i', $novoId);
    $getStmt->execute();
    $result = $getStmt->get_result();
    $row = $result->fetch_assoc();
    echo json_encode(["sucesso" => true, "mensagem" => $row]);
    $getStmt->close();
} else {
    http_response_code(500);
    echo json_encode(["erro" => "Erro ao salvar mensagem: " . $stmt->error]);
}

$stmt->close();
$conn->close();
