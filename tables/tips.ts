import Database from './../database';
import { Socket, Server } from 'socket.io';

module.exports = function registerHandlers(io) {
    io.on('connection', (socket => {
        socket.on('getTips', () => Tips.get(socket));
        socket.on('addTip', session => Tips.add(io, session))
    }));
}

class Tips {
    private static table = 'tips';

    public static async get(socket: Socket) {
        const query = `SELECT * from ${this.table}`;
        const result = await Database.pool.query(query);

        socket.emit('getTips', result.rows);
    }

    public static async add(io: Server, session) {

        Database.add(this.table, session);

        io.emit('addTip', session);
    }

}