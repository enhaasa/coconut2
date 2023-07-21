import Database from '../database';
import { Socket, Server } from 'socket.io';

module.exports = function registerHandlers(io) {
    io.on('connection', (socket => {
        socket.on('getSeatings', () => Seatings.get(socket));
        socket.on('setSeatingAttribute', (data) => Seatings.setAttribute(io, data));
        socket.on('resetTSeating', (seating) => Seatings.reset(io, seating));
    }));
}

export class Seatings {
    private static table = 'seatings';

    public static async get(socket: Socket) {
        const query = 
        `SELECT t.*, s.name AS section_name 
        FROM ${this.table} t 
        JOIN sections s ON t.section_id = s.id;`

        const result = await Database.query(query);

        socket.emit('getSeatings', result);
    }

    public static async setAttribute(io: Server, data) {
        const { seating, attribute, value } = data;

        Database.update(this.table, attribute, value, 'id', seating.id);
        io.emit('setSeatingAttribute', data);
    }

    public static async reset(io: Server, seating) {
        
        const deleteOrdersQuery = 'DELETE FROM "orders" WHERE "seating_id" = $1';
        const deleteCustomerQuery = 'DELETE FROM "customers" WHERE "seating_id" = $1';
        
        const resetSeatingQuery = `
            UPDATE ${this.table}
            SET "is_available" = true, "is_reserved" = false, "is_photography" = false
            WHERE "id" = $1;
        `;
        
        Database.query(deleteOrdersQuery, [seating.id], (err, result) => {
            if (err) {
                console.log(err);
            } else {
                Database.query(deleteCustomerQuery, [seating.id], (err, result) => {
                    if (err) {
                        console.log(err);
                    } else {
                        Database.query(resetSeatingQuery, [seating.id], (err, result) => {
                            if (err) {
                                console.log(err);
                            }
                        })
                    }
                });
            }
        });

        io.emit('removeAllOrdersFromSeating', seating);
        io.emit('removeAllCustomersFromSeating', seating);
        io.emit('resetSeating', seating);
    }
}