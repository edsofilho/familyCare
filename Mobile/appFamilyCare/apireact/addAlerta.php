<?php 
require_once("conexao.php");
// TROQUE O NOME DA SUA TABELA
$tabela = 'alertas';

$postjson = json_decode(file_get_contents('php://input'), true);


//COLOQUE O NOME DOS SEUS ATRIBUTOS
$nome = "Claudio";
$tipo = "queda";
$dataQueda = @$postjson['dataQueda'];

//TROQUE O NOME DOS ATRIBUTOS DA SUA TABELA DO BD
$res = $pdo->prepare("INSERT INTO $tabela SET nome_idoso = :nome_idoso, tipo = :tipo, data_queda = :data_queda");	


$res->bindValue(":nome_idoso", "$nome");
$res->bindValue(":tipo", "$tipo");
$res->bindValue(":data_queda", "$dataQueda");

$res->execute();

$result = json_encode(array('mensagem'=>'Salvo com sucesso!', 'sucesso'=>true));

echo $result;

?>