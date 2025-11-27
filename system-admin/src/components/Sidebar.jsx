import React, { useState } from 'react';
import '../style/Sidebar.css';

const Sidebar = ({ activeView, setActiveView, onShowModal }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: '📊',
      subItems: []
    },
    {
      id: 'products',
      label: 'Produtos',
      icon: '📚',
      subItems: [
        { id: 'view-products', label: 'Ver Produtos', action: 'view-products' },
        { id: 'new-product', label: 'Novo Produto', action: 'new-product' },
        { id: 'manage-products', label: 'Gerenciar Produtos', action: 'manage-products' }
      ]
    },
    {
      id: 'orders',
      label: 'Pedidos',
      icon: '📦',
      subItems: [
        { id: 'view-orders', label: 'Ver Pedidos', action: 'view-orders' },
        { id: 'analyze-orders', label: 'Analisar Pedidos', action: 'analyze-orders' }
      ]
    },
    {
      id: 'categories',
      label: 'Categorias',
      icon: '🏷️',
      subItems: [
        { id: 'manage-categories', label: 'Gerenciar Categorias', action: 'manage-categories' }
      ]
    },
    {
      id: 'customers',
      label: 'Clientes',
      icon: '👥',
      subItems: [
        { id: 'view-customers', label: 'Ver Clientes', action: 'view-customers' }
      ]
    }
  ];

  const handleMenuItemClick = (itemId, action = null) => {
    if (action) {
      onShowModal(action);
    } else {
      setActiveView(itemId);
    }
  };

  const handleSubItemClick = (action) => {
    onShowModal(action);
  };

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      {/* Header da Sidebar */}
      <div className="sidebar-header">
        {!isCollapsed && (
          <div className="store-info">
            <h2>ArcanoStore</h2>
            <p>Admin Panel</p>
          </div>
        )}
        <button 
          className="collapse-btn"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? '➡️' : '⬅️'}
        </button>
      </div>

      {/* Menu Items */}
      <nav className="sidebar-nav">
        {menuItems.map(item => (
          <div key={item.id} className="nav-item"> {/* Chave única usando item.id */}
            <div 
              className={`nav-main-item ${activeView === item.id ? 'active' : ''}`}
              onClick={() => handleMenuItemClick(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              {!isCollapsed && (
                <>
                  <span className="nav-label">{item.label}</span>
                  {item.subItems.length > 0 && (
                    <span className="nav-arrow">▼</span>
                  )}
                </>
              )}
            </div>

            {/* Sub Items */}
            {!isCollapsed && item.subItems.length > 0 && (
              <div className="sub-items">
                {item.subItems.map(subItem => (
                  <div
                    key={subItem.id} // Chave única usando subItem.id
                    className="sub-item"
                    onClick={() => handleSubItemClick(subItem.action)}
                  >
                    {subItem.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Footer da Sidebar */}
      <div className="sidebar-footer">
        {!isCollapsed && (
          <div className="user-info">
            <div className="user-avatar">A</div>
            <div className="user-details">
              <span className="user-name">Administrador</span>
              <span className="user-role">Admin</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;