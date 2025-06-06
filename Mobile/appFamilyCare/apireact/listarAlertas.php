<?php 
include_once('conexao.php');

$postjson = json_decode(file_get_contents('php://input'), true);

$id_usu = @$_GET['user'];

$query = $pdo ->query("SELECT * FROM alertas");
$res = $query -> fetchAll(PDO::FETCH_ASSOC);

echo json_encode([
    'success' => true,
    'alertas' => $res
]);
echo $res;

?>
