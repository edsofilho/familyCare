<?php
// Headers CORS para permitir requisições do app
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

// Responder a requisições OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

include_once('conexao.php');

$postjson = json_decode(file_get_contents('php://input'), true);

$codigoColete = $postjson['codigoColete'] ?? '';
$idosoId = isset($postjson['idosoId']) ? intval($postjson['idosoId']) : null;

if (!$codigoColete || !$idosoId) {
    echo json_encode(['status' => 'erro', 'mensagem' => 'Código do colete e ID do idoso são obrigatórios']);
    exit;
}

try {
    // Verificar se o idoso existe
    $stmt = $conn->prepare("SELECT id, nome FROM idosos WHERE id = ?");
    $stmt->bind_param("i", $idosoId);
    $stmt->execute();
    $result = $stmt->get_result();
    $idoso = $result->fetch_assoc();
    
    if (!$idoso) {
        echo json_encode(['status' => 'erro', 'mensagem' => 'Idoso não encontrado']);
        exit;
    }
    
    // Verificar se o colete já existe na tabela coletes
    $stmt = $conn->prepare("SELECT id, idosoId FROM coletes WHERE codigo = ?");
    $stmt->bind_param("s", $codigoColete);
    $stmt->execute();
    $result = $stmt->get_result();
    $colete = $result->fetch_assoc();
    
    if ($colete) {
        // Colete já existe
        if ($colete['idosoId'] && $colete['idosoId'] != $idosoId) {
            echo json_encode(['status' => 'erro', 'mensagem' => 'Este colete já está vinculado a outro idoso']);
            exit;
        } else if ($colete['idosoId'] == $idosoId) {
            echo json_encode(['status' => 'sucesso', 'mensagem' => 'Colete já estava vinculado a este idoso']);
            exit;
        }
        
        // Atualizar o colete existente
        $stmt = $conn->prepare("UPDATE coletes SET idosoId = ?, dataVinculacao = NOW() WHERE codigo = ?");
        $stmt->bind_param("is", $idosoId, $codigoColete);
        $stmt->execute();
    } else {
        // Criar novo registro do colete
        $stmt = $conn->prepare("INSERT INTO coletes (codigo, idosoId, dataVinculacao, ativo) VALUES (?, ?, NOW(), 1)");
        $stmt->bind_param("si", $codigoColete, $idosoId);
        $stmt->execute();
    }
    
    echo json_encode([
        'status' => 'sucesso', 
        'mensagem' => 'Colete vinculado com sucesso ao idoso ' . $idoso['nome'],
        'colete' => [
            'codigo' => $codigoColete,
            'idosoId' => $idosoId,
            'idosoNome' => $idoso['nome']
        ]
    ]);
    
} catch (Exception $e) {
    echo json_encode(['status' => 'erro', 'mensagem' => 'Erro ao vincular colete: ' . $e->getMessage()]);
}
?>
