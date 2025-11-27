import React, { useState } from 'react';
import ApiService from '../../services/api';

const CreateProductModal = ({ onClose, onAction }) => {
    const [formData, setFormData] = useState({
        nome_produto: '',
        id_categoria: '',
        preco: '',
        desconto_percentual: '0',
        e_novo: false,
        estoque: '10',
        descricao_detalhada: '',
        imagem_url: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const categories = [
        { id: 1, nome: 'Manga' },
        { id: 2, nome: 'Caneca' },
        { id: 3, nome: 'Acessorios' }
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Validações
            if (!formData.nome_produto.trim()) {
                throw new Error('Nome do produto é obrigatório');
            }
            if (!formData.id_categoria) {
                throw new Error('Categoria é obrigatória');
            }
            if (!formData.preco || parseFloat(formData.preco) <= 0) {
                throw new Error('Preço deve ser maior que zero');
            }

            const productData = {
                ...formData,
                preco: parseFloat(formData.preco),
                desconto_percentual: parseFloat(formData.desconto_percentual),
                estoque: parseInt(formData.estoque),
                e_novo: formData.e_novo ? 1 : 0
            };

            const response = await ApiService.createProduct(productData);
            
            onAction('product-created', {
                ...productData,
                id_produto: response.product_id
            });
            
            onClose();
            
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    return (
        <div className="modal">
            <div className="modal-header">
                <h2>Cadastrar Novo Produto</h2>
                <button className="close-btn" onClick={onClose}>×</button>
            </div>
            
            {error && (
                <div className="modal-message message-error">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="modal-form">
                <div className="form-group">
                    <label>Nome do Produto *</label>
                    <input
                        type="text"
                        name="nome_produto"
                        value={formData.nome_produto}
                        onChange={handleChange}
                        required
                        disabled={loading}
                    />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Categoria *</label>
                        <select
                            name="id_categoria"
                            value={formData.id_categoria}
                            onChange={handleChange}
                            required
                            disabled={loading}
                        >
                            <option value="">Selecione...</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.nome}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Preço (R$) *</label>
                        <input
                            type="number"
                            step="0.01"
                            min="0.01"
                            name="preco"
                            value={formData.preco}
                            onChange={handleChange}
                            required
                            disabled={loading}
                        />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Desconto (%)</label>
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            max="100"
                            name="desconto_percentual"
                            value={formData.desconto_percentual}
                            onChange={handleChange}
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label>Estoque *</label>
                        <input
                            type="number"
                            min="0"
                            name="estoque"
                            value={formData.estoque}
                            onChange={handleChange}
                            required
                            disabled={loading}
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label>URL da Imagem</label>
                    <input
                        type="url"
                        name="imagem_url"
                        value={formData.imagem_url}
                        onChange={handleChange}
                        disabled={loading}
                    />
                </div>

                <div className="form-group">
                    <label>Descrição Detalhada</label>
                    <textarea
                        name="descricao_detalhada"
                        value={formData.descricao_detalhada}
                        onChange={handleChange}
                        rows="4"
                        disabled={loading}
                    />
                </div>

                <div className="form-checkbox">
                    <label>
                        <input
                            type="checkbox"
                            name="e_novo"
                            checked={formData.e_novo}
                            onChange={handleChange}
                            disabled={loading}
                        />
                        Produto Novo
                    </label>
                </div>

                <div className="modal-actions">
                    <button 
                        type="button" 
                        className="btn-secondary" 
                        onClick={onClose}
                        disabled={loading}
                    >
                        Cancelar
                    </button>
                    <button 
                        type="submit" 
                        className="btn-primary"
                        disabled={loading}
                    >
                        {loading ? 'Cadastrando...' : 'Cadastrar Produto'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateProductModal;