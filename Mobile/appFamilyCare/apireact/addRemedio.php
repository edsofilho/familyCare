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

$nome = isset($postjson['nome']) ? trim($postjson['nome']) : '';
$horario = isset($postjson['horario']) ? trim($postjson['horario']) : '';
$familiaId = isset($postjson['familiaId']) ? intval($postjson['familiaId']) : null;
$idosoId = isset($postjson['idosoId']) ? intval($postjson['idosoId']) : null;
$remedioId = isset($postjson['remedioId']) ? intval($postjson['remedioId']) : null;

// Validar dados obrigatórios
if (empty($nome) || empty($horario) || !$familiaId) {
    echo json_encode(["status" => "erro", "mensagem" => "Dados incompletos. Nome, horário e família são obrigatórios."]);
    exit;
}

try {
    if ($remedioId) {
        // Modo edição
        $stmt = $conn->prepare("UPDATE remedios SET nome = ?, horario = ? WHERE id = ? AND familiaId = ?");
        $stmt->bind_param("ssii", $nome, $horario, $remedioId, $familiaId);
        
        if ($stmt->execute()) {
            echo json_encode(["status" => "sucesso", "mensagem" => "Remédio atualizado com sucesso"]);
        } else {
            echo json_encode(["status" => "erro", "mensagem" => "Erro ao atualizar remédio"]);
        }
    } else {
        // Modo adição
        $stmt = $conn->prepare("INSERT INTO remedios (nome, horario, familiaId, idosoId) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("ssii", $nome, $horario, $familiaId, $idosoId);
        
        if ($stmt->execute()) {
            echo json_encode(["status" => "sucesso", "mensagem" => "Remédio adicionado com sucesso"]);
        } else {
            echo json_encode(["status" => "erro", "mensagem" => "Erro ao salvar remédio"]);
        }
    }
} catch (Exception $e) {
    echo json_encode(["status" => "erro", "mensagem" => "Erro ao salvar remédio"]);
}
?>