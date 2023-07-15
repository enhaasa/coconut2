import Database from './../database';
import { Socket, Server } from 'socket.io';
import { Time } from '../dbTools_server';
import uuid = require('react-uuid');

module.exports = function registerHandlers(io) {
    io.on('connection', (socket => {
        socket.on('getOrders', () => Orders.get(socket));
        socket.on('addOrder', (order) => Orders.add(io, order));
        socket.on('removeOrder', (uuid) => Orders.remove(io, uuid));
        socket.on('removeAllOrdersByTableID', (data) => Orders.removeAllByTableID(socket, data));
    }));
}

export class Orders {
    private static table = 'orders';

    public static async get(socket: Socket) {
        const query = `SELECT * from ${this.table}`;
        const result = await Database.pool.query(query);

        socket.emit('getOrders', result.rows)
    }

    public static add(io: Server, order) {
        
        const parsed_order = {
            ...order,
            realm_id: 1,
            time: Time.getCurrentTime(),
            date: Time.getCurrentDateTime(),
            uuid: uuid(),
        }
        
        io.emit('addOrder', parsed_order);
        Database.add(this.table, parsed_order);
        
    }

    public static remove(io: Server, order) {
        console.log("Removing " + order.uuid);
        Database.remove(this.table, 'uuid', order.uuid);
        io.emit('removeOrder', order);
    }

    public static removeAllByTableID(socket: Socket, data) {
        Database.remove(this.table, '`table`', data.id);
        socket.broadcast.emit('removeAllOrdersByTableID');
    }
}