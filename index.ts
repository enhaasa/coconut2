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

app.use(cors());
app.use(express.json());
httpServer.listen(PORT); 

//Dynamically load and register handlers for each table
(async () => {
    const tableFiles = fs.readdirSync("./tables");

    for (const file of tableFiles) {
        const registerHandlers = await require(`./tables/${file}`);
        registerHandlers(io);
    }
})();

app.use(express.static(path.resolve(__dirname, './client/build')));
