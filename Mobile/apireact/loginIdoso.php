<?php
// Headers básicos
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Responder a requisições OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

include_once('conexao.php');

try {
    // Log dos dados recebidos
    $input = file_get_contents('php://input');
    
    $data = json_decode($input, true);
    
    if (!$data) {
        echo json_encode(['success' => false, 'message' => 'Dados inválidos']);
        exit;
    }
    
    $email = $data['email'] ?? null;
    $senha = $data['senha'] ?? null;
    
    if (!$email || !$senha) {
        echo json_encode(['success' => false, 'message' => 'Email e senha são obrigatórios']);
        exit;
    }
    
    // Buscar idoso pelo email
    $query = "SELECT id, nome, email, senhaHash, idade, telefone FROM idosos WHERE email = ?";
    
    $stmt = $conn->prepare($query);
    if (!$stmt) {
        echo json_encode(['success' => false, 'message' => 'Erro ao buscar idoso']);
        exit;
    }
    
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        echo json_encode(['success' => false, 'message' => 'Email ou senha incorretos']);
        exit;
    }
    
    $idoso = $result->fetch_assoc();
    
    // Verificar senha
    if (password_verify($senha, $idoso['senhaHash'])) {
        // Buscar informações da família
        $familia_query = "SELECT f.id, f.nome 
                         FROM familias f 
                         JOIN familias_idosos fi ON f.id = fi.familiaId 
                         WHERE fi.idosoId = ?";
        $familia_stmt = $conn->prepare($familia_query);
        $familia_stmt->bind_param("i", $idoso['id']);
        $familia_stmt->execute();
        $familia_result = $familia_stmt->get_result();
        $familia = $familia_result->fetch_assoc();
        
        // Preparar resposta
        $response = [
            'success' => true,
            'message' => 'Login realizado com sucesso',
            'user' => [
                'id' => $idoso['id'],
                'nome' => $idoso['nome'],
                'email' => $idoso['email'],
                'idade' => $idoso['idade'],
                'telefone' => $idoso['telefone'],
                'tipo' => 'idoso',
                'familia' => $familia ? [
                    'id' => $familia['id'],
                    'nome' => $familia['nome']
                ] : null
            ]
        ];
        
        echo json_encode($response);
        
    } else {
        echo json_encode(['success' => false, 'message' => 'Email ou senha incorretos']);
    }
    
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Erro interno ao realizar login']);
}

$conn->close();
?> 