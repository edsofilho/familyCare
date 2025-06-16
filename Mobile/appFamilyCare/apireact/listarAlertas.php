<?php 
header('Content-Type: application/json');

// Carrega os dados do arquivo JSON
$dados = json_decode(file_get_contents('dados.json'), true);

// Retorna os alertas
echo json_encode([
    'success' => true,
    'alertas' => $dados['alertas']
], JSON_UNESCAPED_UNICODE);
?>
