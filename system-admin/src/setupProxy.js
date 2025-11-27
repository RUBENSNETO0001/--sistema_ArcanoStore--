// src/setupProxy.js
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '/--sistema_ArcanoStore--/system-admin/back-end/servicosistema'
      },
      onProxyReq: (proxyReq, req, res) => {
        console.log('Proxyando:', req.url, '->', proxyReq.path);
      },
      onError: (err, req, res) => {
        console.error('Proxy Error:', err);
      }
    })
  );
};