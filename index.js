const express = require('express');
const app = express();
const mysql = require('mysql');
const fs = require('fs');
const cors = require('cors');
const path = require("path");
const PORT = process.env.PORT || 3001;

app.use(express.static(path.resolve(__dirname, "./client/build")));
app.use(cors());
app.use(express.json());
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


//Menu
app.get('/menu', (req, res) => {
    db.query("SELECT * FROM menu", (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});


//Floors
app.get('/floors', (req, res) => {
    db.query("SELECT * FROM floors", (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});


//Staff
app.get('/staff', (req, res) => {
    db.query("SELECT * FROM staff", (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

//Tables
app.get('/tables', (req, res) => {
    db.query("SELECT * FROM tables", (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});


//Customers
app.get('/customers', (req, res) => {
    db.query("SELECT * FROM customers", (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});
app.post('/customers', (req, res) => {
    const name = req.body.name;
    const floor = req.body.floor;
    const table = req.body.table;
    const id = req.body.id;

    db.query(
        "INSERT INTO customers VALUES (?, ?, ?, ?)", 
        [name, floor, table, id], 
        (err, result) => {
            if (err) throw err;
        }
    );
});
app.delete('/customers', (req, res) => {
    const id = req.body.id;

    db.query(
        `DELETE FROM customers WHERE id=?`, 
        [id],
        (err, result) => {
            if (err) throw err;
            res.send("Deleted");
        }
    );
});
app.put('/customers', (req, res) => {
    const name = req.body.name;
    const id = req.body.id;

    db.query(
        "UPDATE customers SET name=? WHERE id=?",
        [name, id],
        (err, result) => {
            if (err) throw err;
            res.send("Updated");
        }
    )
})

//Orders
app.get('/orders', (req, res) => {
    db.query("SELECT * FROM orders", (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});



