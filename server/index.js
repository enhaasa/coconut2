const express = require('express');
const app = express();
const mysql = require('mysql');

const db = mysql.createConnection({
    user: 'linroot',
    host: 'lin-13330-7942-mysql-primary.servers.linodedb.net',
    password: 'nk7PTUbmdz0Xl^62',
    ssl: {
        ca: './certs/EnhasicSoftware-ca-certificate.crt'
    },
    database: 'menu'
});

app.get('/menu', (req, res) => {
    db.query("SELECT * FROM menu", (err, result) => {
        if (err) throw err;
        res.send(result);
    })
});

app.listen(3001, () => {
    console.log("Running");
});