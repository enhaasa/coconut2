const express = require('express');
const app = express();
const mysql = require('mysql');
const fs = require('fs');
const cors = require('cors');
const path = require("path");
const { convertSQLKeyword, convertSQLKeywords } = require('./dbTools_server');

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
app.put('/tables', (req, res) => {
    let  [ key, value, condition_key, condition_value ] = convertSQLKeywords(Object.values(req.body.data));

    db.query(
        `UPDATE tables SET ${key}=? WHERE ${condition_key}=?`,
        [value, condition_value], 
        (err, result) => {
            if (err) throw err;
            res.send("Updated");
        }
    );
});

//Customers
app.get('/customers', (req, res) => {
    db.query("SELECT * FROM customers", (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});
app.post('/customers', (req, res) => {
    const keys = convertSQLKeywords(Object.keys(req.body));
    const values = convertSQLKeywords(Object.values(req.body));
    
    db.query(
        `INSERT INTO customers (${keys}) VALUES (${values.map(value => ("?")).toString()})`, 
        [...values], 
        (err, result) => {
            if (err) throw err;
            res.send("Inserted");
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
    );
});

//Orders
app.get('/orders', (req, res) => {
    db.query("SELECT * FROM orders", (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});
app.post('/orders', (req, res) => {
    const keys = convertSQLKeywords(Object.keys(req.body));
    const values = convertSQLKeywords(Object.values(req.body));
    
    db.query(
        `INSERT INTO orders (${keys}) VALUES (${values.map(value => ("?")).toString()})`, 
        [...values], 
        (err, result) => {
            if (err) throw err;
            res.send("Inserted");
        }
    );
});
app.delete('/orders', (req, res) => {
    const id = req.body.id;

    db.query(
        `DELETE FROM orders WHERE id=?`, 
        [id],
        (err, result) => {
            if (err) throw err;
            res.send("Deleted");
        }
    );
});
app.put('/orders', (req, res) => {
    const  [ key, value, condition_key, condition_value ] = convertSQLKeywords(Object.values(req.body.data));

    db.query(
        `UPDATE orders SET ${key}=? WHERE ${condition_key}=?`,
        [value, condition_value], 
        (err, result) => {
            if (err) throw err;
            res.send("Updated");
        }
    );
});

//Archived Orders
app.get('/archivedOrders', (req, res) => {
    db.query("SELECT * FROM archived_orders", (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});
app.post('/archivedOrders', (req, res) => {
    const keys = convertSQLKeywords(Object.keys(req.body));
    const values = convertSQLKeywords(Object.values(req.body));
    
    db.query(
        `INSERT INTO archived_orders (${keys}) VALUES (${values.map(value => ("?")).toString()})`, 
        [...values], 
        (err, result) => {
            if (err) throw err;
            res.send("Inserted");
        }
    );
});
app.delete('/archivedOrders', (req, res) => {
    const id = req.body.id;

    db.query(
        `DELETE FROM archived_orders WHERE id=?`, 
        [id],
        (err, result) => {
            if (err) throw err;
            res.send("Deleted");
        }
    );
});
app.put('/archivedOrders', (req, res) => {
    const  [ key, value, condition_key, condition_value ] = convertSQLKeywords(Object.values(req.body.data));

    db.query(
        `UPDATE archived_orders SET ${key}=? WHERE ${condition_key}=?`,
        [value, condition_value], 
        (err, result) => {
            if (err) throw err;
            res.send("Updated");
        }
    );
});

//Updates
app.get('/updates', (req, res) => {
    db.query("SELECT * FROM updates", (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});
app.post('/updates', (req, res) => {
    const keys = convertSQLKeywords(Object.keys(req.body));
    const values = convertSQLKeywords(Object.values(req.body));
    
    db.query(
        `INSERT INTO updates (${keys}) VALUES (${values.map(value => ("?")).toString()})`, 
        [...values], 
        (err, result) => {
            if (err) throw err;
            res.send("Inserted");
        }
    );
});
app.put('/updates', (req, res) => {
    const  [ key, value, condition_key, condition_value ] = convertSQLKeywords(Object.values(req.body.data));

    db.query(
        `UPDATE updates SET ${key}=? WHERE ${condition_key}=?`,
        [value, condition_value], 
        (err, result) => {
            if (err) throw err;
            res.send("Updated");
        }
    );
});
