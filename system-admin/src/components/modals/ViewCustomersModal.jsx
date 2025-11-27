import React, { useState, useEffect } from 'react';
import ApiService from '../../services/api';

const ViewCustomersModal = ({ onClose, onAction }) => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCustomers, setFilteredCustomers] = useState([]);

  useEffect(() => {
    loadCustomers();
  }, []);

  useEffect(() => {
    const filtered = customers.filter(customer =>
      customer.nome_completo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.cpf?.includes(searchTerm)
    );
    setFilteredCustomers(filtered);
  }, [searchTerm, customers]);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      // Como não temos um endpoint específico para clientes, vamos usar os dados dos pedidos
      // ou criar um endpoint específico
      const ordersResponse = await ApiService.getOrders();
      
      if (ordersResponse.success) {
        // Extrair clientes únicos dos pedidos
        const uniqueCustomers = {};
        ordersResponse.data.forEach(order => {
          if (order.cliente_nome && order.id_cliente) {
            uniqueCustomers[order.id_cliente] = {
              id: order.id_cliente,
              nome_completo: order.cliente_nome,
              // Podemos adicionar mais dados se disponíveis
              total_pedidos: (uniqueCustomers[order.id_cliente]?.total_pedidos || 0) + 1,
              total_gasto: (uniqueCustomers[order.id_cliente]?.total_gasto || 0) + parseFloat(order.valor_total || 0)
            };
          }
        });
        
        setCustomers(Object.values(uniqueCustomers));
      }
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
      setError('Erro ao carregar lista de clientes');
      // Dados mock para demonstração
      setCustomers(getMockCustomers());
    } finally {
      setLoading(false);
    }
  };

  const getMockCustomers = () => {
    return [
      {
        id: 3,
        nome_completo: 'admin da silva',
        email: 'admin@gmail.com',
        telefone: '000000000000',
        data_nascimento: '0001-01-01',
        total_pedidos: 2,
        total_gasto: 650.00,
        ultimo_pedido: '2025-11-26'
      },
      {
        id: 4,
        nome_completo: 'RUBENS NETO MARTINS SUAREZ',
        email: 'rubensnetomartinssuarezneto@outlook.com',
        telefone: '68992402349',
        data_nascimento: '2006-01-23',
        total_pedidos: 2,
        total_gasto: 370.50,
        ultimo_pedido: '2025-11-26'
      },
      {
        id: 5,
        nome_completo: 'Jose',
        email: 'josegaymes@hotmail.com',
        telefone: '68992402349',
        data_nascimento: '2025-10-01',
        total_pedidos: 2,
        total_gasto: 95.90,
        ultimo_pedido: '2025-11-25'
      },
      {
        id: 6,
        nome_completo: 'flavio do pneu',
        email: 'flaviodopeneu@gmail.com',
        telefone: '121212121212',
        data_nascimento: '2204-01-01',
        total_pedidos: 1,
        total_gasto: 450.00,
        ultimo_pedido: '2025-11-24'
      },
      {
        id: 7,
        nome_completo: 't',
        email: 't@gmail',
        telefone: '68992402349',
        data_nascimento: '0022-10-12',
        total_pedidos: 1,
        total_gasto: 99.90,
        ultimo_pedido: '2025-11-23'
      }
    ];
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString) => {
    if (!dateString || dateString === '0001-01-01') return 'Não informada';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatCPF = (cpf) => {
    if (!cpf || cpf === '00000000000') return 'Não informado';
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const getCustomerStatus = (totalPedidos, totalGasto) => {
    if (totalPedidos >= 5 || totalGasto >= 1000) return 'premium';
    if (totalPedidos >= 2 || totalGasto >= 200) return 'ativo';
    return 'novo';
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      premium: { label: 'Premium', class: 'premium' },
      ativo: { label: 'Ativo', class: 'active' },
      novo: { label: 'Novo', class: 'new' }
    };
    
    const config = statusConfig[status] || statusConfig.novo;
    
    return <span className={`customer-status ${config.class}`}>{config.label}</span>;
  };

  if (loading) {
    return (
      <div className="modal">
        <div className="modal-header">
          <h2>Lista de Clientes</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="modal-loading">
          <div className="loading-spinner"></div>
          <p>Carregando clientes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="modal large-modal">
      <div className="modal-header">
        <h2>Lista de Clientes ({filteredCustomers.length})</h2>
        <button className="close-btn" onClick={onClose}>×</button>
      </div>

      {error && (
        <div className="modal-message message-error">
          {error}
        </div>
      )}

      {/* Barra de Pesquisa e Filtros */}
      <div className="filter-bar">
        <div className="search-box">
          <input
            type="text"
            placeholder="Buscar por nome, email ou CPF..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-actions">
          <span className="customer-count">
            {filteredCustomers.length} cliente(s) encontrado(s)
          </span>
        </div>
      </div>

      <div className="table-container">
        {filteredCustomers.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">👥</div>
            <h3>Nenhum cliente encontrado</h3>
            <p>
              {searchTerm ? 
                'Tente ajustar os termos da busca.' : 
                'Não há clientes cadastrados no sistema.'
              }
            </p>
          </div>
        ) : (
          <table className="customers-table">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Contato</th>
                <th>Data Nasc.</th>
                <th>Status</th>
                <th>Total Pedidos</th>
                <th>Total Gasto</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map(customer => (
                <tr key={customer.id}>
                  <td>
                    <div className="customer-cell">
                      <div className="customer-avatar">
                        {customer.nome_completo?.charAt(0).toUpperCase() || 'C'}
                      </div>
                      <div className="customer-info">
                        <div className="customer-name">{customer.nome_completo}</div>
                        <div className="customer-cpf">{formatCPF(customer.cpf)}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="contact-info">
                      <div className="customer-email">{customer.email}</div>
                      <div className="customer-phone">{customer.telefone}</div>
                    </div>
                  </td>
                  <td>
                    <span className="birth-date">
                      {formatDate(customer.data_nascimento)}
                    </span>
                  </td>
                  <td>
                    {getStatusBadge(getCustomerStatus(customer.total_pedidos, customer.total_gasto))}
                  </td>
                  <td>
                    <div className="order-stats">
                      <span className="order-count">{customer.total_pedidos || 0}</span>
                      <span className="order-label">pedidos</span>
                    </div>
                  </td>
                  <td>
                    <div className="spending-stats">
                      <span className="spending-amount">
                        {formatCurrency(customer.total_gasto || 0)}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn-view"
                        onClick={() => onAction('view-customer-details', customer)}
                      >
                        Detalhes
                      </button>
                      <button 
                        className="btn-edit"
                        onClick={() => onAction('edit-customer', customer)}
                      >
                        Editar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Resumo */}
      <div className="customers-summary">
        <div className="summary-item">
          <span className="summary-label">Total de Clientes:</span>
          <span className="summary-value">{filteredCustomers.length}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Faturamento Total:</span>
          <span className="summary-value">
            {formatCurrency(filteredCustomers.reduce((sum, customer) => sum + (customer.total_gasto || 0), 0))}
          </span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Ticket Médio:</span>
          <span className="summary-value">
            {formatCurrency(
              filteredCustomers.length > 0 
                ? filteredCustomers.reduce((sum, customer) => sum + (customer.total_gasto || 0), 0) / filteredCustomers.length
                : 0
            )}
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

export default ViewCustomersModal;