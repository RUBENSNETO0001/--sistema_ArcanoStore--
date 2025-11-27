import React from 'react';
import '../style/Dashboard.css';

const ProductsList = ({ products }) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getStockStatus = (stock) => {
    if (stock <= 3) return 'stock-low';
    if (stock <= 10) return 'stock-medium';
    return 'stock-high';
  };

  return (
    <div className="products-list">
      <h2>Produtos em Destaque</h2>
      <div className="products-grid">
        {products.map(product => (
          <div key={product.id_produto} className="product-card">
            <div className="product-image">
              <img src={product.imagem_url} alt={product.nome_produto} />
            </div>
            <div className="product-info">
              <h4>{product.nome_produto}</h4>
              <p className="product-category">{product.categoria}</p>
              <div className="product-price">
                <span className="current-price">
                  {formatCurrency(product.preco * (1 - product.desconto_percentual / 100))}
                </span>
                {product.desconto_percentual > 0 && (
                  <span className="original-price">
                    {formatCurrency(product.preco)}
                  </span>
                )}
              </div>
              <div className="product-details">
                <span className={`stock-status ${getStockStatus(product.estoque)}`}>
                  Estoque: {product.estoque}
                </span>
                {product.e_novo && <span className="new-badge">Novo</span>}
                {product.desconto_percentual > 0 && (
                  <span className="discount-badge">-{product.desconto_percentual}%</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsList;