import Database from '../database';
import MessageHandler from '../messages';
import { Socket, Server } from 'socket.io';
import { Customer, isValidCustomer } from '../shared/types';
import { Order, Seating} from '../shared/types';

module.exports = function registerHandlers(io) {
    io.on('connection', (socket => {
        socket.on('getCustomers', () => Customers.get(socket));
        socket.on('addCustomer', (data: any) => Customers.add(io, socket, data));
        socket.on('removeCustomer', (customer: any) => Customers.remove(io, socket, customer));
        socket.on('editCustomerName', (data: any) => Customers.editName(io, socket, data));
        socket.on('moveCustomer', (data: any) => Customers.move(io, socket, data));
    }));
}

export type CustomerToAdd = {
    customer: {
        name: string;
        section_id: number;
        seating_id: number;
    }
    requestID?: string;
}

export type EditNameData = {
    customer: Customer;
    name: string;
}

export function isValidEditNameData(data: any): data is EditNameData {
    return typeof data.name === 'string' &&
           isValidCustomer(data.customer);
}

export function isValidCustomerToAdd(data: any): data is CustomerToAdd {
    return typeof data.customer.name === 'string' &&
           typeof data.customer.section_id === 'number' &&
           typeof data.customer.seating_id === 'number';
}

export function isValidCustomerMoveData(data: any) {
    return typeof data.target_seating_id == 'number' &&
           isValidCustomer(data.customer);
}

export default class Customers {
    private static table = 'customers';

    public static async get(socket: Socket) {
        try {
            const customers = await Database.get(this.table);
            socket.emit('getCustomers', customers);
        } catch (err) {
            MessageHandler.sendError(socket, 'Failed to fetch customers.');
        }
    }

    public static async add(io: Server, socket: Socket, data: any) {
        if (!isValidCustomerToAdd(data)) {
            console.log('Invalid format: CustomerToAdd', data);
            MessageHandler.sendError(socket, 'Invalid format: CustomerToAdd.');
            return;
        }

        const { customer, requestID } = data;
    
        try {
            const result = await Database.add(this.table, customer, 'id');
            const id = result[0].id;
            io.emit('addCustomer', {...customer, id: id});
            requestID && socket.emit('getRequestConfirmation', requestID);
        } catch (err) {
            console.error('Failed to add customer:', err);
            MessageHandler.sendError(socket, 'Failed to add customer.');
        }
    }

    public static async remove(io: Server, socket: Socket, data: any) {
        if (!isValidCustomer(data.customer)) {
            console.log('Invalid format: Customer', data.customer);
            MessageHandler.sendError(socket, 'Invalid format: Customer.');
            return;
        }

        const { customer, requestID } = data;

        const deleteOrdersQuery = 'DELETE FROM "orders" WHERE "customer_id" = $1';
        const deleteCustomerQuery = 'DELETE FROM "customers" WHERE "id" = $1';
        
        const handleDatabaseError = (err: Error) => {
            if (err) {
                console.error('Database error:', err);
                throw err;
            }
        };
    
        try {
            const orderResult = await Database.query(deleteOrdersQuery, [customer.id]);
            handleDatabaseError(orderResult.error);
    
            const customerResult = await Database.query(deleteCustomerQuery, [customer.id]);
            handleDatabaseError(customerResult.error);
            
            io.emit('removeAllOrdersByCustomer', customer);
            io.emit('removeCustomer', customer);
            socket.emit('getRequestConfirmation', requestID);
    
        } catch (err) {
            console.error('Failed to remove customer:', err);
            MessageHandler.sendError(socket, 'Failed to remove customer.');
        }
    }

    public static async editName(io: Server, socket: Socket, data: any) {
        if (!isValidEditNameData(data)) {
            console.log('Invalid format: EditNameData', data);
            MessageHandler.sendError(socket, 'Invalid format: EditNameData.');
            return;
        }
    
        const { name } = data;
        const { id } = data.customer;
    
        try {
            await Database.update(this.table, 'name', name, 'id', id);
            io.emit('editCustomerName', data);
        } catch (err) {
            console.error('Failed to edit customer name:', err);
            MessageHandler.sendError(socket, 'Failed to edit customer name.');
        }
    }

    public static async move(io: Server, socket: Socket, data: any) {
        if (!isValidCustomerMoveData(data)) {
            console.log('Invalid format: MoveCustomerData', data);
            MessageHandler.sendError(socket, 'Invalid format: MoveCustomerData');
            return;
        }

        const { target_seating_id, customer } = data;
        let new_seating: Seating;

        //Get data from new seating
        try {
            const query = `SELECT * FROM "seatings" WHERE id= ${target_seating_id}`;
            const result = await Database.query(query);
            new_seating = result[0];
        } catch(err) {
            console.log(err);
            MessageHandler.sendError(socket, 'Failed to fetch data from new seating.');
        }

        //Move customer
        try {
            const query = `UPDATE ${this.table} 
                           SET 
                            seating_id = ${new_seating.id}, 
                            section_id = ${new_seating.section_id}
                           WHERE id = ${customer.id}
                           `;
            await Database.query(query);
        } catch(err) {
            console.log('Failed to move customer.', err);
            MessageHandler.sendError(socket, 'Failed to move customer.');
            return;
        }

        //Move orders
        try {
            const query = `UPDATE "orders" 
            SET 
             seating_id = ${new_seating.id}, 
             section_id = ${new_seating.section_id}
            WHERE customer_id = ${customer.id}
            `;

            await Database.query(query);
        } catch(err) {
            console.log('Failed to move related orders.', err);
            MessageHandler.sendError(socket, 'Failed to move related orders.');
            return;
        }

        io.emit('setCustomerAttributes', {customer, attributes: [
            ['seating_id', new_seating.id],
            ['section_id', new_seating.section_id],
        ]});

        io.emit('setOrdersAttributes', {
            key: 'customer_id', 
            value: customer.id,
            attributes: [
                ['seating_id', new_seating.id],
                ['section_id', new_seating.section_id],
            ]
        });
    }
}