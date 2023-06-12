const express = require('express');
const app = express();
const mysql = require('mysql');
const fs = require('fs');
const cors = require('cors');
const path = require("path");
const { convertSQLKeywords } = require('./dbTools_server');

const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.listen(PORT); 

/*
app.get('/', (req, res) => {
    res.redirect('https://www.google.se/');
  });
*/

app.use(express.static(path.resolve(__dirname, "./client/build")));

//DB Stuff
const db = mysql.createPool({
    user: 'linroot',
    host: 'lin-13330-7942-mysql-primary.servers.linodedb.net',
    password: 'nk7PTUbmdz0Xl^62',
    ssl: {
        ca: fs.readFileSync(__dirname + '/certs/EnhasicSoftware-ca-certificate.crt')
    },
    database: 'coconut_cocosoasis'
});

app.post('/get', (req, res) => {
    const { table, condition} = req.body;
    let query = `SELECT * FROM ${table}`;
    if (condition) {
        query = query + ` ${condition}`;
    }

    db.query(query, (err, result) => {
        if (err) {
            console.log(`Error: Cannot get table ${table}: ${err}`);
        } else {
            res.send(result);
        }
    })
});

app.post('/update', (req, res) => {
    const { table } = req.body;
    const [ key, value, condition_key, condition_value ] = convertSQLKeywords(Object.values(req.body.data));

    console.log(`UPDATE ${table} SET ${key}=${value} WHERE ${condition_key}=${condition_value}`)

    db.query(
        `UPDATE ${table} SET ${key}=? WHERE ${condition_key}=?`,
        [value, condition_value], 
        (err, result) => {
            if (err) {
                console.log(`Error: Cannot update table ${table}: ${err}`)
            }
            res.send(result);
            //console.log(`${key} was set to ${value}, where ${condition_key} equals ${condition_value} at table ${table}`)
        }
    );
});

app.post('/post', (req, res) => {
    const { table } = req.body;
    const keys = convertSQLKeywords(Object.keys(req.body.data));
    const values = convertSQLKeywords(Object.values(req.body.data));

    db.query(
        `INSERT INTO ${table} (${keys}) VALUES (${values.map(value => ("?")).toString()})`, 
        [...values], 
        (err, result) => {
            if (err) {
                console.log(err);
            }
            res.send(result);
        }
    );
});

app.post('/delete', (req, res) => {
    const { table } = req.body;
    const { id } = req.body.data;

    db.query(
        `DELETE FROM ${table} WHERE id=?`, 
        [id],
        (err, result) => {
            if (err) throw err;
            res.send(result);
        }
    );
});