const BASE = {};

BASE.init = () => {
    const admin = require("firebase-admin");

    const serviceAccount = require("./alfa-check-base.json");

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://alfa-check-base.firebaseio.com"
    });

    BASE.db = admin.database();
    return BASE;
}

BASE.subscribersGet = (count) => {
    return new Promise(res => {
        BASE.currentCount = BASE.db.ref(`subscribers/${count}`);

        BASE.currentCount.once("value", function(snapshot) {
            BASE.currentCountSubscribers = snapshot.val();
            // console.log(BASE.currentCountSubscribers);
            res(BASE);
        });
    });
}

BASE.subscribersAdd = (addArr) => {
    addArr.map(val => {
        BASE.currentCountSubscribers.push(val);
    });
    return BASE;
}

BASE.subscribersRemove = (removeArr) => {
    BASE.currentCountSubscribers = BASE.currentCountSubscribers.reduce((prev, val) => {
        if(!removeArr.includes(val)) prev.push(val);
        return prev;
    }, []);
    return BASE;
}

BASE.subscribersSave = () => {
    BASE.currentCount.set(BASE.currentCountSubscribers);
    console.log('Subscribers saved');
    return BASE;
}

BASE.stateGet = (count) => {
    return new Promise(res => {
        BASE.stateCurrent = BASE.db.ref(`state/${count}`);

        BASE.stateCurrent.once("value", function(snapshot) {
            BASE.stateCurrentValue = snapshot.val();
            // console.log(BASE.stateCurrentValue);
            res(BASE);
        });
    });
}

BASE.stateUpdate = (newVal) => {
    // BASE.stateCurrentValue = newVal;
    BASE.stateCurrent.update(newVal);
    console.log('State updated');
    return BASE;
}

BASE.stateSave = () => {
    BASE.stateCurrent.set(BASE.stateCurrentValue);
    console.log('State saved');
    return BASE;
}

BASE.historyGet = () => {
    return new Promise(res => {
        BASE.historyCurrent = BASE.db.ref(`history`);

        BASE.historyCurrent.once("value", function(snapshot) {
            BASE.historyCurrentValue = snapshot.val();
            // console.log(BASE.stateCurrentValue);
            res(BASE);
        });
    });
}

BASE.historyAdd = (text) => {
    BASE.db.ref(`history`).push(text);
    console.log('Pushed to history');
}


// BASE.init().stateGet('BY93ALFA30146906250120270000')
//     .then(base => {
//         base.stateUpdate(
//             {
//                 "total": "7.32",
//                 "sum": "17.11",
//                 "date": "20.03.2018",
//                 "time": "18:43:20",
//                 "count": "BY93ALFA30146906250120270000",
//                 "karta": "5.0241",
//                 "type": "Nega4ive"
//             }
//         )
//     });


// BASE.init()
//     .subscribersGet('BY41ALFA30146906250090270000')
//     .then(base => {
//         base.subscribersRemove([123456789,098765432])
//             .subscribersSave();
//     });


module.exports = BASE;