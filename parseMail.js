function parseMessage(t){
  let msgObj = {};

  msgObj.total = t.match(/остаток[:?\s?]+([\d,?.?]{1,7})[\s]+byn/i)[1].replace(',','.');
  msgObj.sum = t.match(/сумма[:?\s?]+([\d,?.?]{1,7})[\s]+byn/i)[1].replace(',','.');
  // msgObj.place = t.match(/blr[0-9a-zA-Z\/\s]*/i);

  let date = /(0[1-9]|[12][0-9]|3[01])[.](0[1-9]|1[012])[.](19|20)\d\d/ig;
  msgObj.date = t.match(date).join('');

  let time = /(\d\d)[:](\d\d)[:]\d\d/ig;
  msgObj.time = t.match(time)[0];

  let count = /BY[A-Z0-9]{22}0000/;
  msgObj.count = t.match(count)[0];

  msgObj.karta = t.match(/карта\s*(\d[.]\d\d\d\d)/i)[1];

  msgObj.type = t.match(/(..)\s*сч[ёе]т/i)[1] == 'На' ? 'Positive' : 'Negative';

  return msgObj;

}

module.exports = {
  parseMessage : parseMessage
}

// var a = 'Карта 5.5782\nСо счёта: BY41ALFA30146906250090270000\nПеревод (Списание)\nУспешно\nСумма:3.62 BYN\nОстаток:72.66 BYN\nНа время:09:59:42\nBLR/ONLINE SERVICE/VELCOM PO N TELEFONA: 447135093\n10.07.2018 09:59:42\r\n';
  

// var p = require('./puppeteer.js')
// // console.log(parseMessage());
// p.run(parseMessage(a), a)