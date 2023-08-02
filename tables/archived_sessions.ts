import Database from './../database';
import { Socket, Server } from 'socket.io';

module.exports = function registerHandlers(io) {
    io.on('connection', (socket => {
        socket.on('getArchivedSessions', () => ArchivedSessions.get(socket));
        socket.on('addArchivedSession', session => ArchivedSessions.add(io, session));
        socket.on('setArchivedSessionAmountPaid', data => ArchivedSessions.setAmountPaid(io, data));
    }));
}

class ArchivedSessions {
    private static table = 'archived_sessions';

    public static async get(socket: Socket) {
        const query = `SELECT * from ${this.table}`;
        const result = await Database.query(query);

        socket.emit('getArchivedSessions', result);
    }

    public static async add(io: Server, session) {

        Database.add(this.table, session);
        io.emit('addArchivedSession', session);
    }

    public static async setAmountPaid(io: Server, data) {
        try {
            const { session, amount } = data;

            Database.update(this.table, 'amount_paid', amount, 'id', session.id);
            io.emit('setArchivedSessionAmountPaid', data);
        } catch (error) {
            console.log('Garbage data provided. Aborting request.');
            console.log(error);
        }
    }

}