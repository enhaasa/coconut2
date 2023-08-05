import Database from '../database';
import { Socket, Server } from 'socket.io';
import { Customer } from '../shared/types';
import { isValidCustomer } from '../shared/types';
import { Seating, isValidSeating } from '../shared/types';

module.exports = function registerHandlers(io) {
    io.on('connection', (socket => {
        socket.on('getSeatings', () => Seatings.get(socket));
        socket.on('setSeatingAttribute', (data) => Seatings.setAttribute(io, data));
        socket.on('resetSeating', (seating) => Seatings.reset(io, seating));
        socket.on('setSeatingLocation', (data) => Seatings.setLocation(io, data));
        socket.on('addSeating', (data) => Seatings.add(io, data));
        socket.on('removeSeating', (seating) => Seatings.remove(io, seating));
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

    public static async setLocation(io: Server, data) {
        try {
            const { seating, newLocation } = data;
            const { pos_x, pos_y, section_id } = newLocation;

            const query = `
                UPDATE ${this.table}
                SET "pos_x" = ${pos_x}, "pos_y" = ${pos_y}, "section_id" = ${section_id}
                WHERE "id" = ${seating.id}
            `;

            Database.query(query).then(res => {
                if (res) {
                    io.emit('setSeatingLocation', data);
                }
            });
            
        } catch(err) {
            console.log(err);
        }    
    }

    public static async add(io: Server, data) {
        try {
            const { section, number } = data;
            const parsedSeating = {
                pos_x: 0,
                pos_y: 0,
                is_reserved: false,
                is_available: true,
                is_photography: false,
                realm_id: 1,
                section_id: section.id,
                number: number,
                waiter: ''
            };
    
            const res = await Database.add(this.table, parsedSeating, 'id');
            const id = res[0].id;
            io.emit('addSeating', {...parsedSeating, id});
        } catch(err) {
            console.log(err);
        }
    }

    public static async remove(io: Server, seating) {
        try {
            this.reset(io, seating);
            Database.remove(this.table, 'id', seating.id);
            io.emit('removeSeating', seating);
        } catch(err) {
            console.log(err);
        }
    }
}