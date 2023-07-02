import { convertSQLKeywords } from './dbTools_server';
const mysql3 = require('mysql');
import fs = require('fs');

require('dotenv').config();

export default class Database {
    private static pool = mysql3.createPool({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        password: process.env.DB_PASSWORD,
        ssl: {
            ca: fs.readFileSync(__dirname + '/certs/EnhasicSoftware-ca-certificate.crt')
        },
        database: process.env.DB_DATABASE
    });

    public static add(table, row) {
        const keys = convertSQLKeywords(Object.keys(row));
        const values = Object.values(row);
    
        const query = `INSERT INTO ${table} (${keys}) VALUES (${values.map(value => ("?")).toString()})`
    
        this.pool.query(
            query, [...values], 
            (err, result) => {
                if (err) {
                    console.log(err);
                }
                
            }
        );
    }

    public static get(table, condition = null) {
        let query = `SELECT * FROM ${table}`;
    
        if (condition) {
            query = query + ` ${condition}`;
        }
    
        this.pool.query(query, (err, result) => {
            if (err) {
                console.log(`Error: Cannot get table ${table}: ${err}`);
                return null;
            } else {
                return result;
            }
        });
    }

    public static update(table, key, value, id) {
        convertSQLKeywords(Object.values([key, value]));

        this.pool.query(
            `UPDATE ${table} SET ${key}=? WHERE id=?`,
            [value, id], 
            (err, result) => {
                if (err) {
                    console.log(`Error: Cannot update table ${table}: ${err}`)
                }
                return result;
                //console.log(`${key} was set to ${value}, where ${condition_key} equals ${condition_value} at table ${table}`)
            }
        );
    }

    public static remove(table, id) {
        this.pool.query(
            `DELETE FROM ${table} WHERE id=?`, 
            [id],
            (err, result) => {
                if (err) throw err;
                return result;
            }
        );
    }
}