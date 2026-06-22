const { exec } = require('child_process');
const http = require('http');
const httpProxy = require('http-proxy');

console.log("Memulai 9Router dan Reverse Proxy...");

// 1. Jalankan 9Router di background (default port 20128)
const nineRouterProcess = exec('9router');

nineRouterProcess.stdout.on('data', (data) => console.log(`[9Router]: ${data.toString().trim()}`));
nineRouterProcess.stderr.on('data', (data) => console.error(`[9Router-Error]: ${data.toString().trim()}`));

// 2. Buat instance Proxy
const proxy = httpProxy.createProxyServer({});

// Tangani error jika proxy gagal konek sementara waktu
proxy.on('error', (err, req, res) => {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Proxy error: 9Router sedang bersiap, coba refresh kembali.');
});

// 3. Buat server utama untuk menangkap port dari Railway
const RAILWAY_PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
    // Oper semua trafik dari Railway langsung ke port internal 9Router (20128)
    proxy.web(req, res, { target: 'http://127.0.0.1:20128' });
});

server.listen(RAILWAY_PORT, () => {
    console.log(`Reverse Proxy aktif! Menjembatani Port Railway (${RAILWAY_PORT}) ke Port 9Router (20128)`);
});
