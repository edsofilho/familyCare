<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=utf-8');

// Conexão com o banco
$banco = 'familycare';
$host = 'localhost';
$usuario = 'root';
$senha = '';

try {
    $pdo = new PDO("mysql:dbname=$banco;host=$host", "$usuario", "$senha");
} catch (Exception $e) {
    echo json_encode(['status' => 'erro', 'mensagem' => 'Erro ao conectar com o banco']);
    exit();
}

// Pegando dados enviados do app
$dados = json_decode(file_get_contents('php://input'), true);

$nome_idoso = $dados['nome_idoso'] ?? '';
$tipo = 'SOS';

// Validação simples
if (empty($nome_idoso)) {
    echo json_encode(['status' => 'erro', 'mensagem' => 'Nome do idoso é obrigatório']);
    exit();
}

// Inserir alerta
$sql = "INSERT INTO alertas (nome_idoso, tipo) VALUES (:nome, :tipo)";
$stmt = $pdo->prepare($sql);
$stmt->bindParam(':nome', $nome_idoso);
$stmt->bindParam(':tipo', $tipo);

if ($stmt->execute()) {
    echo json_encode(['status' => 'sucesso', 'mensagem' => 'Alerta registrado']);
} else {
    echo json_encode(['status' => 'erro', 'mensagem' => 'Erro ao registrar alerta']);
}
?>