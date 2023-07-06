import db from './../database';
import { Socket } from 'socket.io';

module.exports = function registerHandlers(io) {
    io.on("connection", (socket => {
        socket.on("addCustomer", (data) => Orders.add(socket, data));
        socket.on("removeCustomer", (data) => Orders.remove(socket, data));
        socket.on("removeAllCustomersFromTable", (data) => Orders.removeAllByTableID(socket, data));
    }));
}

class Orders {
    private static table = 'orders';

    public static add(socket: Socket, data) {
        db.add(this.table, data.customer);
        socket.broadcast.emit('addCustomer', data.customer);
    }

    public static remove(socket: Socket, data) {
        db.remove(this.table, 'id', data.id);
        socket.broadcast.emit('removeCustomer', data.id, data.tableID);
    }

    public static removeAllByTableID(socket: Socket, data) {
        db.remove(this.table, '`table`', data.id);
        socket.broadcast.emit('removeAllCustomersFromTable');
    }
}