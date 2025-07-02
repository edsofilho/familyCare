<?php
// Headers básicos
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
    $email = $data['email'] ?? null;
    $senha = $data['senha'] ?? null;
    if (!$email || !$senha) {
        echo json_encode(['success' => false, 'message' => 'Email e senha são obrigatórios']);
        exit;
    }
    $query = "SELECT id, nome, email, senhaHash, telefone FROM usuarios WHERE email = ?";
    $stmt = $conn->prepare($query);
    if (!$stmt) {
        echo json_encode(['success' => false, 'message' => 'Erro ao buscar usuário']);
        exit;
    }
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result->num_rows === 0) {
        echo json_encode(['success' => false, 'message' => 'Email ou senha incorretos']);
        exit;
    }
    $usuario = $result->fetch_assoc();
    if (password_verify($senha, $usuario['senhaHash'])) {
        $familia_query = "SELECT f.id, f.nome FROM familias f JOIN usuarios_familias uf ON f.id = uf.familiaId WHERE uf.usuarioId = ?";
        $familia_stmt = $conn->prepare($familia_query);
        $familia_stmt->bind_param("i", $usuario['id']);
        $familia_stmt->execute();
        $familia_result = $familia_stmt->get_result();
        $familia = $familia_result->fetch_assoc();
        $response = [
            'success' => true,
            'message' => 'Login realizado com sucesso',
            'user' => [
                'id' => $usuario['id'],
                'nome' => $usuario['nome'],
                'email' => $usuario['email'],
                'telefone' => $usuario['telefone'],
                'tipo' => 'cuidador',
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
