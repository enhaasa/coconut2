import Database from '../database';
import MessageHandler from '../messages';
import { Socket, Server } from 'socket.io';

module.exports = function registerHandlers(io: Server) {
    io.on('connection', (socket => {
        socket.on('getServiceMenu', () => ServiceMenu.get(socket));
    }));
}

class ServiceMenu {
    private static table = 'service_items';

    public static async get(socket: Socket) {
        try {
            const query = `
                SELECT * FROM ${this.table}
                WHERE realm_id = 1;
            `;

            const result = await Database.query(query);
            socket.emit('getServiceMenu', result);

        } catch (err) {
            console.log('Failed to fetch service menu.', err);
            MessageHandler.sendError(socket, 'Failed to fetch service menu');
        }
    }
}