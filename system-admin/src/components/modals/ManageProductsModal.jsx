import React, { useState, useEffect } from 'react';
import ApiService from '../../services/api';

const ManageProductsModal = ({ onClose, onAction }) => {
    const [products, setProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            setLoading(true);
            const response = await ApiService.getProducts();
            setProducts(response.data || []);
        } catch (error) {
            setError('Erro ao carregar produtos: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (productId) => {
        if (window.confirm('Tem certeza que deseja excluir este produto?')) {
            try {
                await ApiService.deleteProduct(productId);
                setProducts(prev => prev.filter(p => p.id_produto !== productId));
                setSelectedProducts(prev => prev.filter(id => id !== productId));
                onAction('product-deleted', productId);
            } catch (error) {
                alert('Erro ao excluir produto: ' + error.message);
            }
        }
    };

    const handleBulkDelete = async () => {
        if (selectedProducts.length === 0) return;
        
        if (window.confirm(`Deseja excluir ${selectedProducts.length} produto(s)?`)) {
            try {
                // Delete em lote
                for (const productId of selectedProducts) {
                    await ApiService.deleteProduct(productId);
                }
                
                setProducts(prev => prev.filter(p => !selectedProducts.includes(p.id_produto)));
                setSelectedProducts([]);
                onAction('products-bulk-deleted', selectedProducts);
            } catch (error) {
                alert('Erro ao excluir produtos: ' + error.message);
            }
        }
    };

    const toggleSelectProduct = (productId) => {
        setSelectedProducts(prev =>
            prev.includes(productId)
                ? prev.filter(id => id !== productId)
                : [...prev, productId]
        );
    };

    const toggleSelectAll = () => {
        setSelectedProducts(prev =>
            prev.length === products.length
                ? []
                : products.map(p => p.id_produto)
        );
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    if (loading) {
        return (
            <div className="modal">
                <div className="modal-loading">
                    <div className="loading-spinner"></div>
                    <p>Carregando produtos...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="modal large-modal">
            <div className="modal-header">
                <h2>Gerenciar Produtos ({products.length})</h2>
                <button className="close-btn" onClick={onClose}>×</button>
            </div>

            {error && (
                <div className="modal-message message-error">
                    {error}
                </div>
            )}

            <div className="modal-actions-bar">
                <button 
                    className="btn-danger"
                    onClick={handleBulkDelete}
                    disabled={selectedProducts.length === 0}
                >
                    Excluir Selecionados ({selectedProducts.length})
                </button>
            </div>

            <div className="table-container">
                {products.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">📚</div>
                        <h3>Nenhum produto encontrado</h3>
                        <p>Comece adicionando seu primeiro produto.</p>
                    </div>
                ) : (
                    <table className="products-table">
                        <thead>
                            <tr>
                                <th>
                                    <input
                                        type="checkbox"
                                        checked={selectedProducts.length === products.length && products.length > 0}
                                        onChange={toggleSelectAll}
                                    />
                                </th>
                                <th>Produto</th>
                                <th>Categoria</th>
                                <th>Preço</th>
                                <th>Estoque</th>
                                <th>Status</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(product => (
                                <tr key={product.id_produto}>
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={selectedProducts.includes(product.id_produto)}
                                            onChange={() => toggleSelectProduct(product.id_produto)}
                                        />
                                    </td>
                                    <td>
                                        <div className="product-cell">
                                            {product.imagem_url && (
                                                <img src={product.imagem_url} alt={product.nome_produto} />
                                            )}
                                            <span>{product.nome_produto}</span>
                                        </div>
                                    </td>
                                    <td>{product.categoria}</td>
                                    <td>{formatCurrency(product.preco)}</td>
                                    <td>
                                        <span className={`stock-badge ${
                                            product.estoque <= 3 ? 'low' : 
                                            product.estoque <= 10 ? 'medium' : 'high'
                                        }`}>
                                            {product.estoque}
                                        </span>
                                    </td>
                                    <td>
                                        {product.e_novo && <span className="new-badge">Novo</span>}
                                        {product.desconto_percentual > 0 && (
                                            <span className="discount-badge">-{product.desconto_percentual}%</span>
                                        )}
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <button 
                                                className="btn-delete"
                                                onClick={() => handleDelete(product.id_produto)}
                                            >
                                                Excluir
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <div className="modal-footer">
                <button className="btn-secondary" onClick={onClose}>
                    Fechar
                </button>
            </div>
        </div>
    );
};

export default ManageProductsModal;