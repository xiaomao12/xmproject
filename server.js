const http = require('http');
const https = require('https');
const url = require('url');

// 创建 HTTP 服务器
const server = http.createServer((req, res) => {
    // 解析客户端请求的 URL
    const parsedUrl = url.parse(req.url, true);
    const videoUrl = parsedUrl.query.url; // 从查询参数中获取视频 URL

    if (!videoUrl) {
        res.statusCode = 400;
        res.end('Video URL is required');
        return;
    }

    // 设置 Referer 头
    const options = {
        headers: {
            'Referer': 'https://haokan.baidu.com' // 替换为允许的域名
        }
    };

    // 发起 HTTPS 请求获取视频流
    https.get(videoUrl, options, (videoRes) => {
        // 设置响应头
        res.writeHead(videoRes.statusCode, videoRes.headers);

        // 将视频流传输到客户端
        videoRes.pipe(res);
    }).on('error', (err) => {
        console.error('Error fetching video:', err);
        res.statusCode = 500;
        res.end('Error fetching video');
    });
});

// 启动服务器
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});