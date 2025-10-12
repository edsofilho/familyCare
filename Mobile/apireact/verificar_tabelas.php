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

try {
    $tabelas = [
        'usuarios',
        'idosos', 
        'familias',
        'usuarios_familias',
        'familias_idosos',
        'condicoes_medicas',
        'idosos_condicoes',
        'alertas',
        'alertas_respostas',
        'remedios',
        'solicitacoes_familia'
    ];
    $resultado = [];
    foreach ($tabelas as $tabela) {
        $stmt = $conn->prepare("SHOW TABLES LIKE '$tabela'");
        $stmt->execute();
        $result = $stmt->get_result();
        $existe = $result->num_rows > 0;
        $resultado[$tabela] = $existe ? 'EXISTE' : 'NÃO EXISTE';
    }
    $stmt = $conn->prepare("SELECT COUNT(*) as total FROM usuarios");
    $stmt->execute();
    $result = $stmt->get_result();
    $usuarios = $result->fetch_assoc()['total'];
    $stmt = $conn->prepare("SELECT COUNT(*) as total FROM familias");
    $stmt->execute();
    $result = $stmt->get_result();
    $familias = $result->fetch_assoc()['total'];
    echo json_encode([
        'status' => 'sucesso',
        'tabelas' => $resultado,
        'dados' => [
            'usuarios' => $usuarios,
            'familias' => $familias
        ]
    ]);
} catch (Exception $e) {
    echo json_encode([
        'status' => 'erro',
        'mensagem' => 'Erro ao verificar tabelas'
    ]);
}
?> 