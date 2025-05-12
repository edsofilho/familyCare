
<?php 

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With'); 
header('Content-Type: application/json; charset=utf-8');  


//dados do banco no servidor local
$banco = 'familycare';
$host = 'localhost';
$usuario = 'root';
$senha = '';



try {

	$pdo = new PDO("mysql:dbname=$banco;host=$host", "$usuario", "$senha");
     $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo 'Banco conctado';
	
} catch (Exception $e) {
	 echo json_encode(['status' => 'erro', 'mensagem' => 'Erro ao conectar com o banco!', 'erro' => $e->getMessage()]);
    exit;
}

 ?>
