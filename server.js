const express = require('express');

const cors = require('cors');
const Router = require('./routes/Routes');

const app = express();

app.disable('x-powered-by');

app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => {
  res.send('Hello, welcome to Express!');
});

app.use('/api/', Router);

const apiPort = process.env.PORT || 4000;
const server = app.listen(apiPort, () => console.log(`Server listen on port ${apiPort}`));

module.exports = server;
