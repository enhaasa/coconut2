import Database from './../database';
import { Socket, Server } from 'socket.io';
import { Time } from '../dbTools_server';
import { Customer } from '../shared/types';

module.exports = function registerHandlers(io) {
    io.on('connection', (socket => {
        socket.on('getCustomers', () => Customers.get(socket));
        socket.on('addCustomer', (customer: Customer) => Customers.add(io, customer));
        socket.on('removeCustomer', (customer: Customer) => Customers.remove(io, customer));
        socket.on('editCustomerName', (data) => Customers.editName(io, data));
        socket.on('setCustomerSession', (data) => Customers.setSession(socket, data));
        socket.on('removeAllCustomersFromTable', (data) => Customers.removeAllFromTable(socket, data));
    }));
}


export default class Customers {
    private static table = 'customers';

    public static async get(socket: Socket) {
        const customers = await Database.get(this.table);
        
        socket.emit('getCustomers', customers);
    }

    public static async add(io: Server, customer: Customer) {

        const is_first_query = `
            SELECT EXISTS (
                SELECT 1
                FROM sessions
                WHERE realm_id = ${customer.realm_id} 
                AND table_id = ${customer.table_id}
            );
        `;

        const is_first_check = await Database.query(is_first_query);
        const is_first = !is_first_check[0].exists;

        if (is_first) {
            const new_session = {
                price: null,
                datetime: Time.getCurrentDateTime(),
                table_id: customer.table_id,
                realm_id: customer.realm_id,
                section_id: customer.section_id
            };

            const new_session_id = await Database.add('sessions', new_session, 'id');
            io.emit('addSession', {...new_session, id: new_session_id});
            io.emit('setTableSessionID', { id: customer.table_id, session_id: new_session_id });
            Database.update('tables', 'session_id', new_session_id, 'id', customer.table_id);

            customer.session_id = new_session_id;
        }

        const new_customer_id = await Database.add(this.table, customer, 'id');
        io.emit('addCustomer', {...customer, id: new_customer_id});
    }

    public static remove(io: Server, customer: Customer) {
        const is_last_query = `
            SELECT EXISTS (
                SELECT 1 
                FROM customers
                WHERE realm_id = 1
                AND table_id = ${customer.table_id}
            );
        `;

        
        const deleteOrdersQuery = 'DELETE FROM "orders" WHERE "customer_id" = $1';
        const deleteCustomerQuery = 'DELETE FROM "customers" WHERE "id" = $1';
        
        Database.query(deleteOrdersQuery, [customer.id], (err, result) => {
            if (err) {
                console.log(err);
            } else {
                Database.query(deleteCustomerQuery, [customer.id], (err, result) => {
                    if (err) {
                        console.log(err);
                    }
                });
            }
        });

        io.emit('removeCustomer', customer);
    }

    public static editName(io: Server, data) {
        Database.update(this.table, 'name', data.name, 'uuid', data.uuid);
        io.emit('editCustomerName', data.uuid, data.name);
    }

    public static setSession(socket: Socket, data) {
        Database.update(this.table, 'session', data.session, 'id', data.id);
        socket.broadcast.emit('setCustomerSession', data.id, data.session);
    }

    public static removeAllFromTable(socket: Socket, data) {
        Database.remove(this.table, '`table`', data.id);
        socket.broadcast.emit('removeAllCustomersFromTable');
    }
}