<?php
include_once '../controle-bd/bancodedados.php';

// Configurações da API
header("Access-Control-Allow-Origin: *"); 
header("Content-Type: application/json; charset=UTF-8");

$resposta = array(
    'total_receita' => 0.00,
    'total_pedidos' => 0,
    'total_clientes' => 0
);

if ($conexao) {
    // 1. Consulta Principal (Receita e Pedidos)
    $sql_kpi = "SELECT 
                    IFNULL(SUM(valor_total), 0) as total_receita, 
                    COUNT(id_pedido) as total_pedidos
                FROM pedidos 
                WHERE status = 'Aprovado' AND MONTH(data_pedido) = MONTH(CURDATE()) AND YEAR(data_pedido) = YEAR(CURDATE())";

    $resultado_kpi = $conexao->query($sql_kpi);

    if ($resultado_kpi && $row_kpi = $resultado_kpi->fetch_assoc()) {
        $resposta['total_receita'] = $row_kpi['total_receita'];
        $resposta['total_pedidos'] = $row_kpi['total_pedidos'];
    }

    // 2. Consulta de Novos Clientes (Clientes cadastrados neste mês)
    $sql_clientes = "SELECT COUNT(id_cliente) as total_clientes
                     FROM clientes
                     WHERE MONTH(data_cadastro) = MONTH(CURDATE()) AND YEAR(data_cadastro) = YEAR(CURDATE())";

    $resultado_clientes = $conexao->query($sql_clientes);

    if ($resultado_clientes && $row_clientes = $resultado_clientes->fetch_assoc()) {
        $resposta['total_clientes'] = $row_clientes['total_clientes'];
    }

    $conexao->close();

    http_response_code(200); 
    echo json_encode($resposta);

} else {
    http_response_code(503); 
    echo json_encode(array("message" => "Servidor de dados indisponível (Conexão MySQL falhou)."));
}
?>