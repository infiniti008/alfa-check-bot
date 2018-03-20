const Base = require(__dirname + '/base/index.js');
const parseMes = require('./parseMail.js');
const im = require('./imap.js');

const myBase = Base.BASE;
// myBase.update().removeLines(['BJJfiUCFM-22.12.2017 12:53:02 GMT+0300 (+03)']).saveToFile();

// for (const p in myBase.data) {
//     console.log(parseMes.parseMessage(myBase.data[p]));
// }

function backUpBase(){
    im.getAllMail('totelegram/alfabank').then(mesArr => {
        myBase.addObj(mesArr).saveToFile();
    });
}

// backUpBase();

// const myCounts = Base.COUNTS;

// myCounts.update().updateCountState('BY93ALFA30146906250120270000', {
//     lastTime : '16:21:38',
//     lastDate : '16.03.2018',
//     lastOperationsSum : '14.52',
//     total : '41.01'
// }).saveToFile();












































// myBase.update().removeLines(['s','c']).saveToFile();

// myBase.addObj({a:1,d:2,f:4,g:9});

// myBase.saveToFile();
// console.log(myBase.data);


// im.getAllMail('totelegram/alfabank/a_kurs_byn')
// im.getAllMail('totelegram/alfabank')
// .then((a) => {
//     // console.log(a);
//     myBase.addObj(a).saveToFile();
    
// });

