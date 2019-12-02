const axios = require('axios');

axios.post('http://213.233.176.40/rooms/801/reserve',
    {
        "username": "rkhosravi",
        "start": "2019-09-13T19:00:00",
        "end": "2019-09-13T20:00:00"
    }
).then(result => {
    console.log(result.data);
});