const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const im = require('./imap.js');

const CHATID = '208067133';
const TOKEN = process.env.TELEGRAM_TOKEN || '465483209:AAH3_iMtcVtbv1oOxXg3QOf-uueoWm5BYoM';

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
    // } else {
    //     console.log('Polling');
    //     server = 'Localhost';
    //     bot = new TelegramBot(TOKEN, { polling: true });
    //     console.log('We start telegramm bot!');
    // }


    console.log('Server started on ' + server);

    bot.onText(/\/echo (.+)/, (msg, match) => {
        const chatId = msg.chat.id;
        const resp = match[1];
        bot.sendMessage(chatId, resp);
    });

    bot.onText(/\/help/, (msg, match) => {
        const chatId = msg.chat.id;
        bot.sendMessage(chatId, 'I can\'t help tou');
    });

    bot.onText(/\/check/, (msg, match) => {

        const chatId = msg.chat.id;
        const resp = match[1];
        bot.sendMessage(chatId, 'We start to scaning mail box');
        console.log('Add operation to calendar');

        im.getNewMail().then(res => {
            if (!res['0']) {
                bot.sendMessage(chatId, 'There aren\'t any new mails');
                console.log('There aren\'t any new mails');
            } else {
                bot.sendMessage(chatId, 'We got all new mails');
                fs.writeFile('./base.json', JSON.stringify(res), () => {

                    bot.sendMessage(chatId, 'We seved mails to base and start adding new items to EasyFinance');
                    var spawn = require('child_process').spawn;
                    const create_photo = spawn('casperjs /app/index.js', {
                        stdio: 'inherit',
                        shell: true
                    });

                    create_photo.on('exit', (code) => {
                        console.log(`Child exited with code`);
                        allAdded();
                    });
                });
            }
        });
    });

    bot.on('message', (msg) => {

        const chatId = msg.chat.id;

        if (msg.entities) {
            const keyboard = {
                parse_mode: "Markdown",
                reply_markup: {
                    keyboard: [
                        ["/check", "/help"]
                    ],
                    resize_keyboard: true,
                    one_time_keyboard: false,
                },
            };
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