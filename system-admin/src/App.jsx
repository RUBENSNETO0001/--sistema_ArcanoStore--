import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  Users, 
  Settings, 
  Search, 
  Bell, 
  TrendingUp, 
  AlertCircle,
  Clock,
  BarChart,
  DollarSign
} from 'lucide-react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// =========================================================
// VARIÁVEIS DE CONFIGURAÇÃO (AJUSTE AQUI)
// =========================================================
// Onde seus arquivos PHP de API estão hospedados
const API_BASE_URL = '../back-end/servicos/pedidos.php'; // Ajuste conforme necessário

const App = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estado para os KPIs (Vendas, Pedidos, Clientes, etc.)
  const [kpiData, setKpiData] = useState({
    total_receita: 0,
    total_pedidos: 0,
    total_clientes: 0,
  });

  // Estado para Estoque e Atividade Recente
  const [lowStock, setLowStock] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);

  // Estado para dados do Gráfico (Ajustar a API PHP para retornar dados semanais/mensais)
  const [chartData, setChartData] = useState([
    { name: 'Seg', vendas: 0 },
    { name: 'Ter', vendas: 0 },
    { name: 'Qua', vendas: 0 },
    { name: 'Qui', vendas: 0 },
    { name: 'Sex', vendas: 0 },
    { name: 'Sab', vendas: 0 },
    { name: 'Dom', vendas: 0 },
  ]);

  // Hook useEffect para buscar todos os dados
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1. Busca de KPIs (Receita, Pedidos)
        const kpiRes = await fetch(`${API_BASE_URL}/api_vendas.php`);
        if (!kpiRes.ok) throw new Error('Falha ao carregar KPIs');
        const kpiJson = await kpiRes.json();
        setKpiData({
          total_receita: parseFloat(kpiJson.total_receita) || 0,
          total_pedidos: parseInt(kpiJson.total_pedidos) || 0,
          total_clientes: parseInt(kpiJson.total_clientes) || 0,
        });
        
        // 2. Busca de Estoque Baixo
        const stockRes = await fetch(`${API_BASE_URL}/api_produtos_estoque.php`);
        if (!stockRes.ok) throw new Error('Falha ao carregar Estoque');
        const stockJson = await stockRes.json();
        setLowStock(stockJson);

        // 3. Busca de Pedidos Recentes
        const ordersRes = await fetch(`${API_BASE_URL}/api_pedidos_recentes.php`);
        if (!ordersRes.ok) throw new Error('Falha ao carregar Pedidos Recentes');
        const ordersJson = await ordersRes.json();
        setRecentOrders(ordersJson);

        // 4. Busca de Dados para o Gráfico (Simulando 7 dias)
        // Você deve criar um endpoint PHP específico para o gráfico
        // Por enquanto, fica com os dados mock para manter o visual
        // const chartRes = await fetch(`${API_BASE_URL}/api_grafico_vendas.php`);
        // const chartJson = await chartRes.json();
        // setChartData(chartJson);

      } catch (err) {
        console.error('Erro na Busca de Dados:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };
  
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-900 text-violet-500 text-lg font-semibold">
        🔮 Carregando o Arcano...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-slate-900 text-rose-500 p-8">
        <AlertCircle size={48} className="mb-4" />
        <h1 className="text-xl font-bold">Erro ao Conectar com a API PHP</h1>
        <p className="text-sm text-slate-400 mt-2 text-center">
          Verifique se o seu servidor PHP e os arquivos de API estão rodando corretamente em:
          <code className="block bg-slate-800 p-2 mt-2 rounded">{API_BASE_URL}</code>
        </p>
        <p className="text-sm text-slate-400 mt-2">Detalhes do erro: {error}</p>
      </div>
    );
  }

  // Dados reais para os cards de KPI
  const receitaTotalFormatada = formatCurrency(kpiData.total_receita);
  const estoqueCritico = lowStock.length;


  return (
    <div className="flex h-screen bg-slate-900 text-slate-100 font-sans">
      
      {/* Sidebar Lateral */}
      <aside className="w-64 bg-slate-950 border-r border-slate-800 hidden md:flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-violet-500 tracking-wider">ARCANO</h1>
          <p className="text-xs text-slate-500 mt-1">Painel Admin</p>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <SidebarItem icon={<LayoutDashboard size={20} />} text="Visão Geral" active />
          <SidebarItem icon={<ShoppingBag size={20} />} text="Pedidos" />
          <SidebarItem icon={<Package size={20} />} text="Produtos" />
          <SidebarItem icon={<Users size={20} />} text="Clientes" />
          <SidebarItem icon={<Settings size={20} />} text="Configurações" />
        </nav>
      </aside>

      {/* Conteúdo Principal (Visão Geral) */}
      <main className="flex-1 overflow-y-auto">
        <header className="h-16 bg-slate-950 border-b border-slate-800 flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex items-center bg-slate-900 rounded-lg px-3 py-2 w-96 border border-slate-800">
            <Search size={18} className="text-slate-500" />
            <input 
              type="text" 
              placeholder="Buscar pedidos, produtos..." 
              className="bg-transparent border-none outline-none text-sm ml-2 w-full text-slate-200"
            />
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 hover:bg-slate-800 rounded-full">
              <Bell size={20} className="text-slate-400" />
            </button>
            <div className="w-8 h-8 bg-violet-600 rounded-full flex items-center justify-center font-bold text-sm">A</div>
          </div>
        </header>
        
        {/* CORPO DO OVERVIEW */}
        <div className="p-4 md:p-8">
            
          {/* Título e Ação Rápida */}
          <div className="flex justify-between items-end mb-8 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-xl md:text-3xl font-extrabold text-white">Visão Geral Arcano</h2>
              <p className="text-slate-400 mt-1 text-sm md:text-base">Status da Loja em Tempo Real.</p>
            </div>
            <button className="bg-violet-600 hover:bg-violet-700 text-white px-3 py-2 md:px-5 md:py-2 rounded-lg text-xs md:text-sm font-medium transition-colors">
              + Criar Novo Pedido
            </button>
          </div>

          {/* Seção 1: Indicadores Chave (KPIs) - AGORA COM DADOS REAIS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
            <StatCard 
              title="Receita do Mês" 
              value={receitaTotalFormatada} // DADO REAL
              trend="+8,5%" 
              icon={<DollarSign size={24} className="text-emerald-400" />} 
            />
            <StatCard 
              title="Pedidos Ativos" 
              value={kpiData.total_pedidos.toLocaleString('pt-BR')} // DADO REAL
              trend="Nenhum cancelamento" 
              icon={<ShoppingBag size={24} className="text-violet-400" />} 
            />
            <StatCard 
              title="Novos Clientes" 
              value={kpiData.total_clientes.toLocaleString('pt-BR')} // DADO REAL
              trend="+12%" 
              icon={<Users size={24} className="text-sky-400" />} 
            />
            <StatCard 
              title="Estoque Crítico" 
              value={`${estoqueCritico} Itens`} // DADO REAL
              trend="Reposição Urgente" 
              isAlert 
              icon={<AlertCircle size={24} className="text-rose-400" />} 
            />
          </div>

          {/* Seção 2: Gráficos e Atividade Recente */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
            
            {/* Coluna 1: Gráfico de Vendas (Ocupa 2 Colunas) */}
            <div className="lg:col-span-2 bg-slate-950 p-6 rounded-xl border border-slate-800 shadow-xl">
              <h3 className="font-semibold mb-6 flex items-center text-slate-200">
                <BarChart size={18} className="mr-2 text-violet-400"/>
                Tendência de Vendas (Últimos 7 Dias)
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={chartData}>
                    <XAxis dataKey="name" stroke="#64748b" tick={{fontSize: 12}} />
                    <YAxis stroke="#64748b" tick={{fontSize: 12}} tickFormatter={(val) => formatCurrency(val)} />
                    <Tooltip 
                      formatter={(value) => [formatCurrency(value), 'Vendas']}
                      labelFormatter={(label) => `Dia: ${label}`}
                      contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff', borderRadius: '0.5rem' }} 
                      itemStyle={{ color: '#a78bfa' }}
                    />
                    <Bar dataKey="vendas" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Coluna 2: Lista de Alertas e Pedidos (Ocupa 1 Coluna) */}
            <div className="space-y-8">
                
                {/* Alerta de Estoque - DADOS REAIS */}
                <div className="bg-slate-950 p-6 rounded-xl border border-rose-800 shadow-xl">
                    <h3 className="font-semibold mb-4 flex items-center text-rose-400">
                       <AlertCircle size={18} className="mr-2"/> 
                       ⚠️ Estoque Baixo ({estoqueCritico})
                    </h3>
                    <div className="space-y-3">
                        {lowStock.length > 0 ? (
                            lowStock.map(item => (
                                <div key={item.id} className="flex justify-between text-sm text-slate-300">
                                    <span>{item.nome}</span>
                                    <span className="text-rose-400 font-bold">{item.qtd} uni.</span>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-emerald-400">Tudo em ordem no estoque Arcano!</p>
                        )}
                    </div>
                </div>

                {/* Pedidos Recentes - DADOS REAIS */}
                <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 shadow-xl">
                    <h3 className="font-semibold mb-4 flex items-center text-slate-200">
                        <Clock size={18} className="mr-2 text-violet-400"/>
                        Atividade Recente
                    </h3>
                    <div className="space-y-4">
                        {recentOrders.length > 0 ? (
                            recentOrders.map(order => (
                                <div key={order.id} className="flex justify-between text-sm border-b border-slate-900 pb-2 last:border-0">
                                    <div>
                                        <p className="text-slate-200 font-medium">{order.cliente}</p>
                                        <p className="text-xs text-slate-500">{order.item}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium text-violet-300">{formatCurrency(parseFloat(order.valor))}</p>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${order.status === 'Aprovado' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-slate-500">Nenhum pedido recente encontrado.</p>
                        )}
                    </div>
                    <button className="w-full mt-4 text-violet-500 text-sm hover:text-violet-400 transition-colors">Ver todos os pedidos</button>
                </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const SidebarItem = ({ icon, text, active }) => (
  <a 
    href="#" 
    className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors ${active ? 'bg-violet-600/10 text-violet-400' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}
  >
    {icon}
    <span>{text}</span>
  </a>
);

const StatCard = ({ title, value, trend, isAlert, icon }) => (
  <div className={`p-6 rounded-xl shadow-xl flex items-start justify-between 
                   ${isAlert ? 'bg-rose-950/20 border border-rose-800' : 'bg-slate-950 border border-slate-800'}`}>
    <div>
      <p className="text-slate-400 text-sm mb-1">{title}</p>
      <h3 className={`text-2xl font-bold ${isAlert ? 'text-rose-400' : 'text-slate-100'}`}>{value}</h3>
      <p className={`text-xs mt-2 font-medium ${isAlert ? 'text-rose-300' : 'text-emerald-400'}`}>
        {trend} {isAlert ? '' : 'vs mês anterior'}
      </p>
    </div>
    <div className={`p-3 rounded-lg ${isAlert ? 'bg-rose-950' : 'bg-slate-900'}`}>
      {icon}
    </div>
  </div>
);

export default App;