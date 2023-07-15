import Database from './../database';
import { Socket, Server } from 'socket.io';

module.exports = function registerHandlers(io) {
    io.on('connection', (socket => {
        socket.on('getTables', () => Tables.get(socket));
        socket.on('setTableSessionID', (data) => Tables.setSessionID(io, data));
        socket.on('setTableAttribute', (data) => Tables.setAttribute(io, data));
        socket.on('resetTable', (table) => Tables.reset(io, table));
    }));
}

export class Tables {
    private static table = 'tables';

    public static async get(socket: Socket) {
        const query = 
        `SELECT t.*, s.name AS section_name 
        FROM ${this.table} t 
        JOIN sections s ON t.section_id = s.id;`

        //socket.emit('getTables', await db.get(this.table));

        const result = await Database.pool.query(query);

        socket.emit('getTables', result.rows);
    }

    public static async setSessionID(io: Server, data) {
        //console.log(data)
        io.emit('setTableSessionID', data);
    }

    public static async setAttribute(io: Server, data) {
        const { table, attribute, value } = data;

        Database.update(this.table, attribute, value, 'id', table.id);
        io.emit('setTableAttribute', data);
    }

    public static async reset(io: Server, table) {
        
        const deleteOrdersQuery = 'DELETE FROM "orders" WHERE "table_id" = $1';
        const deleteCustomerQuery = 'DELETE FROM "customers" WHERE "table_id" = $1';
        
        const resetTableQuery = `
            UPDATE ${this.table}
            SET "is_available" = true, "is_reserved" = false, "is_photography" = false
            WHERE "id" = $1;
        `;
        
        Database.pool.query(deleteOrdersQuery, [table.id], (err, result) => {
            if (err) {
                console.log(err);
            } else {
                Database.pool.query(deleteCustomerQuery, [table.id], (err, result) => {
                    if (err) {
                        console.log(err);
                    } else {
                        Database.pool.query(resetTableQuery, [table.id], (err, result) => {
                            if (err) {
                                console.log(err);
                            }
                        })
                    }
                });
            }
        });

        io.emit('removeAllOrdersFromTable', table);
        io.emit('removeAllCustomersFromTable', table);
        io.emit('resetTable', table);
    }
}