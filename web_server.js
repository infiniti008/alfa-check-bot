function ROUTER(req, res){
    console.log('in router');

    if (req.method === 'POST' && req.url === '/web/incoming_message') {
        let body = [];
        req.on('data', (chunk) => {
          body.push(chunk);
        }).on('end', () => {
            body = Buffer.concat(body).toString();
            res.end('ok');
            //   in heroku it is body.plain
            // const text = body.plain;
            // const text = body['plain'];
            console.log(body.headers.From);
            // onMessage(text);
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
    const shortid = require('shortid');
    const parseMes = require('./parseMail.js');
    const Base = require(__dirname + '/base/index.js');

    let parsedMes = parseMes.parseMessage(text);

    const toBaseId = shortid.generate() + '-' + parsedMes.date + ' ' + parsedMes.time + ' GMT+0300 (+03)';
    const myBase = Base.BASE;
    myBase.update();
    myBase.addLine(toBaseId, text).saveToFile();

    const myCounts = Base.COUNTS;
    myCounts.update();
    myCounts.updateCountState(parsedMes.count, parsedMes).saveToFile();

    app.sendLastOperation(parsedMes.count, text);
}




module.exports = {
    ROUTER : ROUTER
}