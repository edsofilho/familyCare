<?php 

include_once('conexao.php');

$postjson = json_decode(file_get_contents('php://input'), true);

$id_usu = @$_GET['user'];

$total_alertas = 0;

$query = $pdo->query("SELECT * from alertas ");
$res = $query->fetchAll(PDO::FETCH_ASSOC);
$total_alertas = @count($res);


$result = json_encode(array('success'=>true, 
    'total_alertas'=>$total_alertas
        
));

echo $result;

?>
