const express = require('express');
const app = express();
const mysql = require('mysql');
const fs = require('fs');
const cors = require('cors');

app.use(cors());
app.listen(3001);

//Heroku IP: 54.78.134.111
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
