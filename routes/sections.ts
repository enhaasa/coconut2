import Database from '../database';
import MessageHandler from '../messages';
import { Socket } from 'socket.io';

module.exports = function registerHandlers(io) {
    io.on('connection', (socket => {
        socket.on('getSections', () => Sections.get(socket));
    }));
}

class Sections {
    private static table = 'sections';

    public static async get(socket: Socket) {
        try {
            const query = `
                SELECT * FROM ${this.table}
                WHERE realm_id = 1;
            `;

            const result = await Database.query(query);
        
            socket.emit('getSections', result);
        } catch(err) {
            console.log('Failed to fetch sections.', err);
            MessageHandler.sendError(socket, 'Failed to fetch sections.');
        }
    }
}