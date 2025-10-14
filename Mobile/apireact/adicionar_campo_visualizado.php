<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

include_once('conexao.php');

try {
    // Adicionar campo visualizado na tabela alertas
    $sql = "ALTER TABLE alertas ADD COLUMN visualizado BOOLEAN DEFAULT FALSE";
    $result = $conn->query($sql);
    
    if ($result) {
        echo json_encode([
            'status' => 'sucesso',
            'mensagem' => 'Campo visualizado adicionado com sucesso'
        ]);
    } else {
        echo json_encode([
            'status' => 'erro',
            'mensagem' => 'Erro ao adicionar campo: ' . $conn->error
        ]);
    }
    
} catch (Exception $e) {
    echo json_encode(['status' => 'erro', 'mensagem' => $e->getMessage()]);
}
?>
