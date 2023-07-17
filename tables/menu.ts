import Database from './../database';
import { Socket } from 'socket.io';

module.exports = function registerHandlers(io) {
    io.on('connection', (socket => {
        socket.on('getMenu', () => Menu.get(socket));
    }));
}

class Menu {
    private static table = 'menu_items';

    public static async get(socket: Socket) {
        const query = `SELECT * from ${this.table}`;
        const result = await Database.query(query);

        socket.emit('getMenu', result)
    }

}