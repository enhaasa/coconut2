require('dotenv').config();

const express = require('express');
const app = express();

const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
});

const fs = require('fs');
const cors = require('cors');
const path = require("path");
const { convertSQLKeywords, convertSQLKeyword } = require('./dbTools_server');

const PORT = process.env.PORT || 3001;
process.setMaxListeners(12);

app.use(cors());
app.use(express.json());
httpServer.listen(PORT); 

app.use((error, req, res, next) => {
    console.error('An error occurred:', error);
    res.status(500).json({ error: 'Internal Server Error' });
});

//Dynamically load and register handlers for each table
(async () => {
    const tableFiles = fs.readdirSync("./routes");

    for (const file of tableFiles) {
        const registerHandlers = await require(`./routes/${file}`);
        registerHandlers(io);
    }
})();

app.use(express.static(path.resolve(__dirname, './client/build')));
