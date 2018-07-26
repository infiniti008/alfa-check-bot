var fs = require('fs');

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
        var file = fs.readFileSync('./home.html').toString();
        res.end(file);
    }

    else if(req.url ==='/web/category'){
        res.statusCode = 200;
        var file = fs.readFileSync('./category.html').toString();
        res.end(file);
    }

    else if(req.url ==='/web/test'){
        res.statusCode = 200;
        var t = "Карта 5.5782\nСо счёта: BY41ALFA30146906250090270000\nОплата товаров/услуг\nУспешно\nСумма:6.20 BYN\nОстаток:25.79 BYN\nНа время:12:38:23\nBLR/MINSK/KAFE \"KHLEB SOL\"\n25.07.2018 12:38:23\r\n"
        onMessage(t)
        res.end('file');
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
    const pup = require('./puppeteer.js')

    Base.regexpGet()
        .then(
            function(regExp){
                console.log(regExp)

                let parsedMes = parseMes.parseMessage(text, regExp);

                Base.historyAdd(text);

                Base.stataUpdateClear(parsedMes.count, parsedMes);

                pup.run(parsedMes, text)

                app.sendLastOperation(parsedMes.count, text);
            }
        )

    // let parsedMes = parseMes.parseMessage(text);

    // // Base.init();
    // Base.historyAdd(text);

    // Base.stataUpdateClear(parsedMes.count, parsedMes);

    // pup.run(parsedMes, text)

    // app.sendLastOperation(parsedMes.count, text);
}

module.exports = {
    ROUTER : ROUTER
}