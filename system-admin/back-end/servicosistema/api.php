<?php
// CORS headers mais permissivos
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Access-Control-Allow-Headers");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Log para debug (remova em produção)
error_log("API Request: " . $_SERVER['REQUEST_METHOD'] . " - " . $_SERVER['QUERY_STRING']);

require_once 'config/database.php';

class API {
    private $db;

    public function __construct() {
        $this->db = new Database();
    }

    // Helper method para enviar resposta JSON
    private function sendResponse($data, $statusCode = 200) {
        http_response_code($statusCode);
        echo json_encode($data);
        exit;
    }

    // Get dashboard stats
    public function getDashboardStats() {
        try {
            // Teste de conexão primeiro
            $testQuery = "SELECT 1";
            $testStmt = $this->db->conn->prepare($testQuery);
            $testStmt->execute();

            // Total de vendas (apenas pedidos aprovados)
            $query = "SELECT COALESCE(SUM(valor_total), 0) as total_sales FROM pedidos WHERE status = 'Aprovado'";
            $stmt = $this->db->conn->prepare($query);
            $stmt->execute();
            $totalSales = $stmt->fetch(PDO::FETCH_ASSOC);

            // Total de pedidos
            $query = "SELECT COUNT(*) as total_orders FROM pedidos";
            $stmt = $this->db->conn->prepare($query);
            $stmt->execute();
            $totalOrders = $stmt->fetch(PDO::FETCH_ASSOC);

            // Total de produtos
            $query = "SELECT COUNT(*) as total_products FROM produto";
            $stmt = $this->db->conn->prepare($query);
            $stmt->execute();
            $totalProducts = $stmt->fetch(PDO::FETCH_ASSOC);

            // Total de clientes
            $query = "SELECT COUNT(*) as total_customers FROM usuario";
            $stmt = $this->db->conn->prepare($query);
            $stmt->execute();
            $totalCustomers = $stmt->fetch(PDO::FETCH_ASSOC);

            $this->sendResponse([
                'success' => true,
                'data' => [
                    'totalSales' => floatval($totalSales['total_sales']),
                    'totalOrders' => intval($totalOrders['total_orders']),
                    'totalProducts' => intval($totalProducts['total_products']),
                    'totalCustomers' => intval($totalCustomers['total_customers'])
                ]
            ]);

        } catch (PDOException $e) {
            error_log("Database error in getDashboardStats: " . $e->getMessage());
            $this->sendResponse([
                'success' => false,
                'message' => 'Erro ao buscar estatísticas do banco de dados'
            ], 500);
        }
    }

    // Get all products
    public function getProducts() {
        try {
            $query = "SELECT p.*, c.nome_categoria as categoria, pi.imagem_url, pi.descricao_detalhada 
                      FROM produto p 
                      LEFT JOIN categoria c ON p.id_categoria = c.id_categoria 
                      LEFT JOIN produto_itens pi ON p.id_produto = pi.id_produto
                      ORDER BY p.id_produto DESC";
            
            $stmt = $this->db->conn->prepare($query);
            $stmt->execute();
            
            $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            $this->sendResponse([
                'success' => true,
                'data' => $products,
                'count' => count($products)
            ]);
            
        } catch (PDOException $e) {
            error_log("Database error in getProducts: " . $e->getMessage());
            $this->sendResponse([
                'success' => false,
                'message' => 'Erro ao buscar produtos'
            ], 500);
        }
    }

    // Get all orders
    public function getOrders() {
        try {
            $query = "SELECT p.*, u.nome_completo as cliente_nome 
                      FROM pedidos p 
                      LEFT JOIN usuario u ON p.id_cliente = u.id 
                      ORDER BY p.data_pedido DESC
                      LIMIT 50";
            
            $stmt = $this->db->conn->prepare($query);
            $stmt->execute();
            
            $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            $this->sendResponse([
                'success' => true,
                'data' => $orders,
                'count' => count($orders)
            ]);
            
        } catch (PDOException $e) {
            error_log("Database error in getOrders: " . $e->getMessage());
            $this->sendResponse([
                'success' => false,
                'message' => 'Erro ao buscar pedidos'
            ], 500);
        }
    }

