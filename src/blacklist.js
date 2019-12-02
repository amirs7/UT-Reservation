const sqlite3 = require('sqlite3');
const express = require('express');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
app.set('view engine', 'ejs');
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({ extended: true }));

class Blacklist {
    connect() {
        this.db = new sqlite3.Database('../db/rooms.db');
    }
    exists(ip) {
        return new Promise((resolve, reject) => {
            this.db.get(
                'SELECT ip from Blacklist WHERE ip = ?', [ip], (err, row) => {
                    if (err)
                        reject(err)
                    else
                        if (row)
                            resolve(true);
                        else
                            resolve(false);
                });
        });
    }

    remove(ip) {
        return new Promise((resolve, reject) => {
            this.db.run('DELETE FROM Blacklist WHERE ip = ?', [ip], (err, row) => {
                if (err)
                    reject(err)
                else
                    resolve();
            });
        });
    }

    insert(ip) {
        return new Promise((resolve, reject) => {
            this.db.run('INSERT INTO Blacklist VALUES(?)', [ip], (err) => {
                if (err)
                    reject(err)
                else
                    resolve();
            });
        });
    }
    list() {
        return new Promise((resolve, reject) => {
            this.db.all('SELECT * FROM Blacklist', (err, rows) => {
                if (err)
                    return reject(err);
                else
                    return resolve(rows.map(row => row.ip));
            });
        });
    }
}

let blacklist = new Blacklist();
blacklist.connect();

app.use(async (req, res, next) => {
    let ip = req.header['X-Real-IP'];
    let blacklisted = await blacklist.exists(ip);
    console.log(`IP: ${ip} in blacklist: ${blacklisted}`);
    if (blacklisted === false)
        return next();
});

app.get('/blacklist/', async (req, res) => {
    let ips = await blacklist.list();
    ips.forEach(element => {
        console.log(element);
    });
    return res.render('blacklist', { ips });
});

app.delete('/blacklist/:ip', async (req, res) => {
    await blacklist.remove(req.params.ip);
    res.redirect('/blacklist');
});

app.post('/blacklist', async (req, res) => {
    let ip = req.body.ip;
    await blacklist.insert(ip);
    res.redirect('/blacklist');
});

module.exports = app;