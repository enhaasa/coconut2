import Database from './../database';
import { Socket, Server } from 'socket.io';

module.exports = function registerHandlers(io) {
    io.on('connection', (socket => {
        socket.on('getArchivedSessions', () => ArchivedSessions.get(socket));
        socket.on('addArchivedSession', session => ArchivedSessions.add(io, session))
    }));
}

class ArchivedSessions {
    private static table = 'archived_sessions';

    public static async get(socket: Socket) {
        const query = `SELECT * from ${this.table}`;
        const result = await Database.pool.query(query);

        socket.emit('getArchivedSessions', result.rows);
    }

    public static async add(io: Server, session) {

        Database.add(this.table, session);

        io.emit('addArchivedSession', session);
    }

}