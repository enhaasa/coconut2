import Database from './../database';
import { Socket } from 'socket.io';

module.exports = function registerHandlers(io) {
    io.on('connection', (socket => {
        socket.on('getSections', () => Sections.get(socket));
    }));
}

class Sections {
    private static table = 'sections';

    public static async get(socket: Socket) {
        const result = await Database.get(this.table);

        socket.emit('getSections', result);
    }

}