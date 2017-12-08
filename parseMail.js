function parseMessage(t){
//   a = 'Karta 5.0541\nСо счёта: BY93ALFA30146906250120270000\nПеревод (Поступление)\nУспешно\nСумма:12 BYN\nОстаток:31,32 BYN\nНа время:09:19:43\nBLR/ONLINE SERVICE/Transfers AK AM\n08.12.2017 09:19:35\r\n';
//   ar = a.split('\n');
  let ar = t.split('\n');
  let msgObj = {};
  msgObj.text = t;
  msgObj.id = ar[0].slice(6);
  msgObj.accuont = ar[1].slice(ar[1].indexOf('B'));
  msgObj.type = ar[2];
//   msgObj.status = ar[3];
  msgObj.cost = ar[4].slice(ar[4].indexOf(':')+1, ar[4].lastIndexOf(' '));
//   msgObj.total = ar[5].slice(ar[5].indexOf(':')+1, ar[5].lastIndexOf(' '));
//   msgObj.place = ar[7];
//   console.log(ar[8]);
//   let data = ar[8].split(' ')[0];
//   let time = ar[8].split(' ')[1];
//   console.log(data);
//   console.log(time);
//   msgObj.month = data.split('.')[1];
//   msgObj.day = data.split('.')[0];
//   msgObj.year = data.split('.')[2];
//   msgObj.hour = time.split(':')[0];
//   msgObj.minut = time.split(':')[1];
//   msgObj.second = time.split(':')[2].slice(0,2);
//   console.log(msgObj);  
//   console.log('========================================');
  return msgObj;
}

module.exports = {
  parseMessage : parseMessage
}
// parseMessage();