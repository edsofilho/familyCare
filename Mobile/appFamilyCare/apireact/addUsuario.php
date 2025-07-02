<?php
// Headers básicos
header('Content-Type: application/json');

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

include_once('conexao.php');

$postjson = json_decode(file_get_contents('php://input'), true);

if (!$postjson || !isset($postjson['nome']) || !isset($postjson['telefone']) || !isset($postjson['email']) || !isset($postjson['senha'])) {
    echo json_encode([
        'status' => 'erro',
        'mensagem' => 'Dados de cadastro não enviados corretamente'
    ]);
    exit;
}

$nome = $postjson['nome'];
$telefone = $postjson['telefone'];
$email = trim($postjson['email']);
$senha = trim($postjson['senha']);
$codigoFamilia = isset($postjson['codigoFamilia']) ? $postjson['codigoFamilia'] : null;

try {
    // Hash da senha
    $senhaHash = password_hash($senha, PASSWORD_DEFAULT);
    
    // Inserir usuário
    $stmt = $conn->prepare("INSERT INTO usuarios (nome, telefone, email, senhaHash) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssss", $nome, $telefone, $email, $senhaHash);
    $stmt->execute();
    
    $usuarioId = $conn->insert_id;
    
    // Verificar se código de família foi fornecido
    if ($codigoFamilia) {
        // Buscar família existente
        $stmt = $conn->prepare("SELECT id FROM familias WHERE codigoEspecial = ?");
        $stmt->bind_param("s", $codigoFamilia);
        $stmt->execute();
        $result = $stmt->get_result();
        $familia = $result->fetch_assoc();
        
        if ($familia) {
            $familiaId = $familia['id'];
        } else {
            // Código inválido
            echo json_encode(['status' => 'erro', 'mensagem' => 'Código de família inválido']);
            exit;
        }
    } else {
        // Criar nova família
        $codigoEspecial = 'FAM' . time() . rand(100, 999);
        $nomeFamilia = $nome . ' Family';
        $stmt = $conn->prepare("INSERT INTO familias (nome, codigoEspecial) VALUES (?, ?)");
        $stmt->bind_param("ss", $nomeFamilia, $codigoEspecial);
        $stmt->execute();
        
        $familiaId = $conn->insert_id;
    }
    
    // Vincular usuário à família
    $stmt = $conn->prepare("INSERT INTO usuarios_familias (usuarioId, familiaId) VALUES (?, ?)");
    $stmt->bind_param("ii", $usuarioId, $familiaId);
    $stmt->execute();
    
    echo json_encode([
        'status' => 'sucesso', 
        'mensagem' => 'Usuário cadastrado com sucesso',
        'usuarioId' => $usuarioId,
        'familiaId' => $familiaId
    ]);
    
} catch (Exception $e) {
    echo json_encode(['status' => 'erro', 'mensagem' => 'Erro ao cadastrar']);
}
?>
