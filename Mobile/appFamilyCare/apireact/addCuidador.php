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
$nome = $postjson['nome'] ?? '';
$telefone = $postjson['telefone'] ?? '';
$email = $postjson['email'] ?? '';
$senha = $postjson['senha'] ?? '';
$familiaId = isset($postjson['familiaId']) ? intval($postjson['familiaId']) : null;
if (empty($nome) || empty($telefone) || empty($email) || empty($senha) || !$familiaId) {
    echo json_encode(['status' => 'erro', 'mensagem' => 'Dados obrigatórios não fornecidos']);
    exit;
}

try {
    $senhaHash = password_hash($senha, PASSWORD_DEFAULT);
    
    $stmt = $conn->prepare("INSERT INTO usuarios (nome, telefone, email, senhaHash) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssss", $nome, $telefone, $email, $senhaHash);
    $stmt->execute();
    
    $cuidadorId = $conn->insert_id;
    
    $stmt = $conn->prepare("INSERT INTO familias_usuarios (usuarioId, familiaId) VALUES (?, ?)");
    $stmt->bind_param("ii", $cuidadorId, $familiaId);
    $stmt->execute();
    
    echo json_encode([
        'status' => 'sucesso', 
        'mensagem' => 'Cuidador cadastrado com sucesso',
        'cuidadorId' => $cuidadorId
    ]);
    
} catch (Exception $e) {
    echo json_encode(['status' => 'erro', 'mensagem' => 'Erro ao cadastrar cuidador']);
}
?> 