import db from './../database';
import { Socket } from 'socket.io';

module.exports = function registerHandlers(io) {
    io.on("connection", (socket => {
        socket.on("addCustomer", (data) => Customers.add(socket, data));
        socket.on("removeCustomer", (data) => Customers.remove(socket, data));
        socket.on("editCustomerName", (data) => Customers.editName(socket, data));
        socket.on("setCustomerSession", (data) => Customers.setSession(socket, data));
        socket.on("removeAllCustomersFromTable", (data) => Customers.removeAllFromTable(socket, data));
    }));
}

class Customers {
    private static table = 'customers';

    public static add(socket: Socket, data) {
        db.add(this.table, data.customer);
        socket.broadcast.emit('addCustomer', data.customer);
    }

    public static remove(socket: Socket, data) {
        db.remove(this.table, 'id', data.id);
        socket.broadcast.emit('removeCustomer', data.id, data.tableID);
    }

    public static editName(socket: Socket, data) {
        db.update(this.table, 'name', data.name, 'id', data.id);
        socket.broadcast.emit('editCustomerName', data.id, data.name);
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