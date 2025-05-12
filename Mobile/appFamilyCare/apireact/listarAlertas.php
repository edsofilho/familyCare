<?php 
include_once('conexao.php');

$query = $pdo->query("SELECT * FROM alertas ORDER BY data DESC");

$res = $query->fetchAll(PDO::FETCH_ASSOC);

$dados = [];

for ($i = 0; $i < count($res); $i++) {
    $dados[] = array(
        'id' => $res[$i]['id'],
        'nomeIdoso' => $res[$i]['nomeIdoso'],
        'tipo' => $res[$i]['tipo']
    );
}

if (count($res) > 0) {
    $result = json_encode([
        'status' => 'sucesso',
        'alertas' => $dados
    ]);
} else {
    $result = json_encode([
        'status' => 'sucesso',
        'alertas' => []
    ]);
}

echo $result;
?>
