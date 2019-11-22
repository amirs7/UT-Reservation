const moment = require('moment');
const DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss';

function parseDate(d) {
    if (moment(d, DATE_FORMAT).isValid())
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
    let prob = getRandomInt(100);
    let delayAmount = getRandomInt(10) * 100;
    if (prob < 30)
        await delay(delayAmount);
    return next();
}

async function simulateFailure(req, res, next) {
    let prob = getRandomInt(100);
    if (prob < 20)
        return res.sendStatus(500);
    else if (prob < 30)
        return res.sendStatus(503);
    else
        return next();
}


module.exports = {
    parseDate, simulateDelay, simulateFailure
}