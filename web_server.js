function ROUTER(req, res){
    console.log('in router');
    
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

module.exports = {
    ROUTER : ROUTER
}