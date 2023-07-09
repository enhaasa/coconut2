import db from './../database';
import { Socket, Server } from 'socket.io';

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

class Customers {
    private static table = 'customers';

    public static async get(socket: Socket) {
        socket.emit('getCustomers', await db.get(this.table));
    }

    public static add(io: Server, data) {
        db.add(this.table, data.customer);
        io.emit('addCustomer', data.customer);
    }

    public static remove(io: Server, data) {
        db.remove(this.table, 'uuid', data.uuid);
        io.emit('removeCustomer', data.uuid);
    }

    public static editName(io: Server, data) {
        db.update(this.table, 'name', data.name, 'uuid', data.uuid);
        io.emit('editCustomerName', data.uuid, data.name);
    }

    public static setSession(socket: Socket, data) {
        db.update(this.table, 'session', data.session, 'id', data.id);
        socket.broadcast.emit('setCustomerSession', data.id, data.session);
    }

    public static removeAllFromTable(socket: Socket, data) {
        db.remove(this.table, '`table`', data.id);
        socket.broadcast.emit('removeAllCustomersFromTable');
    }
}