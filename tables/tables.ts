import db from './../database';
import { Socket } from 'socket.io';

module.exports = function registerHandlers(io) {
    io.on('connection', (socket => {
        socket.on('getTables', () => Sections.get(socket));
    }));
}

class Sections {
    private static table = 'tables';

    public static async get(socket: Socket) {
        const query = 
        `SELECT t.*, s.name AS section_name 
        FROM tables t 
        JOIN sections s ON t.section_id = s.id;`

        //socket.emit('getTables', await db.get(this.table));

        const result = await db.pool.query(query);

        socket.emit('getTables', result.rows)
    }

}