import Database from './../database';
import { Socket, Server } from 'socket.io';

module.exports = function registerHandlers(io) {
    io.on('connection', (socket => {
        socket.on('getTables', () => Tables.get(socket));
        socket.on('setTableSessionID', (data) => Tables.setSessionID(io, data));
    }));
}

export class Tables {
    private static table = 'tables';

    public static async get(socket: Socket) {
        const query = 
        `SELECT t.*, s.name AS section_name 
        FROM ${this.table} t 
        JOIN sections s ON t.section_id = s.id;`

        //socket.emit('getTables', await db.get(this.table));

        const result = await Database.pool.query(query);

        socket.emit('getTables', result.rows);
    }

    public static async setSessionID(io: Server, data) {
        //console.log(data)
        io.emit('setTableSessionID', data);
    }

}