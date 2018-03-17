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
    BASE.data.length++;
    return BASE;
}

BASE.removeLines = (keyArr) => {
    keyArr.forEach(key => {
        delete BASE.data[key];
        BASE.data.length--;
    });
    return BASE;
}

BASE.addObj = (obj) => {
    for (const p in obj) {
        BASE.data[p] = obj[p];
        BASE.data.length++;
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

module.exports = {
    BASE : BASE
}