    // Create product
    public function createProduct($data) {
        try {
            // Validação básica
            if (empty($data['nome_produto']) || empty($data['id_categoria'])) {
                $this->sendResponse([
                    'success' => false,
                    'message' => 'Nome e categoria são obrigatórios'
                ], 400);
            }

            $this->db->conn->beginTransaction();

            // Insere produto
            $query = "INSERT INTO produto (id_categoria, nome_produto, preco, desconto_percentual, e_novo, estoque) 
                      VALUES (:id_categoria, :nome_produto, :preco, :desconto_percentual, :e_novo, :estoque)";
            
            $stmt = $this->db->conn->prepare($query);
            $stmt->execute([
                ':id_categoria' => $data['id_categoria'],
                ':nome_produto' => $data['nome_produto'],
                ':preco' => $data['preco'] ?? 0,
                ':desconto_percentual' => $data['desconto_percentual'] ?? 0,
                ':e_novo' => $data['e_novo'] ?? 0,
                ':estoque' => $data['estoque'] ?? 0
            ]);

            $productId = $this->db->conn->lastInsertId();

            // Insere detalhes do produto se fornecidos
            if (!empty($data['imagem_url']) || !empty($data['descricao_detalhada'])) {
                $query = "INSERT INTO produto_itens (id_produto, imagem_url, descricao_detalhada) 
                          VALUES (:id_produto, :imagem_url, :descricao_detalhada)";
                
                $stmt = $this->db->conn->prepare($query);
                $stmt->execute([
                    ':id_produto' => $productId,
                    ':imagem_url' => $data['imagem_url'] ?? '',
                    ':descricao_detalhada' => $data['descricao_detalhada'] ?? ''
                ]);
            }

            $this->db->conn->commit();

            $this->sendResponse([
                'success' => true,
                'message' => 'Produto criado com sucesso',
                'product_id' => $productId
            ]);

        } catch (PDOException $e) {
            $this->db->conn->rollBack();
            error_log("Database error in createProduct: " . $e->getMessage());
            $this->sendResponse([
                'success' => false,
                'message' => 'Erro ao criar produto'
            ], 500);
        }
    }

    // Delete product
    public function deleteProduct($id) {
        try {
            $this->db->conn->beginTransaction();

            // Remove primeiro os itens do produto
            $query = "DELETE FROM produto_itens WHERE id_produto = :id";
            $stmt = $this->db->conn->prepare($query);
            $stmt->execute([':id' => $id]);

            // Remove o produto
            $query = "DELETE FROM produto WHERE id_produto = :id";
            $stmt = $this->db->conn->prepare($query);
            $stmt->execute([':id' => $id]);

            $this->db->conn->commit();

            $this->sendResponse([
                'success' => true,
                'message' => 'Produto excluído com sucesso'
            ]);

        } catch (PDOException $e) {
            $this->db->conn->rollBack();
            error_log("Database error in deleteProduct: " . $e->getMessage());
            $this->sendResponse([
                'success' => false,
                'message' => 'Erro ao excluir produto'
            ], 500);
        }
    }

    // Update order status
    public function updateOrderStatus($id, $status) {
        try {
            $query = "UPDATE pedidos SET status = :status WHERE id_pedido = :id";
            $stmt = $this->db->conn->prepare($query);
            $stmt->execute([
                ':status' => $status,
                ':id' => $id
            ]);

            $this->sendResponse([
                'success' => true,
                'message' => 'Status do pedido atualizado com sucesso'
            ]);

        } catch (PDOException $e) {
            error_log("Database error in updateOrderStatus: " . $e->getMessage());
            $this->sendResponse([
                'success' => false,
                'message' => 'Erro ao atualizar status do pedido'
            ], 500);
        }
    }
}

