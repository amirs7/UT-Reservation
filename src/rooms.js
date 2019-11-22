const sqlite3 = require('sqlite3');

class Rooms {
    connect() {
        this.db = new sqlite3.Database('../db/rooms.db');
    }
    listAvailableRooms(start, end) {
        return new Promise((resolve, reject) => {
            this.db.all(
                'SELECT id from Room WHERE id NOT IN '
                +'(SELECT roomId FROM Reserve WHERE'
                + '(((start >= ?) AND (start < ?)) OR ((? >= start) AND (? < end))))', [start, end, start, start], (err, rows) => {
                    console.log(rows);
                    if (err)
                        reject(err)
                    else
                        resolve(rows.map(row => row.id));
                });
        });
    }

    roomExists(roomId) {
        return new Promise((resolve, reject) => {
            this.db.get('SELECT * FROM ROOM WHERE id = ?', [roomId], (err, row) => {
                if (err)
                    reject(err)
                else
                    resolve(row !== null);
            });
        });
    }

    reserve(roomId, start, end, username) {
        return new Promise((resolve, reject) => {
            this.db.run('INSERT INTO Reserve VALUES(?, ?, ?, ?)', [roomId, start, end, username], (err) => {
                if (err)
                    reject(err)
                else
                    resolve();
            });
        });
    }
}

module.exports = Rooms;




