<?php 
header('Content-Type: application/json');

// Simula o recebimento de dados
$postjson = json_decode(file_get_contents('php://input'), true);

// Carrega os dados existentes
$dados = json_decode(file_get_contents('dados.json'), true);

// Gera um novo ID
$ultimoId = end($dados['alertas'])['id'] ?? 0;
$novoId = $ultimoId + 1;

// Adiciona o novo alerta
$dados['alertas'][] = [
    'id' => $novoId,
    'nomeIdoso' => $postjson['nomeIdoso'] ?? 'João da Silva',
    'tipo' => $postjson['tipo'] ?? 'Queda',
    'dataQueda' => $postjson['dataQueda'] ?? date('Y-m-d H:i:s'),
    'localizacao' => $postjson['localizacao'] ?? 'Sala de estar'
];

// Salva os dados atualizados
file_put_contents('dados.json', json_encode($dados, JSON_UNESCAPED_UNICODE));

// Retorna mensagem de sucesso
echo json_encode([
    'sucesso' => true,
    'mensagem' => 'Alerta salvo com sucesso!'
], JSON_UNESCAPED_UNICODE);
?>