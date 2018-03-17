const Base = require(__dirname + '/base/index.js');
const im = require('./imap.js');

const myBase = Base.BASE;

// myBase.update().removeLines(['s','c']).saveToFile();

// myBase.addObj({a:1,d:2,f:4,g:9});

// myBase.saveToFile();
// console.log(myBase.data);


// im.getAllMail('totelegram/alfabank/a_kurs_byn')
im.getAllMail('totelegram/alfabank')
.then((a) => {
    // console.log(a);
    myBase.addObj(a).saveToFile();
    
});