// Main request handler
try {
    $method = $_SERVER['REQUEST_METHOD'];
    $api = new API();

    // Parse query parameters
    $queryParams = [];
    parse_str($_SERVER['QUERY_STRING'] ?? '', $queryParams);

    // Get input data
    $input = json_decode(file_get_contents('php://input'), true) ?? [];

    // Log da requisição
    error_log("Processing: $method - Action: " . ($queryParams['action'] ?? 'none'));

    if ($method === 'GET' && isset($queryParams['action'])) {
        switch($queryParams['action']) {
            case 'getProducts':
                $api->getProducts();
                break;
            case 'getOrders':
                $api->getOrders();
                break;
            case 'getDashboardStats':
                $api->getDashboardStats();
                break;
            default:
                $api->sendResponse(['success' => false, 'message' => 'Ação não reconhecida'], 400);
        }
    } 
    elseif ($method === 'POST') {
        if (isset($input['action'])) {
            switch($input['action']) {
                case 'createProduct':
                    $api->createProduct($input['data'] ?? []);
                    break;
                case 'updateOrderStatus':
                    if (isset($input['id']) && isset($input['status'])) {
                        $api->updateOrderStatus($input['id'], $input['status']);
                    } else {
                        $api->sendResponse(['success' => false, 'message' => 'ID e status são obrigatórios'], 400);
                    }
                    break;
                default:
                    $api->sendResponse(['success' => false, 'message' => 'Ação não reconhecida'], 400);
            }
        } else {
            $api->sendResponse(['success' => false, 'message' => 'Parâmetro action é obrigatório'], 400);
        }
    }
    elseif ($method === 'DELETE') {
        if (isset($input['action']) && $input['action'] === 'deleteProduct' && isset($input['id'])) {
            $api->deleteProduct($input['id']);
        } else {
            $api->sendResponse(['success' => false, 'message' => 'ID do produto é obrigatório'], 400);
        }
    }
    else {
        $api->sendResponse(['success' => false, 'message' => 'Método não suportado'], 405);
    }

} catch (Exception $e) {
    error_log("Global error: " . $e->getMessage());
    $api->sendResponse([
        'success' => false,
        'message' => 'Erro interno do servidor'
    ], 500);
}

class API {
    private $db;

    public function __construct() {
        $this->db = new Database();
    }

    // ... outros métodos existentes ...

    // CATEGORIAS - NOVOS MÉTODOS
    public function getCategories() {
        try {
            $query = "SELECT c.*, COUNT(p.id_produto) as product_count 
                      FROM categoria c 
                      LEFT JOIN produto p ON c.id_categoria = p.id_categoria 
                      GROUP BY c.id_categoria, c.nome_categoria
                      ORDER BY c.nome_categoria";
            
            $stmt = $this->db->conn->prepare($query);
            $stmt->execute();
            
            $categories = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            $this->sendResponse([
                'success' => true,
                'data' => $categories,
                'count' => count($categories)
            ]);
            
        } catch (PDOException $e) {
            $this->sendResponse([
                'success' => false,
                'message' => 'Erro ao buscar categorias: ' . $e->getMessage()
            ], 500);
        }
    }

    public function createCategory($data) {
        try {
            if (empty($data['nome_categoria'])) {
                $this->sendResponse([
                    'success' => false,
                    'message' => 'Nome da categoria é obrigatório'
                ], 400);
            }

            // Verificar se categoria já existe
            $query = "SELECT id_categoria FROM categoria WHERE nome_categoria = :nome_categoria";
            $stmt = $this->db->conn->prepare($query);
            $stmt->execute([':nome_categoria' => $data['nome_categoria']]);
            
            if ($stmt->fetch()) {
                $this->sendResponse([
                    'success' => false,
                    'message' => 'Já existe uma categoria com este nome'
                ], 400);
            }

            $query = "INSERT INTO categoria (nome_categoria) VALUES (:nome_categoria)";
            $stmt = $this->db->conn->prepare($query);
            $stmt->execute([':nome_categoria' => $data['nome_categoria']]);

            $categoryId = $this->db->conn->lastInsertId();

            $this->sendResponse([
                'success' => true,
                'message' => 'Categoria criada com sucesso',
                'category_id' => $categoryId
            ]);

        } catch (PDOException $e) {
            $this->sendResponse([
                'success' => false,
                'message' => 'Erro ao criar categoria: ' . $e->getMessage()
            ], 500);
        }
    }

    public function updateCategory($id, $data) {
        try {
            if (empty($data['nome_categoria'])) {
                $this->sendResponse([
                    'success' => false,
                    'message' => 'Nome da categoria é obrigatório'
                ], 400);
            }

            // Verificar se outra categoria já tem este nome
            $query = "SELECT id_categoria FROM categoria WHERE nome_categoria = :nome_categoria AND id_categoria != :id";
            $stmt = $this->db->conn->prepare($query);
            $stmt->execute([
                ':nome_categoria' => $data['nome_categoria'],
                ':id' => $id
            ]);
            
            if ($stmt->fetch()) {
                $this->sendResponse([
                    'success' => false,
                    'message' => 'Já existe outra categoria com este nome'
                ], 400);
            }

            $query = "UPDATE categoria SET nome_categoria = :nome_categoria WHERE id_categoria = :id";
            $stmt = $this->db->conn->prepare($query);
            $stmt->execute([
                ':nome_categoria' => $data['nome_categoria'],
                ':id' => $id
            ]);

            $this->sendResponse([
                'success' => true,
                'message' => 'Categoria atualizada com sucesso'
            ]);

        } catch (PDOException $e) {
            $this->sendResponse([
                'success' => false,
                'message' => 'Erro ao atualizar categoria: ' . $e->getMessage()
            ], 500);
        }
    }

