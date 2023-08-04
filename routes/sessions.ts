import Database from '../database';
import { Socket, Server } from 'socket.io';

module.exports = function registerHandlers(io) {
    io.on('connection', (socket => {
        socket.on('getSessions', () => Sessions.get(io));
        socket.on('addSession', (data) => Sessions.add(io, data));
    }));
}

export default class Sessions {
    private static table = 'sessions';

    public static async get(socket: Socket) {
        const query = `SELECT * from ${this.table}`;
        const result = await Database.query(query);

        socket.emit('getSessions', result)
    }

    public static async add(io: Server, data) {
        
        Database.add(this.table, data.session);
        io.emit('addSession', data.session);
    }

}