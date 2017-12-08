import { log } from 'util';

const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const im = require('./imap.js');

const CHATID = '208067133';
const TOKEN = process.env.TELEGRAM_TOKEN || '268377689:AAEehpljdqiY6qITewLNPUkbe60Kbszl95w';

// const bot = new TelegramBot(TOKEN, {polling: true});
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
} else {
    console.log('Polling');
    server = 'Localhost';
    bot = new TelegramBot(TOKEN, { polling: true });
    console.log('We start telegramm bot!');
}


console.log('server started');

bot.onText(/\/echo (.+)/, (msg, match) => {
    // 'msg' is the received Message from Telegram
    // 'match' is the result of executing the regexp above on the text content
    // of the message

    const chatId = msg.chat.id;
    const resp = match[1]; // the captured "whatever"

    // send back the matched "whatever" to the chat
    bot.sendMessage(chatId, resp);
});

bot.onText(/\/help/, (msg, match) => {

    // console.log(__dirname);
    const chatId = msg.chat.id;
    const resp = match[1]; // the captured "whatever"

    // send back the matched "whatever" to the chat
    bot.sendMessage(chatId, resp);
});

bot.onText(/\/check/, (msg, match) => {

    // 'msg' is the received Message from Telegram
    // 'match' is the result of executing the regexp above on the text content
    // of the message

    const chatId = msg.chat.id;
    const resp = match[1]; // the captured "whatever"
    bot.sendMessage(chatId, 'We start to scaning mail box');

    console.log('Add operation to calendar');

    //   var spawn = require('child_process').spawn;
    //   const create_photo = spawn('casperjs /home/cabox/workspace/index.js', {
    //       stdio: 'inherit',
    //       shell: true
    //   });
    im.getNewMail().then(res => {
        //      console.log(res);
        bot.sendMessage(chatId, 'We got all new mails');
        fs.writeFile('./base.json', JSON.stringify(res), () => {
            bot.sendMessage(chatId, 'We seved mails to base');

            var spawn = require('child_process').spawn;
            const create_photo = spawn('casperjs /home/cabox/workspace/index.js', {
                stdio: 'inherit',
                shell: true
            });

            create_photo.on('exit', (code) => {
                console.log(`Child exited with code`);
                allAdded();
            });


        });
    });
    // send back the matched "whatever" to the chat

});
// Listen for any kind of message. There are different kinds of
// messages.
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    // send a message to the chat acknowledging receipt of their message
    bot.sendMessage(chatId, 'Received your message');
});

function allAdded() {
    bot.sendMessage(CHATID, 'All added to EasyFinance');
    fs.writeFileSync('./base.json', JSON.stringify({}));
}