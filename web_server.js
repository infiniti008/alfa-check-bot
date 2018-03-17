function ROUTER(req, res){
    console.log('in router');

    if (req.method === 'POST' && req.url === '/web/incoming_message') {
        let body = [];
        req.on('data', (chunk) => {
          body.push(chunk);
        }).on('end', () => {
          body = Buffer.concat(body).toString();
          res.end('ok');
          console.log(body.plain);
        });
    }
    else if(req.url ==='/web'){
        res.statusCode = 200;
        res.end('Welcom to home page');
    }

    else{
        res.statusCode = 200;
        res.end('ok');
    }
}

module.exports = {
    ROUTER : ROUTER
}