<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

include_once('conexao.php');

$postjson = json_decode(file_get_contents('php://input'), true);

$nome = $postjson['nome'] ?? '';
$idade = isset($postjson['idade']) ? intval($postjson['idade']) : null;
$sexo = $postjson['sexo'] ?? '';
$altura = isset($postjson['altura']) ? floatval($postjson['altura']) : null;
$peso = isset($postjson['peso']) ? floatval($postjson['peso']) : null;
$carteiraSUS = $postjson['carteiraSUS'] ?? '';
$contatoEmergenciaNome = $postjson['contatoEmergenciaNome'] ?? '';
$contatoEmergenciaTelefone = $postjson['contatoEmergenciaTelefone'] ?? '';
$telefone = $postjson['telefone'] ?? '';
$email = $postjson['email'] ?? '';
$senha = $postjson['senha'] ?? '';
$familiaId = isset($postjson['familiaId']) ? intval($postjson['familiaId']) : null;
$condicoes = isset($postjson['condicoes']) ? $postjson['condicoes'] : [];
$responsavelPrincipalId = isset($postjson['responsavelPrincipalId']) ? intval($postjson['responsavelPrincipalId']) : null;

try {
    $senhaHash = password_hash($senha, PASSWORD_DEFAULT);
    $stmt = $conn->prepare("INSERT INTO idosos (nome, idade, sexo, altura, peso, carteiraSUS, contatoEmergenciaNome, contatoEmergenciaTelefone, telefone, email, senhaHash, cuidadorId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("sisddsssssi", $nome, $idade, $sexo, $altura, $peso, $carteiraSUS, $contatoEmergenciaNome, $contatoEmergenciaTelefone, $telefone, $email, $senhaHash, $responsavelPrincipalId);
    $stmt->execute();
    $idosoId = $conn->insert_id;
    $stmt = $conn->prepare("INSERT INTO familias_idosos (familiaId, idosoId) VALUES (?, ?)");
    $stmt->bind_param("ii", $familiaId, $idosoId);
    $stmt->execute();
    if (!empty($condicoes)) {
        foreach ($condicoes as $condicao) {
            $stmt = $conn->prepare("SELECT id FROM condicoes_medicas WHERE nome = ?");
            $stmt->bind_param("s", $condicao);
            $stmt->execute();
            $result = $stmt->get_result();
            $condicaoExistente = $result->fetch_assoc();
            if ($condicaoExistente) {
                $condicaoId = $condicaoExistente['id'];
            } else {
                $stmt = $conn->prepare("INSERT INTO condicoes_medicas (nome) VALUES (?)");
                $stmt->bind_param("s", $condicao);
                $stmt->execute();
                $condicaoId = $conn->insert_id;
            }
            $stmt = $conn->prepare("INSERT INTO idosos_condicoes (idosoId, condicaoId) VALUES (?, ?)");
            $stmt->bind_param("ii", $idosoId, $condicaoId);
            $stmt->execute();
        }
    }
    echo json_encode([
        'status' => 'sucesso', 
        'mensagem' => 'Idoso cadastrado com sucesso',
        'idosoId' => $idosoId
    ]);
} catch (Exception $e) {
    echo json_encode(['status' => 'erro', 'mensagem' => 'Erro ao cadastrar idoso']);
}
?> 