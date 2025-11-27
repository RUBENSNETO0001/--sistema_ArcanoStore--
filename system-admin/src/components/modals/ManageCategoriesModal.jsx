import React, { useState, useEffect } from 'react';
import ApiService from '../../services/api';

const ManageCategoriesModal = ({ onClose, onAction }) => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editingCategory, setEditingCategory] = useState(null);
    const [formData, setFormData] = useState({
        nome_categoria: ''
    });
    const [showAddForm, setShowAddForm] = useState(false);

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            setLoading(true);
            // Buscar categorias - você pode criar um endpoint específico ou usar dados mock
            const productsResponse = await ApiService.getProducts();

            if (productsResponse.success) {
                // Extrair categorias únicas dos produtos
                const uniqueCategories = {};
                productsResponse.data.forEach(product => {
                    if (product.categoria && product.id_categoria) {
                        uniqueCategories[product.id_categoria] = {
                            id_categoria: product.id_categoria,
                            nome_categoria: product.categoria,
                            product_count: (uniqueCategories[product.id_categoria]?.product_count || 0) + 1
                        };
                    }
                });

                setCategories(Object.values(uniqueCategories));
            }
        } catch (error) {
            console.error('Erro ao carregar categorias:', error);
            setError('Erro ao carregar categorias');
            // Dados mock baseados no seu banco
            setCategories(getMockCategories());
        } finally {
            setLoading(false);
        }
    };

    const getMockCategories = () => {
        return [
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
        ];
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.nome_categoria.trim()) {
            setError('Nome da categoria é obrigatório');
            return;
        }

        try {
            setError('');

            if (editingCategory) {
                // Editar categoria existente
                await updateCategory(editingCategory.id_categoria, formData);
            } else {
                // Adicionar nova categoria
                await createCategory(formData);
            }

            // Limpar formulário
            setFormData({ nome_categoria: '' });
            setEditingCategory(null);
            setShowAddForm(false);

            // Recarregar categorias
            loadCategories();

        } catch (error) {
            setError('Erro ao salvar categoria: ' + error.message);
        }
    };

    const createCategory = async (categoryData) => {
        // Simulação de criação - você precisará implementar o endpoint na API
        const newCategory = {
            id_categoria: Math.max(...categories.map(c => c.id_categoria), 0) + 1,
            nome_categoria: categoryData.nome_categoria,
            product_count: 0
        };

        setCategories(prev => [...prev, newCategory]);
        onAction('category-created', newCategory);
    };

    const updateCategory = async (id, categoryData) => {
        // Simulação de atualização
        setCategories(prev =>
            prev.map(cat =>
                cat.id_categoria === id
                    ? { ...cat, nome_categoria: categoryData.nome_categoria }
                    : cat
            )
        );
        onAction('category-updated', { id, ...categoryData });
    };

    const deleteCategory = async (id) => {
        const category = categories.find(cat => cat.id_categoria === id);

        if (category.product_count > 0) {
            setError(`Não é possível excluir a categoria "${category.nome_categoria}" porque existem ${category.product_count} produto(s) vinculado(s) a ela.`);
            return;
        }

        if (window.confirm(`Tem certeza que deseja excluir a categoria "${category.nome_categoria}"?`)) {
            try {
                // Simulação de exclusão
                setCategories(prev => prev.filter(cat => cat.id_categoria !== id));
                onAction('category-deleted', id);
            } catch (error) {
                setError('Erro ao excluir categoria: ' + error.message);
            }
        }
    };

    const handleEdit = (category) => {
        setEditingCategory(category);
        setFormData({ nome_categoria: category.nome_categoria });
        setShowAddForm(true);
        setError('');
    };

    const handleCancel = () => {
        setFormData({ nome_categoria: '' });
        setEditingCategory(null);
        setShowAddForm(false);
        setError('');
    };

    const getCategoryUsage = (productCount) => {
        if (productCount === 0) return 'empty';
        if (productCount <= 3) return 'low';
        if (productCount <= 10) return 'medium';
        return 'high';
    };

    if (loading) {
        return (
            <div className="modal">
                <div className="modal-header">
                    <h2>Gerenciar Categorias</h2>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>
                <div className="modal-loading">
                    <div className="loading-spinner"></div>
                    <p>Carregando categorias...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="modal medium-modal">
            <div className="modal-header">
                <h2>Gerenciar Categorias</h2>
                <button className="close-btn" onClick={onClose}>×</button>
            </div>

            {error && (
                <div className="modal-message message-error">
                    {error}
                </div>
            )}

            {/* Formulário de Adicionar/Editar */}
            {showAddForm && (
                <div className="category-form-section">
                    <h3>{editingCategory ? 'Editar Categoria' : 'Nova Categoria'}</h3>
                    <form onSubmit={handleSubmit} className="modal-form">
                        <div className="form-group">
                            <label>Nome da Categoria *</label>
                            <input
                                type="text"
                                name="nome_categoria"
                                value={formData.nome_categoria}
                                onChange={(e) => setFormData({ nome_categoria: e.target.value })}
                                placeholder="Ex: Action Figures, Roupas, Livros..."
                                required
                                maxLength="50"
                            />
                        </div>

                        <div className="form-actions">
                            <button type="button" className="btn-secondary" onClick={handleCancel}>
                                Cancelar
                            </button>
                            <button type="submit" className="btn-primary">
                                {editingCategory ? 'Atualizar' : 'Adicionar'} Categoria
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Lista de Categorias */}
            <div className="categories-list-section">
                <div className="section-header">
                    <h3>Categorias Existentes ({categories.length})</h3>
                    {!showAddForm && (
                        <button
                            className="btn-primary"
                            onClick={() => {
                                setShowAddForm(true);
                                setEditingCategory(null);
                                setFormData({ nome_categoria: '' });
                                setError('');
                            }}
                        >
                            + Nova Categoria
                        </button>
                    )}
                </div>

                <div className="categories-grid">
                    {categories.length === 0 ? (
                        <div key="empty-state" className="empty-state">
                            <div className="empty-state-icon">🏷️</div>
                            <h3>Nenhuma categoria encontrada</h3>
                            <p>Comece criando sua primeira categoria.</p>
                        </div>
                    ) : (
                        categories.map(category => (
                            <div
                                key={`category-card-${category.id_categoria}`}
                                className="category-card"
                            >
                                <div className="category-header">
                                    <h4 className="category-name">{category.nome_categoria}</h4>
                                    <span className={`usage-badge ${getCategoryUsage(category.product_count)}`}>
                                        {category.product_count} produto(s)
                                    </span>
                                </div>

                                <div className="category-actions">
                                    <button
                                        className="btn-edit"
                                        onClick={() => handleEdit(category)}
                                    >
                                        Editar
                                    </button>
                                    <button
                                        className="btn-delete"
                                        onClick={() => deleteCategory(category.id_categoria)}
                                        disabled={category.product_count > 0}
                                        title={category.product_count > 0 ? 'Não é possível excluir categorias com produtos' : 'Excluir categoria'}
                                    >
                                        Excluir
                                    </button>
                                </div>

                                {category.product_count > 0 && (
                                    <div className="category-warning">
                                        ⚠️ Esta categoria possui produtos vinculados
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Estatísticas */}
            <div className="categories-stats">
                <div className="stat-item">
                    <span className="stat-label">Total de Categorias</span>
                    <span className="stat-value">{categories.length}</span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">Categorias em Uso</span>
                    <span className="stat-value">
                        {categories.filter(cat => cat.product_count > 0).length}
                    </span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">Categorias Vazias</span>
                    <span className="stat-value">
                        {categories.filter(cat => cat.product_count === 0).length}
                    </span>
                </div>
            </div>

            <div className="modal-footer">
                <button className="btn-secondary" onClick={onClose}>
                    Fechar
                </button>
            </div>
        </div>
    );
};

export default ManageCategoriesModal;