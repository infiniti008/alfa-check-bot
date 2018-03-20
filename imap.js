const imaps = require('imap-simple');
const parseMes = require('./parseMail.js');
const shortid = require('shortid');

shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ#@');

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


function getAllMail(box) {
    return new Promise(resolve => {
        let textArr = {};
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
                const searchCriteria = [
                    ['ALL']
                ];
                const fetchOptions = {
                    bodies: ['TEXT'],
                    markSeen: false
                };
                return connection.search(searchCriteria, fetchOptions).then(function(results) {
                    results.forEach(function(val, ind, ar) {
                        // textArr[ind] = {};
                        let textBuffer = new Buffer(val.parts[0].body, 'base64');
                        let text = textBuffer.toString('utf8');
                        let parsedMes = parseMes.parseMessage(text);
                        textArr[shortid.generate() + '-' + parsedMes.date + ' ' + parsedMes.time + ' GMT+0300 (+03)'] = text;
                        // textArr[ind].data = parseMes.parseMessage(text);
                        // textArr[ind].date = val.attributes.date;
                        textBuffer = null;
                        text = null;
                    });
                    // textArr.length = results.length;
                    // console.log(results[0]);
                    
                    connection.end();
                    resolve(textArr);
                });
            });
        });
    });
}


//eses example
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
    getLastMail : getLastMail,
    getAllMail : getAllMail
};