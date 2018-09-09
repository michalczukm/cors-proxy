const http = require('http');
const url = require('url');
const httpProxy = require('http-proxy');

const target = process.argv[2];

const port = process.env.PORT || 8000;

const server = httpProxy.createProxyServer({
    target,
    changeOrigin: true,
    autoRewrite: true
});

server.on('proxyRes', (proxyRes, req, res) => {
    let allowedOrigin = false;
    if (req.headers.origin) {
        const originHostName = url.parse(req.headers.origin).hostname;
        res.setHeader('access-control-allow-origin', req.headers.origin);
        res.setHeader('access-control-allow-credentials', 'true');
        allowedOrigin = true;
    }

    if (req.headers['access-control-request-method']) {
        res.setHeader(
            'access-control-allow-methods', 
            req.headers['access-control-request-method']
        );
    }

    if (req.headers['access-control-request-headers']) {
        res.setHeader(
            'access-control-allow-headers', 
            req.headers['access-control-request-headers']
        );
    }

    if (allowedOrigin) {
        res.setHeader('access-control-max-age', 60 * 60 * 24 * 30);
        if (req.method === 'OPTIONS') {
            res.send(200);
            res.end();
        }
    }
});

server.listen(port);

console.log(`server is running on port: ${port}`);
