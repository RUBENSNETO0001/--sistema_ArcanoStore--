import React, { useState } from 'react';
import { dashboardData } from '../../data/mockData';

const ViewOrdersModal = ({ onClose, onAction }) => {
  const [orders, setOrders] = useState(dashboardData.recentOrders);
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredOrders = orders.filter(order => 
    filterStatus === 'all' || order.status === filterStatus
  );

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(order =>
      order.id_pedido === orderId ? { ...order, status: newStatus } : order
    ));
    onAction('order-status-updated', { orderId, newStatus });
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getStatusColor = (status) => {
    const colors = {
      'Aprovado': '#28a745',
      'Pendente': '#ffc107',
      'Cancelado': '#dc3545'
    };
    return colors[status] || '#6c757d';
  };

  return (
    <div className="modal large-modal">
      <div className="modal-header">
        <h2>Visualizar Pedidos</h2>
        <button className="close-btn" onClick={onClose}>×</button>
      </div>

      <div className="filter-bar">
        <select 
          value={filterStatus} 
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">Todos os Status</option>
          <option value="Aprovado">Aprovados</option>
          <option value="Pendente">Pendentes</option>
          <option value="Cancelado">Cancelados</option>
        </select>
      </div>

      <div className="table-container">
        <table className="orders-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Valor</th>
              <th>Status</th>
              <th>Data</th>
              <th>Itens</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(order => (
              <tr key={order.id_pedido}>
                <td>#{order.id_pedido}</td>
                <td>{order.cliente_nome}</td>
                <td>{formatCurrency(order.valor_total)}</td>
                <td>
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(order.status) }}
                  >
                    {order.status}
                  </span>
                </td>
                <td>{formatDate(order.data_pedido)}</td>
                <td>{order.item_principal}</td>
                <td>
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.id_pedido, e.target.value)}
                    className="status-select"
                  >
                    <option value="Aprovado">Aprovado</option>
                    <option value="Pendente">Pendente</option>
                    <option value="Cancelado">Cancelado</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="modal-footer">
        <button className="btn-secondary" onClick={onClose}>
          Fechar
        </button>
      </div>
    </div>
  );
};

export default ViewOrdersModal;