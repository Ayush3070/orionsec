const { createServer } = require('http');
const { request } = require('http');

const proxy = createServer((req, res) => {
  const options = {
    hostname: 'localhost',
    port: req.url.includes('/api') || req.url.includes('/intel') ? '8000' : '5173',
    path: req.url,
    method: req.method,
    headers: req.headers
  };
  
  console.log(`Proxying ${req.method} ${req.url} -> ${options.port}`);
  
  const proxyReq = request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res);
  });
  
  req.pipe(proxyReq);
});

proxy.listen(3000, () => console.log('Proxy running on http://localhost:3000'));
