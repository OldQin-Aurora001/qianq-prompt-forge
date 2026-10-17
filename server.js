// 浅浅拼词器 本地静态服务器（稳定性版 · T13-S8 配套，09-15）
// 用法：node server.js [端口号]，默认 8080
// 稳定性改造（豆总挂账单②）：全局异常捕获（单请求异常不再静默崩溃）+ 崩溃/退出日志（控制台+文件）
//                          + 启动横幅带服务版本 hash。路由行为与原版完全一致。
const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PORT = process.argv[2] || 8080;
const ROOT = __dirname;
const LOG_FILE = path.join(ROOT, 'server.log');
const MAIN_FILE = path.join(ROOT, '浅浅拼词器.html');

function log(msg) {
  var line = '[' + new Date().toISOString() + '] ' + msg;
  console.log(line);
  try { fs.appendFileSync(LOG_FILE, line + '\n'); } catch (e) { /* 日志写失败不阻断服务 */ }
}

// 启动时计算主文件版本 hash（横幅展示，方便确认服务的是哪个版本）
var MAIN_HASH = 'unknown';
try {
  MAIN_HASH = crypto.createHash('sha256').update(fs.readFileSync(MAIN_FILE)).digest('hex').slice(0, 8).toUpperCase();
} catch (e) { MAIN_HASH = 'unknown'; }

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.md': 'text/markdown; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8'
};

const server = http.createServer((req, res) => {
  try {
    var urlPath;
    try { urlPath = decodeURIComponent(req.url.split('?')[0]); }
    catch (e) { res.writeHead(400); res.end('Bad Request: malformed URL'); return; } // 畸形编码 URL（如 %%%）不再抛 URIError 崩进程
    if (urlPath === '/') urlPath = '/浅浅拼词器.html';

    const filePath = path.join(ROOT, urlPath);

    // 安全检查：防止目录遍历
    if (!filePath.startsWith(ROOT)) {
      res.writeHead(403);
      res.end('Forbidden');
      return;
    }

    fs.readFile(filePath, (err, data) => {
      try {
        if (err) {
          if (err.code === 'ENOENT') {
            res.writeHead(404);
            res.end('Not Found: ' + urlPath);
          } else {
            res.writeHead(500);
            res.end('Server Error: ' + err.message);
          }
          return;
        }
        const ext = path.extname(filePath).toLowerCase();
        const mime = MIME[ext] || 'application/octet-stream';
        res.writeHead(200, {
          'Content-Type': mime,
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Access-Control-Allow-Origin': '*'
        });
        res.end(data);
      } catch (e) {
        // 客户端中途断连等响应期异常：记日志、不崩进程
        log('⚠️ 响应期异常（客户端可能已断开）: ' + e.message + ' | ' + req.url);
        try { res.end(); } catch (e2) { /* 连接已死，无法收尾 */ }
      }
    });
  } catch (e) {
    log('⚠️ 请求处理异常: ' + e.message + ' | ' + req.url);
    try { res.writeHead(500); res.end('Server Error'); } catch (e2) { /* 连接已死 */ }
  }
});

// 全局异常捕获：任何未处理异常打日志（控制台+文件）——静态文件服务的单点异常不影响整体服务，不退出
process.on('uncaughtException', function (e) {
  log('⚠️ 未捕获异常（服务继续运行）: ' + (e && e.stack ? e.stack : e));
});
process.on('unhandledRejection', function (reason) {
  log('⚠️ 未处理的 Promise 拒绝（服务继续运行）: ' + (reason && reason.stack ? reason.stack : reason));
});
// 退出前最后一条日志（退出码+时间），崩溃不再静默
process.on('exit', function (code) {
  try { fs.appendFileSync(LOG_FILE, '[' + new Date().toISOString() + '] 服务退出，退出码=' + code + '\n'); } catch (e) { /* 关机期写失败忽略 */ }
});

server.listen(PORT, () => {
  log('========================================');
  log('  浅浅拼词器 本地服务器已启动（稳定性版）');
  log('  访问地址: http://localhost:' + PORT + '/');
  log('  服务版本: ' + MAIN_HASH + '（浅浅拼词器.html）');
  log('  启动时间: ' + new Date().toLocaleString());
  log('  日志文件: server.log（异常/退出均留痕）');
  log('  按 Ctrl+C 停止服务器');
  log('========================================');
});
