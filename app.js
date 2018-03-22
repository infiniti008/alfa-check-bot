const TelegramBot = require('./my_node-telegram-bot-api');
const fs = require('fs');
const web_server = require('./web_server');

const Base = require('./firebase.js');
Base.init();

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
});

bot.onText(/\/subscribe_family/, (msg, match) => {
    const chatId = msg.chat.id;

    Base.subscribersGet('BY93ALFA30146906250120270000')
        .then(base => {
            if(!base.currentCountSubscribers.includes(chatId)){
                bot.sendMessage(chatId, 'You are subscribed on update from now');
                base.subscribersAdd([chatId]).subscribersSave();
            } else{
                bot.sendMessage(chatId, 'You are subscribed on update already');
            }
        });

});

bot.onText(/\/unsubscribe_family/, (msg, match) => {
    const chatId = msg.chat.id;

    Base.subscribersGet('BY93ALFA30146906250120270000')
        .then(base => {
            if(base.currentCountSubscribers.includes(chatId)){
                bot.sendMessage(chatId, 'You are unsubscribed on update from now');
                base.subscribersRemove([chatId]).subscribersSave();
            } else{
                bot.sendMessage(chatId, 'You are unsubscribed on update already');
            }
        });
});

bot.onText(/\/ostatok_family/, (msg, match) => {
    const chatId = msg.chat.id;

    Base.stateGet('BY93ALFA30146906250120270000')
    .then(base => {
        bot.sendMessage(chatId, `Остаток по Ваше семейной карте составляет: <b>${base.stateCurrentValue.total}</b> BYN\nНа дату: ${base.stateCurrentValue.date} ${base.stateCurrentValue.time}`,{parse_mode: 'HTML'});
    });
});

bot.onText(/\/ostatok_aKurs/, (msg, match) => {
    const chatId = msg.chat.id;

    Base.stateGet('BY41ALFA30146906250090270000')
    .then(base => {
        bot.sendMessage(chatId, `Остаток по Ваше карте А-Курс составляет: <b>${base.stateCurrentValue.total}</b> BYN\nНа дату: ${base.stateCurrentValue.date} ${base.stateCurrentValue.time}`,{parse_mode: 'HTML'});
    });
});

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

function sendLastOperation(count, data){
    console.log('In last send');
    
    Base.subscribersGet(count)
        .then(base => {
            base.currentCountSubscribers.map(id => {
                bot.sendMessage(id, data);
            });
        });
}


module.exports = {
    sendLastOperation : sendLastOperation
}