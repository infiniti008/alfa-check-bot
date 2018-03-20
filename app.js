const TelegramBot = require('./my_node-telegram-bot-api');
const fs = require('fs');
// const im = require('./imap.js');
const web_server = require('./web_server');

// const SUBSCRIBERS = {
//     'BY93ALFA30146906250120270000' : ['208067133'], //family
//     'BY41ALFA30146906250090270000' : ['208067133']  //A-kurs BYN
// };
const SUBSCRIBERS = require('./subscribers.json');

const CHATID = '208067133';
const TOKEN = process.env.TELEGRAM_TOKEN || '268377689:AAEehpljdqiY6qITewLNPUkbe60Kbszl95w';

var bot;
var server;
if (process.env.PORT) {
    console.log('Webhook');
    server = 'Heroku';
    const options = {
        webHook: {
            port: process.env.PORT
        }
    };
    const url = process.env.APP_URL || 'https://alfa-check.herokuapp.com:443';
    bot = new TelegramBot(TOKEN, options);
    bot.setWebHook(`${url}/bot${TOKEN}`);
    console.log('URL', url);
    // console.log(bot.getWebHookInfo());
} else {
    console.log('Polling');
    server = 'Localhost';
    bot = new TelegramBot(TOKEN, { polling: true });
    console.log('We start telegramm bot!');
    const http = require('http');
    const _webServer = http.createServer(web_server.ROUTER);
    _webServer.listen(3000, '127.0.0.1');
}


console.log('Server started on ' + server);

bot.onText(/\/echo (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const resp = match[1];
    bot.sendMessage(chatId, resp);
});

bot.onText(/\/help/, (msg, match) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'I can\'t help tou');
    // console.log('ddd');
});

bot.onText(/\/settings/, (msg, match) => {
    const chatId = msg.chat.id;
    let text = '/subscribe_family - Subscribe on family card update\n\
/unsubscribe_family - Unsubscribe on family card update\n\
/help - Get help information'
    bot.sendMessage(chatId, text);
    // console.log('ddd');
});

bot.onText(/\/subscribe_family/, (msg, match) => {
    const chatId = msg.chat.id;
    if(!SUBSCRIBERS['BY93ALFA30146906250120270000'].includes(chatId)){
        bot.sendMessage(chatId, 'You are subscribed on update from now');
        SUBSCRIBERS['BY93ALFA30146906250120270000'].push(chatId);
        fs.writeFileSync('./subscribers.json', JSON.stringify(SUBSCRIBERS));
    } else{
        bot.sendMessage(chatId, 'You are subscribed on update already');
    }
    // console.log('ddd');
});

bot.onText(/\/unsubscribe_family/, (msg, match) => {
    const chatId = msg.chat.id;
    if(SUBSCRIBERS['BY93ALFA30146906250120270000'].includes(chatId)){
        bot.sendMessage(chatId, 'You are unsubscribed on update from now');
        let ind = SUBSCRIBERS['BY93ALFA30146906250120270000'].indexOf(chatId);
        // console.log(ind);
        SUBSCRIBERS['BY93ALFA30146906250120270000'].splice(ind, 1);
        fs.writeFileSync('./subscribers.json', JSON.stringify(SUBSCRIBERS));
    } else{
        bot.sendMessage(chatId, 'You are unsubscribed on update already');
    }
    // console.log('ddd');
});

bot.onText(/\/ostatok_family/, (msg, match) => {
    const chatId = msg.chat.id;
    const Base = require('./base/index.js');
    const myCounts = Base.COUNTS;
    let familyData = myCounts.update().data['BY93ALFA30146906250120270000'];
    // console.log(familyData);
    bot.sendMessage(chatId, `Остаток по Ваше семейной карте составляет: <b>${familyData.total}</b> BYN\nНа дату: ${familyData.date} ${familyData.time}`,{parse_mode: 'HTML'});
});

