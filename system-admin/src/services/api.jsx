const API_BASE_URL = 'http://localhost/--sistema_ArcanoStore--/system-admin/back-end/servicosistema/api.php';

class ApiService {
    async request(endpoint, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;
        
        console.log('Fazendo requisição para:', url);
        
        try {
            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers,
                },
                ...options,
            });

            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('text/html')) {
                throw new Error('API retornou HTML em vez de JSON');
            }

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const text = await response.text();
            
            if (!text) {
                throw new Error('Resposta vazia da API');
            }

            const data = JSON.parse(text);
            
            if (!data.success) {
                throw new Error(data.message || 'Erro na requisição');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error.message);
            return this.getMockData(endpoint);
        }
    }

    // Método para retornar dados mock quando a API falhar
    getMockData(endpoint) {
        const mockData = {
            '?action=getDashboardStats': {
                success: true,
                data: {
                    totalSales: 1666.30,
                    totalOrders: 8,
                    totalProducts: 3,
                    totalCustomers: 5
                }
            },
            '?action=getProducts': {
                success: true,
                data: [
                    {
                        id_produto: 1,
                        nome_produto: 'Gachiakuta Volume 01',
                        preco: 50.90,
                        desconto_percentual: 25.00,
                        e_novo: 1,
                        estoque: 8,
                        categoria: 'Manga',
                        imagem_url: 'https://img.assinaja.com/assets/tZ/099/img/512813_520x520.png'
                    },
                    {
                        id_produto: 2,
                        nome_produto: 'Caneca do pico',
                        preco: 40.90,
                        desconto_percentual: 0.00,
                        e_novo: 0,
                        estoque: 3,
                        categoria: 'Caneca',
                        imagem_url: 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcQrjob0f7BpjcXVOAylOww7zjT_-boZ0YYFTQ88rj9xLyDxwsCbi8MHePkgATWRTUD_suN88eAAV6PNH2W1-jq_vgWAbpRXKXTtgO5vH6kqkRrCH-jg2H8FXA'
                    },
                    {
                        id_produto: 3,
                        nome_produto: 'Pulseira One piece',
                        preco: 30.90,
                        desconto_percentual: 5.00,
                        e_novo: 0,
                        estoque: 12,
                        categoria: 'Acessorios',
                        imagem_url: 'https://m.media-amazon.com/images/I/410jh8W1t8S._SY1000_.jpg'
                    }
                ]
            },
            '?action=getOrders': {
                success: true,
                data: [
                    {
                        id_pedido: 1,
                        id_cliente: 3,
                        valor_total: 150.00,
                        status: 'Aprovado',
                        data_pedido: '2025-11-26T21:08:33',
                        item_principal: 'Gachiakuta V.01 + Caneca',
                        cliente_nome: 'admin da silva'
                    },
                    {
                        id_pedido: 2,
                        id_cliente: 4,
                        valor_total: 320.50,
                        status: 'Aprovado',
                        data_pedido: '2025-11-26T17:08:33',
                        item_principal: 'Pulseira One Piece',
                        cliente_nome: 'RUBENS NETO MARTINS SUAREZ'
                    },
                    {
                        id_pedido: 3,
                        id_cliente: 5,
                        valor_total: 75.90,
                        status: 'Aprovado',
                        data_pedido: '2025-11-25T22:08:33',
                        item_principal: 'Caneca do Pico',
                        cliente_nome: 'Jose'
                    }
                ]
            },
            '?action=getCategories': {
                success: true,
                data: [
                    {
                        id_categoria: 1,
                        nome_categoria: 'Manga',
                        product_count: 1
                    },
                    {
                        id_categoria: 2,
                        nome_categoria: 'Caneca',
                        product_count: 1
                    },
                    {
                        id_categoria: 3,
                        nome_categoria: 'Acessorios',
                        product_count: 1
                    }
                ]
            }
        };

        return Promise.resolve(mockData[endpoint] || { success: false, data: [] });
    }

    async getProducts() {
        return this.request('?action=getProducts');
    }

    async getProduct(id) {
        return this.request(`?action=getProduct&id=${id}`);
    }

    async createProduct(productData) {
        return this.request('', {
            method: 'POST',
            body: JSON.stringify({
                action: 'createProduct',
                data: productData
            })
        });
    }

    async updateProduct(id, productData) {
        return this.request('', {
            method: 'POST',
            body: JSON.stringify({
                action: 'updateProduct',
                id: id,
                data: productData
            })
        });
    }

    async deleteProduct(id) {
        return this.request('', {
            method: 'DELETE',
            body: JSON.stringify({
                action: 'deleteProduct',
                id: id
            })
        });
    }

    async getOrders() {
        return this.request('?action=getOrders');
    }

    async updateOrderStatus(id, status) {
        return this.request('', {
            method: 'POST',
            body: JSON.stringify({
                action: 'updateOrderStatus',
                id: id,
                status: status
            })
        });
    }

    async getDashboardStats() {
        return this.request('?action=getDashboardStats');
    }

    async getCategories() {
        return this.request('?action=getCategories');
    }

    async createCategory(categoryData) {
        return this.request('', {
            method: 'POST',
            body: JSON.stringify({
                action: 'createCategory',
                data: categoryData
            })
        });
    }

    async updateCategory(id, categoryData) {
        return this.request('', {
            method: 'POST',
            body: JSON.stringify({
                action: 'updateCategory',
                id: id,
                data: categoryData
            })
        });
    }

    async deleteCategory(id, categoryData) {
        return this.request('', {
            method: 'DELETE',
            body: JSON.stringify({
                action: 'deleteCategory',
                id: id
            })
        });
    }

    async getCustomers() {
        return this.request('?action=getCustomers');
    }
}

export default new ApiService();