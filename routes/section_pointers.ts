import Database from '../database';
import MessageHandler from '../messages';
import { Socket, Server } from 'socket.io';

module.exports = function registerHandlers(io) {
    io.on('connection', (socket => {
        socket.on('getSectionPointers', () => SectionPointers.get(socket));
        socket.on('setSectionPointerLocation', (data) => SectionPointers.setLocation(io, socket, data));
        socket.on('setSectionPointerAttribute', (data) => SectionPointers.setAttribute(io, socket, data)); 
        socket.on('addSectionPointer', (sectionPointer) => SectionPointers.add(io, socket, sectionPointer));
        socket.on('removeSectionPointer', (sectionPointer) => SectionPointers.remove(io, socket, sectionPointer));
    }));
}

type SectionPointer = {
    id: number;
    type: string;
    pos_x: number;
    pos_y: number;
    section_id: number;
    target_section_id: number;
    realm_id: number;
    name: string;
}

type SectionPointerToAdd = {
    type: string;
    section_id: number;
    target_section_id: number;
    name: string;
}

type SetLocationData = {
    sectionPointer: SectionPointer;
    newLocation: {
        pos_x: number;
        pos_y: number;
        section_id: number;
    }
}

type SetAttributeData = {
    sectionPointer: SectionPointer;
    attribute: string;
    value: string|number|boolean;
}

function isValidSectionPointer(sectionPointer: any): sectionPointer is SectionPointer {
    return typeof sectionPointer.id === 'number' &&
           typeof sectionPointer.type === 'string' &&
           typeof sectionPointer.pos_x === 'number' &&
           typeof sectionPointer.pos_y === 'number' &&
           typeof sectionPointer.section_id === 'number' &&
           typeof sectionPointer.target_section_id === 'number' &&
           typeof sectionPointer.realm_id === 'number';
}

function isValidSetLocationData(data: any): data is SetLocationData {
    return isValidSectionPointer(data.sectionPointer) &&
           typeof data.newLocation.pos_x === 'number' &&
           typeof data.newLocation.pos_y === 'number' &&
           typeof data.newLocation.section_id === 'number';
}

function isValidSetAttributeData(data: any): data is SetAttributeData {
    return isValidSectionPointer(data.sectionPointer) &&
           typeof data.attribute === 'string' &&
           (typeof data.value === 'string' || typeof data.value === 'number' || typeof data.value === 'boolean');
}

function isValidSectionPointerToAdd(sectionPointer: any): sectionPointer is SectionPointerToAdd {
    return typeof sectionPointer.type === 'string' &&
           typeof sectionPointer.section_id === 'number' &&
           typeof sectionPointer.target_section_id === 'number';
}

class SectionPointers {
    private static table = 'section_pointers';

    public static async get(socket: Socket) {
        try {
            const query = `
            SELECT sp.*, s."name" AS "name" 
            FROM ${this.table} sp 
            LEFT JOIN "sections" s ON sp."target_section_id" = s."id" 
            WHERE sp."realm_id" = 1
            `;

            const result = await Database.query(query);
            socket.emit('getSectionPointers', result);
        } catch(err) {
            MessageHandler.sendError(socket, "Failed to fetch Section Pointers.");
        }
    }

    public static async setLocation(io: Server, socket: Socket, data: any) {
        if (!isValidSetLocationData(data)) {
            console.log('Invalid format: SetLocationData.', data);
            MessageHandler.sendError(socket, 'Invalid format: SetLocationData.');
            return;
        }
        
        try {
            const { sectionPointer, newLocation } = data;
            const { pos_x, pos_y, section_id } = newLocation;
            const query = `
                UPDATE ${this.table}
                SET "pos_x" = ${pos_x}, "pos_y" = ${pos_y}, "section_id" = ${section_id}
                WHERE "id" = ${sectionPointer.id}
            `;

            const result = await Database.query(query);
            if (result) {
                io.emit('setSectionPointerLocation', data);
            } else {
                MessageHandler.sendError(socket, 'Failed to update the location.');
            }
            
        } catch(err) {
            console.log(err);
            MessageHandler.sendError(socket, 'Failed to update the location.');
        }
    }

    public static async setAttribute(io: Server, socket: Socket, data: any) {
        if (!isValidSetAttributeData(data)) {
            console.log('Invalid format: SetAttributeData', data);
            MessageHandler.sendError(socket, 'Invalid format: SetAttributeData.');
            return;
        }
        
        try {
            const { sectionPointer, attribute, value } = data;
            const result = await Database.update(this.table, attribute, value, 'id', sectionPointer.id);

            if (result) {
                io.emit('setSectionPointerAttribute', data);
            } else {
                MessageHandler.sendError(socket, 'Failed to set the Section Pointer attribute.');
            }

        } catch(err) {
            console.log(err);
            MessageHandler.sendError(socket, 'Failed to set the Section Pointer attribute.');
        }
    }

    public static async add(io: Server, socket: Socket, sectionPointer: any) {
        if (!isValidSectionPointerToAdd(sectionPointer)) {
            console.log('Invalid format: SectionPointerToAdd', sectionPointer);
            MessageHandler.sendError(socket, 'Invalid format: SectionPointerToAdd.');
            return;
        }

        try {    
            const parsedSectionPointer = {
                ...sectionPointer,
                pos_x: 0,
                pos_y: 0,
                realm_id: 1,
            }

            const result = await Database.add(this.table, parsedSectionPointer, 'id');
            const id = result[0].id;

            if (id) {
                io.emit('addSectionPointer', {...parsedSectionPointer, id});
            } else {
                MessageHandler.sendError(socket, 'Failed to create new Section Pointer.');
            }

        } catch(err) {
            console.log(err);
            MessageHandler.sendError(socket, 'Failed to create new Section Pointer.');
        }
    }

    public static async remove(io: Server, socket: Socket, sectionPointer: any) {
        if (!isValidSectionPointer(sectionPointer)) {
            console.log('Invalid format: SectionPointer', sectionPointer);
            MessageHandler.sendError(socket, 'Invalid format: SectionPointer.');
            return;
        }

        try {
            const result = Database.remove(this.table, 'id', sectionPointer.id);

            if (result) {
                io.emit('removeSectionPointer', sectionPointer);
            } else {
                MessageHandler.sendError(socket, 'Failed to remove Section Pointer.');
            }

        } catch(err) {
            console.log(err);
            MessageHandler.sendError(socket, 'Failed to remove Section Pointer.');
        }
    }
}