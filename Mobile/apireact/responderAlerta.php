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
$alertaId = isset($postjson['alertaId']) ? intval($postjson['alertaId']) : (isset($_GET['alertaId']) ? intval($_GET['alertaId']) : null);
$cuidadorId = isset($postjson['cuidadorId']) ? intval($postjson['cuidadorId']) : (isset($_GET['cuidadorId']) ? intval($_GET['cuidadorId']) : null);
$acao = isset($postjson['acao']) ? $postjson['acao'] : (isset($_GET['acao']) ? $_GET['acao'] : null);
$observacao = isset($postjson['observacao']) ? $postjson['observacao'] : (isset($_GET['observacao']) ? $_GET['observacao'] : null);

// sanitize action
$acao = $acao ? strtolower(trim($acao)) : null;
if ($acao === 'visualizado') { $acao = 'respondido'; }
if ($acao === 'atender') { $acao = 'resolvido'; }

if (!$alertaId || !$acao) {
    error_log('responderAlerta.php - faltando parametros: alertaId=' . var_export($alertaId, true) . ' acao=' . var_export($acao, true) . ' cuidadorId=' . var_export($cuidadorId, true));
    echo json_encode(['status' => 'erro', 'mensagem' => 'Dados obrigatórios não fornecidos']);
    exit;
}

// 1) Tentar inserir histórico (não obrigatório)
try {
    $stmtHist = $conn->prepare("INSERT INTO alertas_respostas (alertaId, cuidadorId, acao, observacao, dataResposta) VALUES (?, ?, ?, ?, NOW())");
    $cid = $cuidadorId ? $cuidadorId : 0; // permite 0 quando não informado
    $stmtHist->bind_param("iiss", $alertaId, $cid, $acao, $observacao);
    $stmtHist->execute();
} catch (Throwable $e) {
    // Ignorar erros do histórico (ex.: FK se alertaId não existir ainda), mas logar para diagnóstico
    error_log('responderAlerta.php - historico ignorado: ' . $e->getMessage());
}

// 2) Atualizar status do alerta (obrigatório)
try {
    $novoStatus = ($acao === 'resolvido') ? 'resolvido' : 'respondido';
    $stmtUpd = $conn->prepare("UPDATE alertas SET status = ? WHERE id = ?");
    $stmtUpd->bind_param("si", $novoStatus, $alertaId);
    $stmtUpd->execute();
    $updated = $stmtUpd->affected_rows;

    echo json_encode([
        'status' => 'sucesso',
        'mensagem' => 'Resposta ao alerta registrada com sucesso',
        'atualizados' => $updated
    ]);
} catch (Throwable $e) {
    error_log('responderAlerta.php - UPDATE erro: ' . $e->getMessage());
    echo json_encode(['status' => 'erro', 'mensagem' => 'Falha ao atualizar status: ' . $e->getMessage()]);
}
?> 