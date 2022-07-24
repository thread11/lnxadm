const { createProxyMiddleware } = require('http-proxy-middleware');

const target = 'http://127.0.0.1:1234/';

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: target,
      changeOrigin: true,
    }),
  );
};
