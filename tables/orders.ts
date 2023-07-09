import db from './../database';
import { Socket } from 'socket.io';

module.exports = function registerHandlers(io) {
    io.on('connection', (socket => {
        socket.on('addOrder', (data) => Orders.add(socket, data));
        socket.on('removeOrder', (data) => Orders.remove(socket, data));
        socket.on('removeAllOrdersByTableID', (data) => Orders.removeAllByTableID(socket, data));
    }));
}

class Orders {
    private static table = 'orders';

    public static add(socket: Socket, data) {
        db.add(this.table, data.order);
        socket.broadcast.emit('addOrder', data.order);
    }

    public static remove(socket: Socket, data) {
        db.remove(this.table, 'id', data.id);
        socket.broadcast.emit('removeOrder', data.id);
    }

    public static removeAllByTableID(socket: Socket, data) {
        db.remove(this.table, '`table`', data.id);
        socket.broadcast.emit('removeAllOrdersByTableID');
    }
}