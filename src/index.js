const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet')
const { simulateDelay, parseDate, simulateFailure } = require('./utils');
const Rooms = require('./rooms');
let rooms = new Rooms();
const app = express();

app.use(helmet());
app.use(express.static('public'));

app.use(bodyParser.json());

app.use((req, res, next) => {
    console.log(req.method, req.path, req.query, req.body);
    next();
});

app.use(simulateDelay);

app.use(simulateFailure);

function extractDateFromRequest(req, res, next) {
    let { start, end } = req.body.start ? req.body : req.query;

    if (!start)
        return res.status(400).send({ message: 'Start date is  required!' });

    if (!end)
        return res.status(400).send({ message: 'End date is required!' });

    start = parseDate(start);
    if (!start)
        return res.status(400).send({ message: 'Start date is not valid!' });

    end = parseDate(end);
    if (!end)
        return res.status(400).send({ message: 'End date is not valid!' });

    if (start === end)
        return res.status(400).send({ message: 'Meeting length can not be zero' });

    if (start > end)
        return res.status(400).send({ message: 'Start date is greater than end' });

    req.startDate = start;
    req.endDate = end;

    return next();
}

app.get('/available_rooms', extractDateFromRequest, async (req, res, next) => {
    try {
        let { startDate, endDate } = req;
        let availableRooms = await rooms.listAvailableRooms(startDate, endDate);
        return res.json({ availableRooms });
    } catch (error) {
        return next(error);
    }
});

app.param('room_id', extractDateFromRequest, async (req, res, next, roomId) => {
    try {
        roomId = Number(roomId);
        let roomExists = await rooms.roomExists(roomId);
        if (!roomExists)
            return res.status(404).send({ message: 'Room not exists' });
        else
            return next();
    } catch (error) {
        return next(error);
    }
});

app.post('/rooms/:room_id/reserve', async (req, res, next) => {
    try {
        let roomId = Number(req.params['room_id']);
        let { startDate, endDate } = req;
        let { username } = req.body;
        let availableRooms = await rooms.listAvailableRooms(startDate, endDate);
        if (availableRooms.indexOf(roomId) !== -1) {
            await rooms.reserve(roomId, startDate, endDate, username);
            return res.status(200).send({ message: `Room ${roomId} successfully reserved for:${username}` });
        } else {
            return res.status(400).send({ message: `Room ${roomId} is already reserved` });
        }
    } catch (error) {
        console.log(error);
        return next(error);
    }
});

app.use((req,res, next)=>{
    return res.sendStatus(404);
})

app.use((error, req, res, next) => {
    console.log('INTERNAL ERROR:', error);
    return res.sendStatus(500);
});

rooms.connect();
app.listen(process.env.SERVER_PORT || 2000);
console.log('Server started');