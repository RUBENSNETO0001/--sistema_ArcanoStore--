import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import ModalManager from './ModalManager';
import StatsCard from './StatsCard';
import RecentOrders from './RecentOrders';
import ProductsList from './ProductsList';
import SalesChart from './Charts/SalesChart';
import CategoryChart from './Charts/CategoryChart';
import { dashboardData } from '../data/mockData';
import '../style/Dashboard.css';
import ApiService from '../services/api';

const Dashboard = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const [activeModal, setActiveModal] = useState(null);
  
  const [stats, setStats] = useState(dashboardData.stats);
  const [recentOrders, setRecentOrders] = useState(dashboardData.recentOrders);
  const [products, setProducts] = useState(dashboardData.products);
  const [salesData, setSalesData] = useState(dashboardData.salesData);
  const [categoryData, setCategoryData] = useState(dashboardData.categoryData);
  const [loading, setLoading] = useState(true);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      const [statsResponse, productsResponse, ordersResponse] = await Promise.all([
        ApiService.getDashboardStats(),
        ApiService.getProducts(),
        ApiService.getOrders()
      ]);

      if (statsResponse.success) {
        setStats(statsResponse.data);
      }
      
      if (productsResponse.success) {
        setProducts(productsResponse.data || []);
        
        const categoryCount = productsResponse.data.reduce((acc, product) => {
          const category = product.categoria || 'Sem Categoria';
          acc[category] = (acc[category] || 0) + 1;
          return acc;
        }, {});
        
        const newCategoryData = Object.entries(categoryCount).map(([name, value]) => ({
          name,
          value
        }));
        setCategoryData(newCategoryData);
      }
      
      if (ordersResponse.success) {
        const orders = ordersResponse.data || [];
        setRecentOrders(orders);
        
        const salesByDate = orders.reduce((acc, order) => {
          if (order.status === 'Aprovado') {
            const date = new Date(order.data_pedido).toLocaleDateString('pt-BR');
            acc[date] = (acc[date] || 0) + parseFloat(order.valor_total);
          }
          return acc;
        }, {});
        
        const newSalesData = Object.entries(salesByDate).map(([date, sales]) => ({
          date,
          sales
        }));
        setSalesData(newSalesData);
      }
      
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleShowModal = (modalType) => {
    setActiveModal(modalType);
  };

  const handleCloseModal = () => {
    setActiveModal(null);
    // Recarrega os dados quando um modal é fechado (após criar/editar/excluir)
    loadDashboardData();
  };

  const handleModalAction = (action, data) => {
    console.log('Ação do modal:', action, data);
    
    switch (action) {
      case 'product-created':
      case 'product-deleted':
      case 'products-bulk-deleted':
        loadDashboardData(); 
        break;
      case 'order-status-updated':
        ApiService.getOrders()
          .then(response => {
            if (response.success) {
              setRecentOrders(response.data || []);
            }
          })
          .catch(error => console.error('Erro ao atualizar pedidos:', error));
        break;
      default:
        break;
    }
  };

  const statsIcons = {
    sales: '💰',
    orders: '📦',
    products: '📚',
    customers: '👥'
  };

  if (loading) {
    return (
      <div className="app">
        <Sidebar 
          activeView={activeView}
          setActiveView={setActiveView}
          onShowModal={handleShowModal}
        />
        <main className="main-content">
          <div className="dashboard-loading">
            <div className="loading-spinner"></div>
            <p>Carregando dashboard...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="app">
      <Sidebar 
        activeView={activeView}
        setActiveView={setActiveView}
        onShowModal={handleShowModal}
      />
      
      <main className="main-content">
        <div className="dashboard">
          <header className="dashboard-header">
            <h1>ArcanoStore Dashboard</h1>
            <p>Painel de controle da loja de produtos geek</p>
          </header>

          {/* Cards de Estatísticas */}
          <div className="stats-grid">
            <StatsCard
              title="Total de Vendas"
              value={new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              }).format(stats.totalSales)}
              icon={statsIcons.sales}
              color="primary"
            />
            <StatsCard
              title="Total de Pedidos"
              value={stats.totalOrders}
              icon={statsIcons.orders}
              color="secondary"
            />
            <StatsCard
              title="Produtos Ativos"
              value={stats.totalProducts}
              icon={statsIcons.products}
              color="success"
            />
            <StatsCard
              title="Clientes Cadastrados"
              value={stats.totalCustomers}
              icon={statsIcons.customers}
              color="warning"
            />
          </div>

          {/* Gráficos */}
          <div className="charts-grid">
            <div className="chart-wrapper">
              <SalesChart data={salesData} />
            </div>
            <div className="chart-wrapper">
              <CategoryChart data={categoryData} />
            </div>
          </div>

          {/* Conteúdo Inferior */}
          <div className="content-grid">
            <div className="content-column">
              <RecentOrders orders={recentOrders} />
            </div>
            <div className="content-column">
              <ProductsList products={products} />
            </div>
          </div>
        </div>
      </main>

      <ModalManager 
        activeModal={activeModal}
        onClose={handleCloseModal}
        onAction={handleModalAction}
      />
    </div>
  );
};

export default Dashboard;