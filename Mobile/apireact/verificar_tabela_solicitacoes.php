<?php
ini_set('display_errors', 0);
ini_set('display_startup_errors', 0);
error_reporting(0);

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
include_once('conexao.php');

try {
    $result = $conn->query("SHOW TABLES LIKE 'solicitacoes_familia'");
    $tabelaExiste = $result->num_rows > 0;
    if (!$tabelaExiste) {
        echo json_encode([
            'status' => 'erro',
            'mensagem' => 'Tabela solicitacoes_familia não existe'
        ]);
        exit;
    }
    $result = $conn->query("DESCRIBE solicitacoes_familia");
    $colunas = [];
    while ($row = $result->fetch_assoc()) {
        $colunas[] = $row;
    }
    $stmt = $conn->prepare("INSERT INTO solicitacoes_familia (familiaId, usuarioId, cuidadorId, status, criadoEm) VALUES (?, ?, ?, ?, NOW())");
    $familiaId = 1;
    $usuarioId = 1;
    $cuidadorId = 16;
    $status = 'pendente';
    $stmt->bind_param("iiis", $familiaId, $usuarioId, $cuidadorId, $status);
    $sucesso = $stmt->execute();
    if ($sucesso) {
        $idInserido = $conn->insert_id;
        $conn->query("DELETE FROM solicitacoes_familia WHERE id = $idInserido");
        echo json_encode([
            'status' => 'sucesso',
            'mensagem' => 'Tabela funcionando corretamente',
            'colunas' => $colunas,
            'teste_insert' => 'OK',
            'id_inserido' => $idInserido
        ]);
    } else {
        echo json_encode([
            'status' => 'erro',
            'mensagem' => 'Erro no teste de inserção',
            'colunas' => $colunas
        ]);
    }
} catch (Exception $e) {
    echo json_encode([
        'status' => 'erro',
        'mensagem' => 'Erro ao testar tabela solicitacoes_familia'
    ]);
}
?> 