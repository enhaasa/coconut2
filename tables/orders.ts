import Database from './../database';
import { Socket, Server } from 'socket.io';
import { Time } from '../dbTools_server';
import uuid = require('react-uuid');

module.exports = function registerHandlers(io) {
    io.on('connection', (socket => {
        socket.on('getOrders', () => Orders.get(socket));
        socket.on('addOrder', (data) => Orders.add(io, data));
        socket.on('removeOrder', (data) => Orders.remove(socket, data));
        socket.on('removeAllOrdersByTableID', (data) => Orders.removeAllByTableID(socket, data));
    }));
}

export class Orders {
    private static table = 'orders';

    public static async get(socket: Socket) {
        const query = `SELECT * from ${this.table}`;
        const result = await db.pool.query(query);

        socket.emit('getOrders', result.rows)
    }

    public static add(io: Server, data) {
        //db.add(this.table, data.order);
        
        const order = {
            ...data.order,
            realm_id: 1,
            time: Time.getCurrentTime(),
            date: Time.getCurrentDateTime(),
            uuid: uuid(),
        }

        //io.emit('addOrder', data.order);
        Database.add(this.table, order);
        console.log(order)
        
    }

    public static remove(socket: Socket, data) {
        Database.remove(this.table, 'id', data.id);
        socket.broadcast.emit('removeOrder', data.id);
    }

    public static removeAllByTableID(socket: Socket, data) {
        Database.remove(this.table, '`table`', data.id);
        socket.broadcast.emit('removeAllOrdersByTableID');
    }
}