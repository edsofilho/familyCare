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

$idosoId = isset($postjson['idosoId']) ? intval($postjson['idosoId']) : (isset($postjson['id']) ? intval($postjson['id']) : null);
$nome = $postjson['nome'] ?? '';
$idade = isset($postjson['idade']) ? intval($postjson['idade']) : null;
$sexo = $postjson['sexo'] ?? '';
$altura = isset($postjson['altura']) ? floatval($postjson['altura']) : null;
$peso = isset($postjson['peso']) ? floatval($postjson['peso']) : null;
$carteiraSUS = $postjson['carteiraSUS'] ?? '';
$telefone = $postjson['telefone'] ?? '';
$email = $postjson['email'] ?? '';

if (!$idosoId) {
    echo json_encode(['status' => 'erro', 'mensagem' => 'ID do idoso não fornecido']);
    exit;
}

try {
    // Atualizar idoso
    $stmt = $conn->prepare("UPDATE idosos SET nome = ?, idade = ?, sexo = ?, altura = ?, peso = ?, carteiraSUS = ?, telefone = ?, email = ? WHERE id = ?");
    $stmt->bind_param("sisddsssi", $nome, $idade, $sexo, $altura, $peso, $carteiraSUS, $telefone, $email, $idosoId);
    $stmt->execute();
    
    echo json_encode([
        'status' => 'sucesso', 
        'mensagem' => 'Idoso atualizado com sucesso'
    ]);
    
} catch (Exception $e) {
    echo json_encode(['status' => 'erro', 'mensagem' => 'Erro ao atualizar idoso']);
}
?> 