    public function deleteCategory($id) {
        try {
            // Verificar se existem produtos vinculados
            $query = "SELECT COUNT(*) as product_count FROM produto WHERE id_categoria = :id";
            $stmt = $this->db->conn->prepare($query);
            $stmt->execute([':id' => $id]);
            $result = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($result['product_count'] > 0) {
                $this->sendResponse([
                    'success' => false,
                    'message' => 'Não é possível excluir categoria com produtos vinculados'
                ], 400);
            }

            $query = "DELETE FROM categoria WHERE id_categoria = :id";
            $stmt = $this->db->conn->prepare($query);
            $stmt->execute([':id' => $id]);

            $this->sendResponse([
                'success' => true,
                'message' => 'Categoria excluída com sucesso'
            ]);

        } catch (PDOException $e) {
            $this->sendResponse([
                'success' => false,
                'message' => 'Erro ao excluir categoria: ' . $e->getMessage()
            ], 500);
        }
    }
}

// Handle requests - ATUALIZE O SWITCH PRINCIPAL
$method = $_SERVER['REQUEST_METHOD'];
$api = new API();

// Parse query parameters
$queryParams = [];
parse_str($_SERVER['QUERY_STRING'] ?? '', $queryParams);

// Get input data
$input = json_decode(file_get_contents('php://input'), true) ?? [];

try {
    if ($method === 'GET' && isset($queryParams['action'])) {
        switch($queryParams['action']) {
            case 'getProducts':
                $api->getProducts();
                break;
            case 'getProduct':
                if (isset($queryParams['id'])) {
                    $api->getProduct($queryParams['id']);
                }
                break;
            case 'getOrders':
                $api->getOrders();
                break;
            case 'getDashboardStats':
                $api->getDashboardStats();
                break;
            case 'getCategories': // NOVO CASE
                $api->getCategories();
                break;
            case 'getCustomers':
                $api->getCustomers();
                break;
            default:
                $api->sendResponse(['success' => false, 'message' => 'Ação não reconhecida'], 400);
        }
    } 
    elseif ($method === 'POST') {
        if (isset($input['action'])) {
            switch($input['action']) {
                case 'createProduct':
                    $api->createProduct($input['data'] ?? []);
                    break;
                case 'updateProduct':
                    if (isset($input['id']) && isset($input['data'])) {
                        $api->updateProduct($input['id'], $input['data']);
                    }
                    break;
                case 'updateOrderStatus':
                    if (isset($input['id']) && isset($input['status'])) {
                        $api->updateOrderStatus($input['id'], $input['status']);
                    }
                    break;
                case 'createCategory': // NOVO CASE
                    if (isset($input['data'])) {
                        $api->createCategory($input['data']);
                    }
                    break;
                case 'updateCategory': // NOVO CASE
                    if (isset($input['id']) && isset($input['data'])) {
                        $api->updateCategory($input['id'], $input['data']);
                    }
                    break;
                default:
                    $api->sendResponse(['success' => false, 'message' => 'Ação não reconhecida'], 400);
            }
        } else {
            $api->sendResponse(['success' => false, 'message' => 'Parâmetro action é obrigatório'], 400);
        }
    }
    elseif ($method === 'DELETE') {
        if (isset($input['action'])) {
            switch($input['action']) {
                case 'deleteProduct':
                    if (isset($input['id'])) {
                        $api->deleteProduct($input['id']);
                    }
                    break;
                case 'deleteCategory': // NOVO CASE
                    if (isset($input['id'])) {
                        $api->deleteCategory($input['id']);
                    }
                    break;
                default:
                    $api->sendResponse(['success' => false, 'message' => 'Ação não reconhecida'], 400);
            }
        } else {
            $api->sendResponse(['success' => false, 'message' => 'Parâmetro action é obrigatório'], 400);
        }
    }
    else {
        $api->sendResponse(['success' => false, 'message' => 'Método não suportado'], 405);
    }

} catch (Exception $e) {
    error_log("Global error: " . $e->getMessage());
    $api->sendResponse([
        'success' => false,
        'message' => 'Erro interno do servidor'
    ], 500);
}
?>