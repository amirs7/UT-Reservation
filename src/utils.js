const moment = require('moment');
const DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss';
const faultEnabled = process.env['RES_FAULT_ENABLED'];
console.log(`Fault enabled: ${faultEnabled}`);

function parseDate(d) {
    if (moment(d, 'YYYY-MM-DDTHH:mm:ss', true).isValid())
        return moment(d).format(DATE_FORMAT);
    else
        return null;
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function delay(amount) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, amount);
    });
}

async function simulateDelay(req, res, next) {
    if(!faultEnabled)
        return next();
    let prob = getRandomInt(100);
    let delayAmount = getRandomInt(10) * 100;
    if (prob < 40)
        await delay(delayAmount);
    return next();
}

async function simulateFailure(req, res, next) {
    if (!faultEnabled)
        return next();
    let prob = getRandomInt(100);
    if (prob < 15)
        return res.sendStatus(500);
    else if (prob < 25)
        return res.sendStatus(503);
    else if (prob < 35)
        return;
    else
        return next();
}


module.exports = {
    parseDate, simulateDelay, simulateFailure
}