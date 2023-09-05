import Database from '../database';
import MessageHandler from '../messages';
import { Socket, Server } from 'socket.io';
import { Character, isValidCharacter } from '../shared/types';

module.exports = function registerHandlers(io) {
    io.on('connection', (socket => {
        socket.on('getStaff', () => Staff.get(socket));
        socket.on('setStaffAttribute', (data) => Staff.setAttribute(io, socket, data));
    }));
}

type SetAttributeData = {
    staff_member: Character;
    attribute: string;
    value: string|number|boolean;
}

function isValidSetAttributeData(data: any): data is SetAttributeData {
    const isStaffMemberValid = isValidCharacter(data.staff_member);
    const isAttributeValid = typeof data.attribute === 'string';
    const isValueValid = 
        typeof data.value === 'string' || 
        typeof data.value === 'number' || 
        typeof data.value === 'boolean';

    return isStaffMemberValid && isAttributeValid && isValueValid;
}

class Staff {
    private static table = 'characters';

    public static async get(socket: Socket) {
        try {
            const condition_query = `
                SELECT t.*, u.realm_id
                FROM ${this.table} t 
                JOIN users u ON t.user_id = u.id
                WHERE is_active = true
                AND realm_id = 1;
            `;
            const result = await Database.query(condition_query);
            socket.emit('getStaff', result);
        } catch(err) {
            console.log('Failed to fetch characters');
            MessageHandler.sendError(socket, 'Failed to fetch characters.');
        }
    }

    public static async setAttribute(io: Server, socket: Socket, data) {
        if (!isValidSetAttributeData) {
            console.log('Invalid format: SetAttributeData', data);
            MessageHandler.sendError(socket, 'Invalid format: SetAttributeData');
            return;
        }

        try {
            const { staff_member, attribute, value } = data;
            const result = await Database.update(this.table, attribute, value, 'id', staff_member.id);

            if (result) {
                io.emit('setStaffAttribute', data);
            } else {
                console.log('Failed to change character attribute.');
                MessageHandler.sendError(socket, 'Failed to change character attribute.');
            }
        } catch(err) {
            console.log('Failed to change character attribute.');
            MessageHandler.sendError(socket, 'Failed to change character attribute.');
        }
    }
}