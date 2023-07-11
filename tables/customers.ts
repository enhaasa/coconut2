import Database from './../database';
import { Socket, Server } from 'socket.io';
import { Time } from '../dbTools_server';

module.exports = function registerHandlers(io) {
    io.on('connection', (socket => {
        socket.on('getCustomers', () => Customers.get(socket));
        socket.on('addCustomer', (data) => Customers.add(io, data));
        socket.on('removeCustomer', (data) => Customers.remove(io, data));
        socket.on('editCustomerName', (data) => Customers.editName(io, data));
        socket.on('setCustomerSession', (data) => Customers.setSession(socket, data));
        socket.on('removeAllCustomersFromTable', (data) => Customers.removeAllFromTable(socket, data));
    }));
}

export default class Customers {
    private static table = 'customers';

    public static async get(socket: Socket) {
        socket.emit('getCustomers', await Database.get(this.table));
    }

    public static async add(io: Server, data) {
        
        const is_first_query = `
            SELECT EXISTS (
                SELECT 1
                FROM sessions
                WHERE realm_id = ${data.customer.realm_id} 
                AND table_id = ${data.customer.table_id} AND is_paid = false
            );
        `;

        const is_first_check = await Database.pool.query(is_first_query);
        const is_first = !is_first_check.rows[0].exists
            
        if (is_first) {
            const new_session = {
                price: null,
                is_paid: false,
                datetime: Time.getCurrentDateTime(),
                table_id: data.customer.table_id,
                realm_id: data.customer.realm_id,
                section_id: data.customer.section_id
            };

            const new_session_id = await Database.add('sessions', new_session, "id");
            io.emit('addSession', {...new_session, id: new_session_id});
            io.emit('setTableSessionID', { id: data.customer.table_id, session_id: new_session_id });
            Database.update('tables', 'session_id', new_session_id, 'id', data.customer.table_id);

            data.customer.session_id = new_session_id;
        }

        Database.add(this.table, data.customer);
        io.emit('addCustomer', data.customer);
    }

    public static remove(io: Server, data) {
        Database.remove(this.table, 'uuid', data.uuid);7
        io.emit('removeCustomer', data.uuid);
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