const imaps = require('imap-simple');
const parseMes = require('./parseMail.js');

function getNewMail() {
    return new Promise(resolve => {
        const textArr = {};
        var config = {
            imap: {
                user: 'nikitenok.sl@gmail.com',
                password: 'nov191190',
                host: 'imap.gmail.com',
                port: 993,
                tls: true,
                authTimeout: 3000
            }
        };
        imaps.connect(config).then(function(connection) {
            return connection.openBox('totelegram/alfabank').then(function() {
                const searchCriteria = [
                    'UNSEEN'
                ];
                const fetchOptions = {
                    bodies: ['HEADER', 'TEXT'],
                    markSeen: true
                };
                return connection.search(searchCriteria, fetchOptions).then(function(results) {
                    results.forEach(function(val, ind, ar) {
                        let textBuffer = new Buffer(val.parts[0].body, 'base64');
                        let text = textBuffer.toString('utf8');
                        textArr[ind] = parseMes.parseMessage(text);
                        textBuffer = null;
                        text = null;
                    });
                    connection.end();
                    resolve(textArr);
                });
            });
        });
    });
}


function getLastMail(box) {
    return new Promise(resolve => {
        let textArr;
        var config = {
            imap: {
                user: 'nikitenok.sl@gmail.com',
                password: 'nov191190',
                host: 'imap.gmail.com',
                port: 993,
                tls: true,
                authTimeout: 3000
            }
        };
        imaps.connect(config).then(function(connection) {
            return connection.openBox(box).then(function() {
                let lastUid = connection.imap._box.uidnext - 1;
                const searchCriteria = [
                    ['UID', lastUid]
                ];
                const fetchOptions = {
                    bodies: ['HEADER', 'TEXT'],
                    markSeen: false
                };
                return connection.search(searchCriteria, fetchOptions).then(function(results) {
                    results.forEach(function(val, ind, ar) {
                        let textBuffer = new Buffer(val.parts[0].body, 'base64');
                        let text = textBuffer.toString('utf8');
                        textArr = parseMes.parseMessage(text);
                        textArr.date = val.attributes.date;
                        textBuffer = null;
                        text = null;
                    });
                    
                    connection.end();
                    resolve(textArr);
                });
            });
        });
    });
}

// Promise.all(
//     [
//         getLastMail('totelegram/alfabank/family_olya'),
//         getLastMail('totelegram/alfabank/family_slava')
//     ])
// .then(result => {
//     let latestMail = (result[0].date > result[1].date) ? result[0] : result[1];
//     console.log(latestMail);
// });


module.exports = {
    getNewMail: getNewMail,
    getLastMail : getLastMail
}