bot.onText(/\/ostatok_aKurs/, (msg, match) => {
    const chatId = msg.chat.id;
    const Base = require('./base/index.js');
    const myCounts = Base.COUNTS;
    let aKursData = myCounts.update().data['BY41ALFA30146906250090270000'];
    // console.log(aKursData);
    bot.sendMessage(chatId, `Остаток по Ваше карте А-Курс составляет: <b>${aKursData.total}</b> BYN\nНа дату: ${aKursData.date} ${aKursData.time}`,{parse_mode: 'HTML'});
});

// bot.onText(/\/ostatok/, (msg, match) => {
//     const chatId = msg.chat.id;
//     Promise.all(
//         [
//             im.getLastMail('totelegram/alfabank/family_olya'),
//             im.getLastMail('totelegram/alfabank/family_slava')
//         ]
//     )
//     .then(result => {
//         let latestMail = (result[0].date > result[1].date) ? result[0] : result[1];
//         let opt = {
//             hour12: false,
//             weekday: 'long',
//             day: 'numeric',
//             month: 'long',
//             hour: 'numeric',
//             minute: 'numeric'
//         }
//         // console.log(latestMail.date.toLocaleString("ru-RU", opt));
//         bot.sendMessage(chatId, `Остаток по Ваше семейной карте составляет: <b>${latestMail.total}</b> BYN\nНа дату: ${latestMail.date.toLocaleString("ru", opt)}`,{parse_mode: 'HTML'});
//     });
// });

// bot.onText(/\/check/, (msg, match) => {

//     const chatId = msg.chat.id;
//     const resp = match[1];
//     bot.sendMessage(chatId, 'We start to scaning mail box');
//     console.log('Add operation to calendar');

//     im.getNewMail().then(res => {
//         if (!res['0']) {
//             bot.sendMessage(chatId, 'There aren\'t any new mails');
//             console.log('There aren\'t any new mails');
//         } else {
//             bot.sendMessage(chatId, 'We got all new mails');
//             fs.writeFile('./base.json', JSON.stringify(res), () => {

//                 bot.sendMessage(chatId, 'We seved mails to base and start adding new items to EasyFinance');
//                 var spawn = require('child_process').spawn;
//                 const create_photo = spawn('casperjs /app/index.js', {
//                     stdio: 'inherit',
//                     shell: true
//                 });

//                 create_photo.on('exit', (code) => {
//                     console.log(`Child exited with code`);
//                     allAdded();
//                 });
//             });
//         }
//     });
// });

bot.on('message', (msg) => {

    const chatId = msg.chat.id;
    // console.log(chatId);
    if (msg.entities) {
        const keyAdmin = {
            parse_mode: "Markdown",
            reply_markup: {
                keyboard: [
                    ["/ostatok_family", "/ostatok_aKurs", "/settings"]
                ],
                resize_keyboard: true,
                one_time_keyboard: false,
            },
        };
        const keyUser = {
            parse_mode: "Markdown",
            reply_markup: {
                keyboard: [
                    ["/ostatok_family", "/settings"]
                ],
                resize_keyboard: true,
                one_time_keyboard: false,
            },
        };
        const keyboard = msg.chat.id == CHATID ? keyAdmin : keyUser;
        bot.sendMessage(msg.chat.id, `You send bot command!`, keyboard);
    } else {
        bot.sendMessage(msg.chat.id, `I am alive on ${server}!`);
    }
    //sd
});

function allAdded() {
    bot.sendMessage(CHATID, 'All added to EasyFinance');
    fs.writeFileSync('./base.json', JSON.stringify({}));
}



function sendLastOperation(count, data){
    console.log('in last send');
    

    console.log(SUBSCRIBERS[count]);
    SUBSCRIBERS[count].map(id => {
        bot.sendMessage(id, data);
    });
}


module.exports = {
    sendLastOperation : sendLastOperation
}