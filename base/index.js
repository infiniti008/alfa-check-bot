const fs = require('fs');

const BASE = {
    data :{}
}

BASE.update = () => {
    BASE.data = JSON.parse(fs.readFileSync(__dirname + '/base.json'));
    return BASE;
}

BASE.addLine = (key, line) => {
    BASE.data[key] = line;
    // BASE.data.length++;
    return BASE;
}

BASE.removeLines = (keyArr) => {
    keyArr.forEach(key => {
        delete BASE.data[key];
        // BASE.data.length--;
    });
    return BASE;
}

BASE.addObj = (obj) => {
    for (const p in obj) {
        BASE.data[p] = obj[p];
        // BASE.data.length++;
    }
    return BASE;
}

BASE.saveToFile = () => {
    fs.writeFileSync(__dirname + '/base.json', JSON.stringify(BASE.data));
    return BASE;
}

BASE.select = (key) => {
    return BASE.data[key];
}

const COUNTS = {
    cards : {
        '5.9902' : 'BY93ALFA30146906250120270000',
        '5.5782' : 'BY41ALFA30146906250090270000',
        '5.0541' : 'BY93ALFA30146906250120270000'},
    data :  {}
}

COUNTS.update = () => {
    COUNTS.data = JSON.parse(fs.readFileSync(__dirname + '/counts.json'));
    return COUNTS;
}

COUNTS.saveToFile = () => {
    fs.writeFileSync(__dirname + '/counts.json', JSON.stringify(COUNTS.data));
    return COUNTS;
}
COUNTS.updateCountState = (count, data) => {
    if(!COUNTS.data[count]) COUNTS.data[count] = {};
    for (const p in data) {
        COUNTS.data[count][p] = data[p];
    }
    return COUNTS;
}

module.exports = {
    BASE : BASE,
    COUNTS : COUNTS
}