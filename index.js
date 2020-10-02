const express = require('express');

const app = express();

app.use(express.static('./public'))

// app.get('/', (r, res) => { res.send('ok')})

module.exports = app;