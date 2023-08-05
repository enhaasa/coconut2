import Database from '../database';
import MessageHandler from '../messages';
import { Socket } from 'socket.io';

module.exports = function registerHandlers(io) {
    io.on('connection', (socket => {
        socket.on('getMenu', () => Menu.get(socket));
    }));
}

class Menu {
    private static table = 'menu_items';

    public static async get(socket: Socket) {
        try {
            const result = await Database.get(this.table);
            socket.emit('getMenu', result)

        } catch (err) {
            console.log('Failed to fetch menu.', err);
            MessageHandler.sendError(socket, 'Failed to fetch menu');
        }
    }
}