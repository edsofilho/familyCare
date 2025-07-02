<?php
// Headers CORS para permitir requisições do app
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Log de início
error_log("=== ADD ALERTA DEBUG ===");
error_log("Método: " . $_SERVER['REQUEST_METHOD']);

// Responder a requisições OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

include_once('conexao.php');

try {
    // Log dos dados recebidos
    $input = file_get_contents('php://input');
    error_log("Dados recebidos: " . $input);
    
    $data = json_decode($input, true);
    error_log("Dados decodificados: " . print_r($data, true));
    
    if (!$data) {
        error_log("ERRO: Dados JSON inválidos");
        echo json_encode(['success' => false, 'message' => 'Dados inválidos']);
        exit;
    }
    
    $id_idoso = $data['id_idoso'] ?? null;
    $tipo_alerta = $data['tipo_alerta'] ?? 'SOS';
    $descricao = $data['descricao'] ?? 'Alerta de emergência';
    
    if (!$id_idoso) {
        error_log("ERRO: ID do idoso não fornecido");
        echo json_encode(['success' => false, 'message' => 'ID do idoso é obrigatório']);
        exit;
    }
    
    // Verificar se o idoso existe
    $check_stmt = $conn->prepare("SELECT id, nome FROM idosos WHERE id = ?");
    $check_stmt->bind_param("i", $id_idoso);
    $check_stmt->execute();
    $check_result = $check_stmt->get_result();
    $idoso = $check_result->fetch_assoc();
    
    if (!$idoso) {
        echo json_encode(['success' => false, 'message' => 'Idoso não encontrado']);
        exit;
    }
    
    // Inserir alerta
    $stmt = $conn->prepare("INSERT INTO alertas (idosoId, tipo, dataAlerta, status) 
                           VALUES (?, ?, NOW(), 'ativo')");
    $stmt->bind_param("is", $id_idoso, $tipo_alerta);
    
    if ($stmt->execute()) {
        $alerta_id = $conn->insert_id;
        
        // Buscar cuidadores da família do idoso
        $cuidadores_stmt = $conn->prepare("
            SELECT DISTINCT u.id, u.nome, u.email, u.telefone 
            FROM usuarios u 
            JOIN usuarios_familias uf ON u.id = uf.usuarioId 
            JOIN familias_idosos fi ON uf.familiaId = fi.familiaId 
            WHERE fi.idosoId = ?
        ");
        $cuidadores_stmt->bind_param("i", $id_idoso);
        $cuidadores_stmt->execute();
        $cuidadores_result = $cuidadores_stmt->get_result();
        $cuidadores = [];
        while ($cuidador = $cuidadores_result->fetch_assoc()) {
            $cuidadores[] = $cuidador;
        }
        
        $response = [
            'success' => true,
            'message' => 'Alerta enviado com sucesso',
            'alerta' => [
                'id' => $alerta_id,
                'idoso' => $idoso['nome'],
                'tipo' => $tipo_alerta,
                'descricao' => $descricao,
                'data_hora' => date('Y-m-d H:i:s'),
                'status' => 'ativo'
            ],
            'cuidadores_notificados' => count($cuidadores),
            'cuidadores' => $cuidadores
        ];
        
        echo json_encode($response);
    } else {
        echo json_encode(['success' => false, 'message' => 'Erro ao inserir alerta']);
    }
    
} catch (Exception $e) {
    error_log("EXCEÇÃO: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Erro interno ao inserir alerta']);
}
?>