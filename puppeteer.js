const puppeteer = require('puppeteer');

async function run({sum, count, type, categortObj}, text) {
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    
    await page.goto('https://easyfinance.ru/login');

    await page.click(login.EMAIL_SELECTOR);
    await page.keyboard.type(login.EMAIL);

    await page.click(login.PASSWORD_SELECTOR);
    await page.keyboard.type(login.PASSWORD);

    await page.click(login.SUBMIT_SELECTOR);

    await page.waitForNavigation();

    await page.click(addToCalendar.ADD_SELECTOR);

    await page.click(addToCalendar.AMOUNT_SELECTOR);
    await page.keyboard.type(sum);

    await page.select(addToCalendar.COUNT_SELECT_SELECTOR, addToCalendar[count])

    if(type == 'Negative'){
        await page.select(addToCalendar.TYPE_SELECT_SELECTOR, addToCalendar.Negative)
        var categoryValue = categortObj.value ||addToCalendar.CATEGORY_NEUCHTENO_NEG_VALUE;
        await page.select(addToCalendar.CATEGORY_SELECT_SELECTOR, categoryValue)
    } else if(type == 'Positive'){
        await page.select(addToCalendar.TYPE_SELECT_SELECTOR, addToCalendar.Positive)
        await page.select(addToCalendar.CATEGORY_SELECT_SELECTOR, addToCalendar.CATEGORY_NEUCHTENO_POS_VALUE)
    }

    await page.click(addToCalendar.COMENT_SELECTOR);
    await page.keyboard.type(text);

    await page.keyboard.down('Control');
    await page.keyboard.press('Enter');
    await page.keyboard.up('Control');
  
    browser.close();
}

var addToCalendar = {
    ADD_SELECTOR: "#op_addtocalendar_but",
    AMOUNT_SELECTOR: "#op_amount",
    COUNT_SELECT_SELECTOR: "#op_account",
    BY41ALFA30146906250090270000: "500769777", // aKurs
    BY93ALFA30146906250120270000: "500718129", // family
    CATEGORY_SELECT_SELECTOR: "#op_category",
    CATEGORY_NEUCHTENO_NEG_VALUE: "525729027",
    CATEGORY_NEUCHTENO_POS_VALUE: "525729026",
    TYPE_SELECT_SELECTOR: "#op_type",
    Negative: '0',
    Positive: '1',
    COMENT_SELECTOR: "#op_comment"
}

var login = {
    EMAIL: "nikitenok.sl@gmail.com",
    PASSWORD: "191190",
    EMAIL_SELECTOR: "#flogin",
    PASSWORD_SELECTOR: "#pass",
    SUBMIT_SELECTOR: "#btnLogin"
}

module.exports = {
    run: run
}