import { SQL } from './dbTools_server';
import { Pool } from 'pg';

require('dotenv').config();

export default class Database {

    private static pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        max: 10,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
        ssl: {
          rejectUnauthorized: false
        }
    });

    //Route queries through here to enforce error handling
    public static async query(query: string, values?: any, callback?: Function): Promise<any> {

      try {
        const result = await this.pool.query(query, values);
        if (callback) callback();
        
        return result.rows;
      } catch (error) {
        
        console.error('An error occurred:', error);
        return { error: 'An error occurred' };
      }
    }

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
            query += ` RETURNING "${returnQuery}"`;
          }
          
  
          this.query(query, [...values], (err, result) => {
            if (err) {
              console.log(err);
              reject(err);
            } 
          }).then(res => {
            if (returnQuery) {
              resolve(res);
            } 
          })
        });


    }
      

    /**
     * @param table Target SQL table.
     * @param condition Optional, additional search criteria in SQL format. Example: 'WHERE date >= 27.01.1996'.
     */
    public static async get(table:string, condition?:string): Promise<any> {
        return new Promise(async (resolve, reject) => {
            let query = `SELECT * FROM "${table}"`;
        
            if (condition) {
                query = query + ` ${condition}`;
            }

            const result = await this.query(query);

            if (result) {
              resolve(result);
            } else {
              reject(result);
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
        SQL.convertSQLKeywords(Object.values([key, value, con_key]));

        const query = `UPDATE ${table} SET ${key}=$1 WHERE ${con_key}=$2`;

        this.query(
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

        this.query(
            query, 
            [con_val],
            (err, result) => {
                if (err) throw err;
                return result;
            }
        );
    }
}