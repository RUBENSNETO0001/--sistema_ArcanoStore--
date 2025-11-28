<?php
    include '../controle/bancodedados.php'; 

    header("Access-Control-Allow-Origin: *"); 
    header("Content-Type: application/json; charset=UTF-8");

    $pedidosRecentes = array();

    if ($conexao) {
        $sql = "SELECT 
                    p.id_pedido AS id, 
                    c.nome AS cliente, 
                    p.item_principal AS item, 
                    p.valor_total AS valor, 
                    p.status
                FROM pedidos p
                JOIN clientes c ON p.id_cliente = c.id_cliente
                ORDER BY p.data_pedido DESC LIMIT 5";

        $resultado = $conexao->query($sql);

        if ($resultado) {
            while ($row = $resultado->fetch_assoc()) {
                $pedidosRecentes[] = $row;
            }
        }

        $conexao->close();

        http_response_code(200); 
        echo json_encode($pedidosRecentes);

    } else {
        http_response_code(503); 
        echo json_encode(array("message" => "Servidor de dados indisponível."));
    }
?>