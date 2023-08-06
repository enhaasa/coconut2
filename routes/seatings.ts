import Database from '../database';
import MessageHandler from '../messages';
import { Socket, Server } from 'socket.io';
import { Customer } from '../shared/types';
import { isValidCustomer } from '../shared/types';
import { Seating, isValidSeating } from '../shared/types';

module.exports = function registerHandlers(io) {
    io.on('connection', (socket => {
        socket.on('getSeatings', () => Seatings.get(socket));
        socket.on('setSeatingAttribute', (data) => Seatings.setAttribute(io, socket, data));
        socket.on('resetSeating', (seating) => Seatings.reset(io, socket, seating));
        socket.on('setSeatingLocation', (data) => Seatings.setLocation(io, socket, data));
        socket.on('addSeating', (data) => Seatings.add(io, socket, data));
        socket.on('removeSeating', (seating) => Seatings.remove(io, socket, seating));
    }));
}

type SeatingToAdd = {
    section: {
        id: number;
        name: string;
        type: string;
        image_url: string;
        realm_id: number;
    },
    number: string;
}

type SetAttributeData = {
    seating: Seating;
    attribute: string;
    value: string|number|boolean;
}

type NewLocationData = {
    seating: Seating;
    newLocation: {
        pos_x: number;
        pos_y: number;
        section_id: number;
    }
}

function isValidSeatingToAdd(seating: any): seating is SeatingToAdd {
    return typeof seating.number === 'number' &&
           typeof seating.section.id === 'number' &&
           typeof seating.section.name === 'string' &&
           typeof seating.section.type === 'string' &&
           typeof seating.section.image_url === 'string' &&
           typeof seating.section.realm_id === 'number';
}

function isValidSetAttributeData(data: any): data is SetAttributeData {
    return isValidSeating(data.seating) &&
           typeof data.attribute === 'string' &&
           (typeof data.value === 'string' || typeof data.value === 'number' || typeof data.value === 'boolean');
}

export function isValidNewLocationData(data: any): data is NewLocationData {
    return isValidSeating(data.seating) &&
           typeof data.newLocation === 'object' &&
           data.newLocation !== null &&
           typeof data.newLocation.pos_x === 'number' &&
           typeof data.newLocation.pos_y === 'number' &&
           typeof data.newLocation.section_id === 'number';
}

export class Seatings {
    private static table = 'seatings';

    public static async get(socket: Socket) {
        try {
            const query = 
            `SELECT t.*, s.name AS section_name 
            FROM ${this.table} t 
            JOIN sections s ON t.section_id = s.id;`
    
            const result = await Database.query(query);

            if (result) {
                socket.emit('getSeatings', result);
            } else {
                console.log('Failed to fetch seatings.');
                MessageHandler.sendError(socket, 'Failed to fetch seatings.');
            }
        } catch(err) {
            console.log('Failed to fetch seatings.', err)
            MessageHandler.sendError(socket, 'Failed to fetch seatings.');
        }
    }

    public static async add(io: Server, socket: Socket, data: any) {
        if (!isValidSeatingToAdd(data)) {
            console.log('Invalid format: SeatingToAdd', data);
            MessageHandler.sendError(socket, 'Invalid format: SeatingToAdd');
            return;
        }

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

            if (id) {
                io.emit('addSeating', {...parsedSeating, id});
            } else {
                console.log('Failed to add seating.');
                MessageHandler.sendError(socket, 'Failed to add seating.');
            }
        } catch(err) {
            console.log('Failed to add seating', err);
            MessageHandler.sendError(socket, 'Failed to add seating.');
        }
    }

    public static async remove(io: Server, socket: Socket, seating: any) {
        if (!isValidSeating(seating)) {
            console.log('Invalid format: Seating', seating);
            MessageHandler.sendError(socket, 'Invalid format: Seating');
            return;
        }

        //Check if there are customers in the seating before deleting.
        try {
            const query = `SELECT COUNT(*) FROM customers WHERE "seating_id" = ${seating.id};`
            const result = await Database.query(query);
            const customers = result[0].count;

            if (customers > 0) {
                MessageHandler.sendWarning(socket, 'There are still customers in this seating. Please remove them and try again.');
                return;
            } 
        } catch(err) {
            console.log('Failed to fetch amount of customers associated with this seating.', err);
            MessageHandler.sendError(socket, 'Failed to remove seating.');
            return;
        }

        try {
            await this.reset(io, socket, seating);
            const result = await Database.remove(this.table, 'id', seating.id);

            if (result) {
                io.emit('removeSeating', seating);
            } else {
                console.log('Failed to remove seating.');
                MessageHandler.sendError(socket, 'Failed to remove seating.');
            }
        } catch(err) {
            console.log('Failed to remove seating.', err);
            MessageHandler.sendError(socket, 'Failed to remove seating.');
        }
    }

    public static async setAttribute(io: Server, socket: Socket, data: any) {
        if (!isValidSetAttributeData(data)) {
            console.log('Invalid format: SetAttributeData', data);
            MessageHandler.sendError(socket, 'Invalid format: SetAttributeData');
            return;
        }
        
        try {
            const { seating, attribute, value } = data;
            const result = await Database.update(this.table, attribute, value, 'id', seating.id);

            if (result) {
                io.emit('setSeatingAttribute', data);
            } else {
                console.log('Failed to edit attribute.');
                MessageHandler.sendError(socket, 'Failed to edit attribute.');
            }
        } catch(err) {
            MessageHandler.sendError(socket, 'Failed to edit attribute.');
        }
    }

    public static async reset(io: Server, socket: Socket, seating: Seating) {
        if (!isValidSeating(seating)) {
            console.log('Invalid format: Seating');
            MessageHandler.sendError(socket, 'Invalid format: Seating');
            return;
        }

        try {
            const deleteOrdersQuery = 'DELETE FROM "orders" WHERE "seating_id" = $1';
            const deleteCustomerQuery = 'DELETE FROM "customers" WHERE "seating_id" = $1';
            const resetSeatingQuery = `
                UPDATE ${this.table}
                SET "is_available" = true, "is_reserved" = false, "is_photography" = false
                WHERE "id" = $1;
            `;

            await Database.query(deleteOrdersQuery, [seating.id]);
            await Database.query(deleteCustomerQuery, [seating.id]);
            await Database.query(resetSeatingQuery, [seating.id]);
    
            io.emit('removeAllOrdersFromSeating', seating);
            io.emit('removeAllCustomersFromSeating', seating);
            io.emit('resetSeating', seating);
        } catch(err) {
            console.log('Failed to reset seating.', err);
            MessageHandler.sendError(socket, 'Failed to reset Seating');
        }
    }

    public static async setLocation(io: Server, socket: Socket, data) {
        if (!isValidNewLocationData(data)) {
            console.log('Invalid format: SetLocationData', data);
            MessageHandler.sendError(socket, 'Invalid format: SetLocationData');
            return;
        }

        try {
            const { seating, newLocation } = data;
            const { pos_x, pos_y, section_id } = newLocation;

            const query = `
                UPDATE ${this.table}
                SET "pos_x" = ${pos_x}, "pos_y" = ${pos_y}, "section_id" = ${section_id}
                WHERE "id" = ${seating.id}
            `;

            const result = Database.query(query);

            if (result) {
                io.emit('setSeatingLocation', data);
            } else {
                console.log('Failed to move seating.');
                MessageHandler.sendError(socket, 'Failed to move seating.');
            }

        } catch(err) {
            console.log(err);
            MessageHandler.sendError(socket, 'Failed to move seating.');
        }    
    }
}