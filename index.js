const express = require('express');
const app = express();
const mysql = require('mysql');
const fs = require('fs');
const cors = require('cors');
const path = require("path");
const PORT = process.env.PORT || 3001;

app.use(cors());
app.listen(PORT);

const db = mysql.createConnection({
    user: 'linroot',
    host: 'lin-13330-7942-mysql-primary.servers.linodedb.net',
    password: 'nk7PTUbmdz0Xl^62',
    ssl: {
        ca: fs.readFileSync(__dirname + '/certs/EnhasicSoftware-ca-certificate.crt')
    },
    database: 'coconut_cocosoasis'
});

app.get('/menu', (req, res) => {
    db.query("SELECT * FROM menu", (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

app.use(express.static(path.resolve(__dirname, "./client/build")));