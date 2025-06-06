<?php 
require_once("conexao.php");
$tabela = 'alertas';

$postjson = json_decode(file_get_contents('php://input'), true);

$nomeIdoso = @$postjson['nomeIdoso'];
$tipo = @$postjson['tipo'];
$dataQueda = @$postjson['dataQueda'];

$res = $pdo->prepare("INSERT INTO $tabela SET nomeIdoso = :nomeIdoso, tipo = :tipo, dataQueda = :dataQueda");	


$res->bindValue(":nomeIdoso", "$nomeIdoso");
$res->bindValue(":tipo", "$tipo");
$res->bindValue(":dataQueda", "$dataQueda");

$res->execute();

$result = json_encode(array('mensagem'=>'Salvo com sucesso!', 'sucesso'=>true));

echo $result;

?>