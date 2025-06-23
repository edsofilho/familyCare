<?php
header('Content-Type: application/json');

// Configuração do banco de dados
$host = 'localhost';
$dbname = 'familycare';
$username = 'root';
$password = '';

try {
    // Conexão com o banco de dados
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Consulta os alertas
    $stmt = $pdo->query("SELECT * FROM alertas ORDER BY data_queda DESC");
    $alertas = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Retorna os alertas
    echo json_encode([
        'success' => true,
        'alertas' => $alertas
    ], JSON_UNESCAPED_UNICODE);
    
} catch(PDOException $e) {
    echo json_encode([
        'success' => false,
        'mensagem' => 'Erro ao listar alertas: ' . $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}
?>
