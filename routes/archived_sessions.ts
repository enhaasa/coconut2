import Database from '../database';
import MessageHandler from '../messages';
import { Socket, Server } from 'socket.io';
import { Session, isValidSession } from '../shared/types';

module.exports = function registerHandlers(io) {
    io.on('connection', (socket => {
        socket.on('getArchivedSessions', () => ArchivedSessions.get(socket));
        socket.on('addArchivedSession', session => ArchivedSessions.add(io, socket, session));
        socket.on('setArchivedSessionAmountPaid', data => ArchivedSessions.setAmountPaid(io, socket, data));
    }));
}

type SetAmountPaidData = {
    session: Session;
    amount: number;
}

function isValidSetAmountPaidData(data: any): data is SetAmountPaidData {
    return isValidSession(data.session) && typeof data.amount === 'number';
}

class ArchivedSessions {
    private static table = 'archived_sessions';

    public static async get(socket: Socket) {
        try {
            const query = `SELECT * from ${this.table}`;
            const result = await Database.query(query);
    
            socket.emit('getArchivedSessions', result);
        } catch {
            console.log('Failed to fetch archived sessions.');
            MessageHandler.sendError(socket, 'Failed to fetch archived sessions.');
        }
    }

    public static async add(io: Server, socket: Socket, session) {
        if (!isValidSession(session)) {
            console.log('Invalid format: Session', session)
            MessageHandler.sendError(socket, 'Invalid format: Session');
            return;
        }

        try {
            Database.add(this.table, session);
            io.emit('addArchivedSession', session);
        } catch(err) {
            console.log('Failed to add session.', err);
            MessageHandler.sendError(socket, 'Failed to add session');
        }
    }

    public static async setAmountPaid(io: Server, socket: Socket, data) {
        if (!isValidSetAmountPaidData(data)) {
            console.log('Invalid format: SetAmountPaidData', data);
            MessageHandler.sendError(socket, 'Invalid format: SetAmountPaidData');
            return;
        }

        try {
            const { session, amount } = data;
            Database.update(this.table, 'amount_paid', amount, 'id', session.id);
            io.emit('setArchivedSessionAmountPaid', data);
        } catch (err) {
            console.log('Failed to edit amount paid.', err);
            MessageHandler.sendError(socket, 'Failed to edit amount paid.');
        }
    }
}