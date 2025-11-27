// Dados mock baseados na sua estrutura do banco
export const dashboardData = {
  stats: {
    totalSales: 1666.30,
    totalOrders: 8,
    totalProducts: 3,
    totalCustomers: 5
  },
  recentOrders: [
    {
      id_pedido: 1,
      id_cliente: 3,
      valor_total: 150.00,
      status: 'Aprovado',
      data_pedido: '2025-11-26T21:08:33',
      item_principal: 'Gachiakuta V.01 + Caneca',
      cliente_nome: 'admin da silva'
    },
    {
      id_pedido: 2,
      id_cliente: 4,
      valor_total: 320.50,
      status: 'Aprovado',
      data_pedido: '2025-11-26T17:08:33',
      item_principal: 'Pulseira One Piece',
      cliente_nome: 'RUBENS NETO MARTINS SUAREZ'
    },
    {
      id_pedido: 3,
      id_cliente: 5,
      valor_total: 75.90,
      status: 'Pendente',
      data_pedido: '2025-11-25T22:08:33',
      item_principal: 'Caneca do Pico',
      cliente_nome: 'Jose'
    },
    {
      id_pedido: 4,
      id_cliente: 6,
      valor_total: 450.00,
      status: 'Aprovado',
      data_pedido: '2025-11-24T22:08:33',
      item_principal: 'Vários Mangás',
      cliente_nome: 'flavio do pneu'
    }
  ],
  products: [
    {
      id_produto: 1,
      nome_produto: 'Gachiakuta Volume 01',
      preco: 50.90,
      desconto_percentual: 25.00,
      e_novo: 1,
      estoque: 8,
      categoria: 'Manga',
      imagem_url: 'https://img.assinaja.com/assets/tZ/099/img/512813_520x520.png'
    },
    {
      id_produto: 2,
      nome_produto: 'Caneca do pico',
      preco: 40.90,
      desconto_percentual: 0.00,
      e_novo: 0,
      estoque: 3,
      categoria: 'Caneca',
      imagem_url: 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcQrjob0f7BpjcXVOAylOww7zjT_-boZ0YYFTQ88rj9xLyDxwsCbi8MHePkgATWRTUD_suN88eAAV6PNH2W1-jq_vgWAbpRXKXTtgO5vH6kqkRrCH-jg2H8FXA'
    },
    {
      id_produto: 3,
      nome_produto: 'Pulseira One piece',
      preco: 30.90,
      desconto_percentual: 5.00,
      e_novo: 0,
      estoque: 12,
      categoria: 'Acessorios',
      imagem_url: 'https://m.media-amazon.com/images/I/410jh8W1t8S._SY1000_.jpg'
    }
  ],
  salesData: [
    { date: '2025-11-19', sales: 20.00 },
    { date: '2025-11-20', sales: 0 },
    { date: '2025-11-21', sales: 500.00 },
    { date: '2025-11-23', sales: 99.90 },
    { date: '2025-11-24', sales: 450.00 },
    { date: '2025-11-25', sales: 75.90 },
    { date: '2025-11-26', sales: 470.50 }
  ],
  categoryData: [
    { name: 'Manga', value: 1 },
    { name: 'Caneca', value: 1 },
    { name: 'Acessorios', value: 1 }
  ]
};