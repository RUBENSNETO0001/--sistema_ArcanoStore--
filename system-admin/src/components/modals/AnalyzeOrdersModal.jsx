import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { dashboardData } from '../../data/mockData';

const AnalyzeOrdersModal = ({ onClose }) => {
  const orders = dashboardData.recentOrders;

  const statusData = orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {});

  const statusChartData = Object.entries(statusData).map(([name, value]) => ({
    name,
    value
  }));

  const salesByDay = orders.reduce((acc, order) => {
    const date = new Date(order.data_pedido).toLocaleDateString('pt-BR');
    acc[date] = (acc[date] || 0) + order.valor_total;
    return acc;
  }, {});

  const salesChartData = Object.entries(salesByDay).map(([date, sales]) => ({
    date,
    sales
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="modal large-modal">
      <div className="modal-header">
        <h2>Análise de Pedidos</h2>
        <button className="close-btn" onClick={onClose}>×</button>
      </div>

      <div className="analysis-grid">
        <div className="analysis-card">
          <h3>Distribuição por Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="analysis-card">
          <h3>Vendas por Data</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip 
                formatter={(value) => [
                  new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  }).format(value),
                  'Vendas'
                ]}
              />
              <Legend />
              <Bar dataKey="sales" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="stats-summary">
        <div className="stat-item">
          <h4>Total de Pedidos</h4>
          <p>{orders.length}</p>
        </div>
        <div className="stat-item">
          <h4>Valor Total</h4>
          <p>
            {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            }).format(orders.reduce((sum, order) => sum + order.valor_total, 0))}
          </p>
        </div>
        <div className="stat-item">
          <h4>Ticket Médio</h4>
          <p>
            {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            }).format(orders.reduce((sum, order) => sum + order.valor_total, 0) / orders.length)}
          </p>
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

export default AnalyzeOrdersModal;