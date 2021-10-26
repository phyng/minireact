const http = require('http')
const fs = require('fs')

http
  .createServer((request, response) => {
    const baseURL = 'http://' + request.headers.host + '/'
    const url = new URL(request.url, baseURL)

    if (fs.existsSync('.' + url.pathname)) {
      const ext = url.pathname.split('.').pop()
      const contentType = {'html': 'text/html', 'js': 'application/javascript'}[ext] || 'text/plain'
      console.log(new Date(), request.method, 200, url.href, contentType)
      response.setHeader('Content-Type', contentType)
      response.writeHead(200)
      fs.createReadStream('.' + url.pathname).pipe(response)
    } else {
      console.log(new Date(), request.method, 404, url.href)
      response.writeHead(404)
      response.end()
    }
  })
  .listen(parseInt(process.env.PORT || '3010'))
