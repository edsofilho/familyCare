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
$termo = isset($postjson['termo']) ? trim($postjson['termo']) : '';
$usuarioAtual = isset($postjson['usuarioAtual']) ? intval($postjson['usuarioAtual']) : null;
if (empty($termo) || !$usuarioAtual) {
    echo json_encode([
        'status' => 'erro',
        'mensagem' => 'Termo de busca e usuário atual são obrigatórios'
    ]);
    exit;
}

try {
    // Buscar usuários que contenham o termo no nome ou email
    $stmt = $conn->prepare("
        SELECT id, nome, email, telefone
        FROM usuarios 
        WHERE (nome LIKE ? OR email LIKE ?)
        AND id != ?
        ORDER BY nome
        LIMIT 20
    ");
    
    $termoBusca = "%{$termo}%";
    $stmt->bind_param("ssi", $termoBusca, $termoBusca, $usuarioAtual);
    $stmt->execute();
    
    $result = $stmt->get_result();
    $usuarios = $result->fetch_all(MYSQLI_ASSOC);
    
    echo json_encode([
        'status' => 'sucesso',
        'usuarios' => $usuarios
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'status' => 'erro', 
        'mensagem' => 'Erro ao buscar usuários'
    ]);
}
?> 