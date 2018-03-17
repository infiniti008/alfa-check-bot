const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const im = require('./imap.js');
const web_server = require('./web_server');

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
} else {
    console.log('Polling');
    server = 'Localhost';
    bot = new TelegramBot(TOKEN, { polling: true });
    console.log('We start telegramm bot!');
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
});


bot.onText(/\/ostatok/, (msg, match) => {
    const chatId = msg.chat.id;
    Promise.all(
        [
            im.getLastMail('totelegram/alfabank/family_olya'),
            im.getLastMail('totelegram/alfabank/family_slava')
        ]
    )
    .then(result => {
        let latestMail = (result[0].date > result[1].date) ? result[0] : result[1];
        let opt = {
            hour12: false,
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            hour: 'numeric',
            minute: 'numeric'
        }
        // console.log(latestMail.date.toLocaleString("ru-RU", opt));
        bot.sendMessage(chatId, `Остаток по Ваше семейной карте составляет: <b>${latestMail.total}</b> BYN\nНа дату: ${latestMail.date.toLocaleString("ru", opt)}`,{parse_mode: 'HTML'});
    });
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
    // console.log(chatId);
    if (msg.entities) {
        const keyAdmin = {
            parse_mode: "Markdown",
            reply_markup: {
                keyboard: [
                    ["/ostatok", "/check", "/help"]
                ],
                resize_keyboard: true,
                one_time_keyboard: false,
            },
        };
        const keyUser = {
            parse_mode: "Markdown",
            reply_markup: {
                keyboard: [
                    ["/ostatok", "/help"]
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