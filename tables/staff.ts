import Database from './../database';
import { Socket, Server } from 'socket.io';

module.exports = function registerHandlers(io) {
    io.on('connection', (socket => {
        socket.on('getStaff', () => Staff.get(socket));
        socket.on('setStaffAttribute', (data) => Staff.setAttribute(io, data));
    }));
}

class Staff {
    private static table = 'characters';

    public static async get(socket: Socket) {
        const condition_query = `
            SELECT * FROM ${this.table} WHERE "is_active" = true AND realm_id = 1
        `;
        const result = await Database.query(condition_query);

        socket.emit('getStaff', result)
    }

    public static async setAttribute(io: Server, data) {
        const { staff_member, attribute, value } = data;

        console.log(data)

        Database.update(this.table, attribute, value, 'id', staff_member.id);
        io.emit('setStaffAttribute', data);
    }
}