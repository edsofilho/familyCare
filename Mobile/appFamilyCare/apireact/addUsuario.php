<?php
include_once('conexao.php');

$postjson = json_decode(file_get_contents('php://input'), true);

$nome = $postjson['nome'];
$telefone = $postjson['telefone'];
$email = $postjson['email'];
$senha = $postjson['senha'];

try {
    $stmt = $pdo->prepare("INSERT INTO usuarios (nome, telefone, email, senha) VALUES (:nome, :telefone, :email, :senha)");
    $stmt->bindParam(':nome', $nome);
    $stmt->bindParam(':telefone', $telefone);
    $stmt->bindParam(':email', $email);
    $stmt->bindParam(':senha', $senha);

    $stmt->execute();

    echo json_encode(['status' => 'sucesso', 'mensagem' => 'Usuário cadastrado com sucesso']);
} catch (Exception $e) {
    echo json_encode(['status' => 'erro', 'mensagem' => 'Erro ao cadastrar', 'erro' => $e->getMessage()]);
}
?>
