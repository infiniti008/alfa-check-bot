const http = require('http'); 
var bodyParser = require('body-parser');

webServer = http.createServer(requestListener);

webServer.listen(3000, '127.0.0.1', () => {
    console.log('localhost:3000');
});

function requestListener(req, res){


    if (req.method === 'POST' && req.url === '/web/incoming_message') {
        let body = [];
        req.on('data', (chunk) => {
          body.push(chunk);
        }).on('end', () => {
          body = Buffer.concat(body).toString();
          res.end(body);
          console.log(body);
        });
      }
      else{

        // console.log(Object.keys(req.connection.parser));
        // console.log(req.connection.parser.incoming);
        res.statusCode = 200;
        res.end('ok');
      }


    
}