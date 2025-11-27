<?php
include'../controle/bancodedados.php';

header("Access-Control-Allow-Origin: *"); 
header("Content-Type: application/json; charset=UTF-8");

$ESTOQUE_MINIMO = 5;
$produtosBaixoEstoque = array();

if ($conexao) {
    // Seleciona itens com estoque abaixo do mínimo
    $sql = "SELECT 
                id_produto AS id, 
                nome, 
                estoque AS qtd 
            FROM 
                produtos 
            WHERE 
                estoque < ? 
            ORDER BY 
                estoque ASC";

    $stmt = $conexao->prepare($sql);
    
    if ($stmt) {
        $stmt->bind_param("i", $ESTOQUE_MINIMO);
        $stmt->execute();
        $result = $stmt->get_result();

        while ($row = $result->fetch_assoc()) {
            $produtosBaixoEstoque[] = $row;
        }

        $stmt->close();
    }
    
    $conexao->close();

    http_response_code(200);
    echo json_encode($produtosBaixoEstoque);

} else {
    http_response_code(503);
    echo json_encode(array("message" => "Servidor de dados indisponível."));
}
?>