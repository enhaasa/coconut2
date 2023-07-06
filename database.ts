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

    /**
     * 
     * @param table Target SQL table.
     * @param row An object in which every key represents every column to change, and every corresponding value represents the new value for said column.
     */
    public static add(table:string, row:object) {
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

    /**
     * @param table Target SQL table.
     * @param condition Optional, additional search criteria in SQL format. Example: 'WHERE date >= 27.01.1996'.
     */
    public static get(table:string, condition:string = null) {
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

    /**
     * 
     * @param table Target SQL table.
     * @param key Column of which value to change.
     * @param value New value to the column.
     * @param con_key Condition key. Equal to SQL 'WHERE'.
     * @param con_val Condition value. Equal to SQL 'IS'.
     */
    public static update(table, key, value, con_key, con_val) {
        convertSQLKeywords(Object.values([key, value, con_key]));

        this.pool.query(
            `UPDATE ${table} SET ${key}=? WHERE ${con_key}=?`,
            [value, con_val], 
            (err, result) => {
                if (err) {
                    console.log(`Error: Cannot update table ${table}: ${err}`)
                }
                return result;
            }
        );
    }

    /**
     * @param table Target SQL table.
     * @param con_key Condition key. Equal to SQL 'WHERE'.
     * @param con_val Condition value. Equal to SQL 'IS'.
     */
    public static remove(table:string, con_key:string, con_val:number|string|boolean) {
        this.pool.query(
            `DELETE FROM ${table} WHERE ${con_key}=?`, 
            [con_val],
            (err, result) => {
                if (err) throw err;
                return result;
            }
        );
    }
}