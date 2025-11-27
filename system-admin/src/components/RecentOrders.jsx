import React from 'react';
import '../style/Dashboard.css';

const RecentOrders = ({ orders }) => {
  const getStatusBadge = (status) => {
    const statusClass = {
      'Aprovado': 'status-approved',
      'Pendente': 'status-pending',
      'Cancelado': 'status-cancelled'
    }[status] || 'status-default';
    
    return <span className={`status-badge ${statusClass}`}>{status}</span>;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="recent-orders">
      <h2>Pedidos Recentes</h2>
      <div className="orders-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Valor</th>
              <th>Status</th>
              <th>Data</th>
              <th>Item Principal</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={`order-${order.id_pedido}`}>
                <td>#{order.id_pedido}</td>
                <td>{order.cliente_nome}</td>
                <td>{formatCurrency(order.valor_total)}</td>
                <td>{getStatusBadge(order.status)}</td>
                <td>{formatDate(order.data_pedido)}</td>
                <td>{order.item_principal}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentOrders;    