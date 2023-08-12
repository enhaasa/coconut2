import Database from '../database';
import MessageHandler from '../messages';
import { Socket, Server } from 'socket.io';
import { SectionPointer, isValidSectionPointer } from '../shared/types';

module.exports = function registerHandlers(io) {
    io.on('connection', (socket => {
        socket.on('getSectionPointers', () => SectionPointers.get(socket));
        socket.on('setSectionPointerLocation', (data) => SectionPointers.setLocation(io, socket, data));
        socket.on('setSectionPointerAttribute', (data) => SectionPointers.setAttribute(io, socket, data)); 
        socket.on('addSectionPointer', (sectionPointer) => SectionPointers.add(io, socket, sectionPointer));
        socket.on('removeSectionPointer', (sectionPointer) => SectionPointers.remove(io, socket, sectionPointer));
        socket.on('setSectionPointerAttributes', (data) => SectionPointers.setAttributes(io, socket, data));
    }));
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
    requestID?: string;
}

function isValidSetLocationData(data: any): data is SetLocationData {
    try {
        return isValidSectionPointer(data.sectionPointer) &&
            typeof data.newLocation.pos_x === 'number' &&
            typeof data.newLocation.pos_y === 'number' &&
            typeof data.newLocation.section_id === 'number';
    } catch(err) {
        console.log(err);
    }
}

function isValidSetAttributeData(data: any): data is SetAttributeData {
    try {
        return isValidSectionPointer(data.sectionPointer) &&
            typeof data.attribute === 'string' &&
            (typeof data.value === 'string' || typeof data.value === 'number' || typeof data.value === 'boolean');
    } catch(err) {
        console.log(err);
    }
}

function isValidSectionPointerToAdd(sectionPointer: any): sectionPointer is SectionPointerToAdd {
    try {
        return typeof sectionPointer.type === 'string' &&
            typeof sectionPointer.section_id === 'number' &&
            typeof sectionPointer.target_section_id === 'number';
    } catch(err) {
        console.log(err);
    }
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
            const { sectionPointer, attribute, value, requestID } = data;
            const result = await Database.update(this.table, attribute, value, 'id', sectionPointer.id);

            if (result) {
                io.emit('setSectionPointerAttribute', data);
                socket.emit('getRequestConfirmation', requestID);
            } else {
                MessageHandler.sendError(socket, 'Failed to set the Section Pointer attribute.');
            }

        } catch(err) {
            console.log(err);
            MessageHandler.sendError(socket, 'Failed to set the Section Pointer attribute.');
        }
    }

    public static async setAttributes(io: Server, socket: Socket, data: any) {
        try {
            const { sectionPointer, attributes, requestID } = data;

            if (attributes.length === 0) {
                socket.emit('getRequestConfirmation', requestID);
                return;
            }

            const attributes_string = attributes.map(a => `"${a[0]}" = '${a[1]}'`).join(', ');
            const query = `
                UPDATE ${this.table}
                SET ${attributes_string}
                WHERE id = ${sectionPointer.id}
            `;

            const result = await Database.query(query);
            
            if (result) {
                io.emit('setSectionPointerAttributes', data);
                socket.emit('getRequestConfirmation', requestID);
            } else {
                MessageHandler.sendError(socket, 'Failed to set the Section Pointer attributes.');
            }
            
        } catch(err) {
            console.log(err);
            MessageHandler.sendError(socket, 'Failed to set the Section Pointer attribute.');
        }
    }

    public static async add(io: Server, socket: Socket, data: any) {
        if (!isValidSectionPointerToAdd(data.sectionPointer)) {
            console.log('Invalid format: SectionPointerToAdd', data);
            MessageHandler.sendError(socket, 'Invalid format: SectionPointerToAdd.');
            return;
        }

        try {    
            const { sectionPointer, requestID } = data;

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
                socket.emit('getRequestConfirmation', requestID);
            } else {
                MessageHandler.sendError(socket, 'Failed to create new Section Pointer.');
            }

        } catch(err) {
            console.log(err);
            MessageHandler.sendError(socket, 'Failed to create new Section Pointer.');
        }
    }

    public static async remove(io: Server, socket: Socket, data: any) {
        if (!isValidSectionPointer(data.sectionPointer)) {
            console.log('Invalid format: SectionPointer', data);
            MessageHandler.sendError(socket, 'Invalid format: SectionPointer.');
            return;
        }

        try {
            const { sectionPointer, requestID } = data;
            const result = Database.remove(this.table, 'id', sectionPointer.id);

            if (result) {
                io.emit('removeSectionPointer', sectionPointer);
                socket.emit('getRequestConfirmation', requestID);
            } else {
                MessageHandler.sendError(socket, 'Failed to remove Section Pointer.');
            }

        } catch(err) {
            console.log(err);
            MessageHandler.sendError(socket, 'Failed to remove Section Pointer.');
        }
    }
}