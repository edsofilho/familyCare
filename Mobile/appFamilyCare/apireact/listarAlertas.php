<?php 
include_once('conexao.php');

$query = $pdo->query("SELECT * FROM alertas");
$res = $query->fetchAll(PDO::FETCH_ASSOC);

echo json_encode([
    'success' => 'sucesso',
    'alertas' => $res
], JSON_UNESCAPED_UNICODE);
?>
