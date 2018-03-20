function parseMessage(t){
  a = 'Karta 5.0541\nСо счёта: BY93ALFA30146906250120270000\nПеревод (Поступление)\nУспешно\nСумма:12 BYN\nОстаток:31,32 BYN\nНа время:09:19:43\nBLR/ONLINE SERVICE/Transfers AK AM\n08.12.2017 09:19:35\r\n';
  // t = a;
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

  msgObj.karta = t.match(/karta\s*(\d[.]\d\d\d\d)/i)[1];

  msgObj.type = t.match(/(..)\s*сч[ёе]т/i)[1] == 'На' ? 'Positive' : 'Negative';

  return msgObj;
}

module.exports = {
  parseMessage : parseMessage
}

// console.log(parseMessage());
// parseMessage()