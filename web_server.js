function ROUTER(req, res){
    console.log('in router');

    if (req.method === 'POST' && req.url === '/web/incoming_message') {
        let body = [];
        req.on('data', (chunk) => {
          body.push(chunk);
        }).on('end', () => {
            body = Buffer.concat(body).toString();
            res.end('ok');
            // on heroku it is body.plain
            const text = JSON.parse(body);
            console.log(text.plain);
            onMessage(text.plain);
            // on localhost
            // console.log(body);
            // onMessage(body);
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

function onMessage(text){
    const app = require('./app.js');
    const parseMes = require('./parseMail.js');
    const Base = require('./firebase.js');

    let parsedMes = parseMes.parseMessage(text);

    // Base.init();
    Base.historyAdd(text);

    Base.stataUpdateClear(parsedMes.count, parsedMes);

    app.sendLastOperation(parsedMes.count, text);
}

module.exports = {
    ROUTER : ROUTER
}