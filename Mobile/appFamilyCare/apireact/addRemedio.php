<?php
include('conexão.php');

header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"), true);

if (!empty($data['nome']) && !empty($data['horario'])) {
    $conn = new mysqli("localhost", "usuario", "senha", "banco");

    if ($conn->connect_error) {
        echo json_encode(["status" => "erro", "mensagem" => "Falha na conexão."]);
        exit;
    }

    $nome = $conn->real_escape_string($data['nome']);
    $horario = $conn->real_escape_string($data['horario']);

    $sql = "INSERT INTO remedios (nome, horario) VALUES ('$nome', '$horario')";
    if ($conn->query($sql) === TRUE) {
        echo json_encode(["status" => "sucesso"]);
    } else {
        echo json_encode(["status" => "erro", "mensagem" => "Erro ao salvar."]);
    }

    $conn->close();
} else {
    echo json_encode(["status" => "erro", "mensagem" => "Dados incompletos."]);
}
?>