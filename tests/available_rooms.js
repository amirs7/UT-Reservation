const axios = require('axios');

axios.get(`http://${process.env['SE_IP']}/available_rooms` +
    '?start=2019-09-13T19:20:00&end=2019-09-13T19:40:00').then(result => {
        console.log(result.data);
});
