import Database from '../database';
import MessageHandler from '../messages';
import { Socket, Server } from 'socket.io';
import { Customer, isValidCustomer } from '../shared/types';

module.exports = function registerHandlers(io) {
    io.on('connection', (socket => {
        socket.on('getCustomers', () => Customers.get(socket));
        socket.on('addCustomer', (customer: any) => Customers.add(io, socket, customer));
        socket.on('removeCustomer', (customer: any) => Customers.remove(io, socket, customer));
        socket.on('editCustomerName', (data: any) => Customers.editName(io, socket, data));
    }));
}

export type CustomerToAdd = {
    name: string;
    section_id: number;
    seating_id: number;
}

export type EditNameData = {
    customer: Customer;
    name: string;
}

export function isValidEditNameData(data: any): data is EditNameData {
    return typeof data.name === 'string' &&
           isValidCustomer(data.customer);
}

export function isValidCustomerToAdd(customer: any): customer is CustomerToAdd {
    return typeof customer.name === 'string' &&
           typeof customer.section_id === 'number' &&
           typeof customer.seating_id === 'number';
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

    public static async add(io: Server, socket: Socket, customer: any) {
        if (!isValidCustomerToAdd(customer)) {
            console.log('Invalid format: CustomerToAdd', customer);
            MessageHandler.sendError(socket, 'Invalid format: CustomerToAdd.');
            return;
        }
    
        try {
            const result = await Database.add(this.table, customer, 'id');
            const id = result[0].id;
            io.emit('addCustomer', {...customer, id: id});
        } catch (err) {
            console.error('Failed to add customer:', err);
            MessageHandler.sendError(socket, 'Failed to add customer.');
        }
    }

    public static async remove(io: Server, socket: Socket, customer: any) {
        if (!isValidCustomer(customer)) {
            console.log('Invalid format: Customer', customer);
            MessageHandler.sendError(socket, 'Invalid format: Customer.');
            return;
        }

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
}