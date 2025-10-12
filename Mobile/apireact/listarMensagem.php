<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
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

$familiaId = isset($_GET['familia_id']) ? intval($_GET['familia_id']) : 0;
$limit = isset($_GET['limit']) ? intval($_GET['limit']) : 100;
if ($limit <= 0 || $limit > 500) { $limit = 100; }

if ($familiaId <= 0) {
    http_response_code(400);
    echo json_encode(["erro" => "Parâmetro familia_id é obrigatório."]);
    $conn->close();
    exit;
}

$sql = "SELECT id, familia_id, usuario, mensagem, data_hora, status FROM recados WHERE familia_id = ? ORDER BY id ASC LIMIT ?";
$stmt = $conn->prepare($sql);
if (!$stmt) {
    http_response_code(500);
    echo json_encode(["erro" => "Falha ao preparar statement: " . $conn->error]);
    $conn->close();
    exit;
}

$stmt->bind_param('ii', $familiaId, $limit);
$stmt->execute();
$result = $stmt->get_result();

$recados = [];
while ($row = $result->fetch_assoc()) {
    $recados[] = $row;
}

echo json_encode($recados);

$stmt->close();
$conn->close();
