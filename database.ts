import { SQL } from './dbTools_server';
const mysql3 = require('mysql');
import { Pool } from 'pg';
import fs = require('fs');

require('dotenv').config();

export default class Database {

    public static pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        max: 10,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
        ssl: {
          rejectUnauthorized: false
        }
    });

    /**
     * 
     * @param table Target SQL table.
     * @param row An object in which every key represents every column to change, and every corresponding value represents the new value for said column.
     */
    public static async add(table: string, row: object, returnQuery: string | null = null) {
        return new Promise((resolve, reject) => {
          const keys = SQL.pgConvertSQLKeywords(Object.keys(row));
          const values = Object.values(row);
      
          let query = `INSERT INTO ${table} (${keys}) VALUES (${values.map((value, index) => ("$"+(index+1))).toString()})`;
      
          if (returnQuery) {
            query += ` RETURNING ${returnQuery}`;
          }
      
          this.pool.query(query, [...values], (err, result) => {
            if (err) {
              console.log(err);
              reject(err);
            } else {
              if (returnQuery) {
                resolve(result.rows[0].id);
              } else {
                resolve(null);
              }
            }
          });
        });
    }
      

    /**
     * @param table Target SQL table.
     * @param condition Optional, additional search criteria in SQL format. Example: 'WHERE date >= 27.01.1996'.
     */
    public static get(table:string, condition:string = null): any {
        return new Promise((resolve, reject) => {
            let query = `SELECT * FROM ${table}`;
        
            if (condition) {
                query = query + ` ${condition}`;
            }
        
            this.pool.query(query, (err, result) => {
                if (err) {
                    console.log(`Error: Cannot get table ${table}: ${err}`);
                    reject(err);
                } else {
                    resolve(result.rows);
                }
            });
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
        SQL.convertSQLKeywords(Object.values([key, value, con_key]));

        const query = `UPDATE ${table} SET ${key}=$1 WHERE ${con_key}=$2`;
        console.log(`UPDATE ${table} SET ${key}=${value} WHERE ${con_key}=${con_val}`)

        this.pool.query(
            query, [value, con_val], 
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

        const query = `DELETE FROM ${table} WHERE ${con_key}=$1`;

        console.log(query);

        this.pool.query(
            query, 
            [con_val],
            (err, result) => {
                if (err) throw err;
                return result;
            }
        );
    }
}