<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=utf-8');

include_once('conexao.php');

$postjson = json_decode(file_get_contents('php://input'), true);

$email = $postjson['email'];
$senha = $postjson['senha'];

// Verificar se está na tabela 'usuarios'
$query1 = $pdo->prepare("SELECT * FROM usuarios WHERE email = :email AND senha = :senha");
$query1->bindValue(':email', $email);
$query1->bindValue(':senha', $senha);
$query1->execute();
$res1 = $query1->fetch(PDO::FETCH_ASSOC);

// Verificar se está na tabela 'idosos'
$query2 = $pdo->prepare("SELECT * FROM idosos WHERE email = :email AND senha = :senha");
$query2->bindValue(':email', $email);
$query2->bindValue(':senha', $senha);
$query2->execute();
$res2 = $query2->fetch(PDO::FETCH_ASSOC);

if ($res1) {
    echo json_encode([
        'status' => 'sucesso',
        'tipo' => 'usuario',
        'nome' => $res1['nome'],
        'email' => $res1['email']
    ]);
} elseif ($res2) {
    echo json_encode([
        'status' => 'sucesso',
        'tipo' => 'idoso',
        'nome' => $res2['nome'],
        'email' => $res2['email']
    ]);
} else {
    echo json_encode([
        'status' => 'erro',
        'mensagem' => 'Usuário ou senha inválidos'
    ]);
}
?>
