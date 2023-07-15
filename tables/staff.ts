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
        const condition_query = `WHERE "is_active" = true`;
        const result = await Database.get(this.table, condition_query);

        socket.emit('getStaff', result)
    }

    public static async setAttribute(io: Server, data) {
        const { staff_member, attribute, value } = data;

        Database.update(this.table, attribute, value, 'id', staff_member.id);
        io.emit('setStaffAttribute', data);
    }
}