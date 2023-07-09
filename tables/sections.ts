import db from './../database';
import { Socket } from 'socket.io';

module.exports = function registerHandlers(io) {
    io.on('connection', (socket => {
        socket.on('getSections', () => Sections.get(socket));
    }));
}

class Sections {
    private static table = 'sections';

    public static async get(socket: Socket) {
        socket.emit('getSections', await db.get(this.table));
    }

}