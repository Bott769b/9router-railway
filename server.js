const { exec } = require('child_process');

console.log("Memulai 9Router di Railway...");

// Menjalankan perintah 9router di latar belakang
const process = exec('9router');

process.stdout.on('data', (data) => {
    console.log(data.toString());
});

process.stderr.on('data', (data) => {
    console.error(data.toString());
});

// Trick utama: Membuat HTTP Server bayangan agar Railway mendeteksi 
// bahwa aplikasi ini aktif 24/7 dan tidak pernah Exit
const http = require('http');
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('9Router is Running!');
});

// Menggunakan port bawaan Railway
const PORT = process.env.PORT || 20128;
server.listen(PORT, () => {
    console.log(`Server penahan aktif di port ${PORT}`);
});
