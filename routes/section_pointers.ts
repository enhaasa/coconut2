import Database from '../database';
import { Socket, Server } from 'socket.io';

module.exports = function registerHandlers(io) {
    io.on('connection', (socket => {
        socket.on('getSectionPointers', () => SectionPointers.get(socket));
        socket.on('setSectionPointerLocation', (data) => SectionPointers.setLocation(io, data));
        socket.on('setSectionPointerAttribute', (data) => SectionPointers.setAttribute(io, data)); 
        socket.on('addSectionPointer', (sectionPointer) => SectionPointers.add(io, sectionPointer));
        socket.on('removeSectionPointer', (sectionPointer) => SectionPointers.remove(io, sectionPointer));
    }));
}

class SectionPointers {
    private static table = 'section_pointers';

    public static async get(socket: Socket) {
        const query = `
            SELECT sp.*, s."name" AS "name" 
            FROM ${this.table} sp 
            LEFT JOIN "sections" s ON sp."target_section_id" = s."id" 
            WHERE sp."realm_id" = 1
        `;
        const result = await Database.query(query);

        socket.emit('getSectionPointers', result);
    }

    public static async setLocation(io: Server, data) {
        try {
            const { sectionPointer, newLocation } = data;
            const { pos_x, pos_y, section_id } = newLocation;

            const query = `
                UPDATE ${this.table}
                SET "pos_x" = ${pos_x}, "pos_y" = ${pos_y}, "section_id" = ${section_id}
                WHERE "id" = ${sectionPointer.id}
            `;

            Database.query(query).then(res => {
                if (res) {
                    io.emit('setSectionPointerLocation', data);
                }
            });
            
        } catch(err) {
            console.log(err);
        }
    }

    public static async setAttribute(io: Server, data) {
        try {
            const { sectionPointer, attribute, value } = data;

            Database.update(this.table, attribute, value, 'id', sectionPointer.id);
            io.emit('setSectionPointerAttribute', data);
        } catch(err) {
            console.log(err);
        }
    }

    public static async add(io: Server, sectionPointer) {
        try {    
            const parsedSectionPointer = {
                ...sectionPointer,
                pos_x: 0,
                pos_y: 0,
                realm_id: 1,
            }

            delete parsedSectionPointer.id;

            const res = await Database.add(this.table, parsedSectionPointer, 'id');
            const id = res[0].id;

            io.emit('addSectionPointer', {...parsedSectionPointer, id});
        } catch(err) {
            console.log(err);
        }
    }

    public static async remove(io: Server, sectionPointer) {
        Database.remove(this.table, 'id', sectionPointer.id);
        io.emit('removeSectionPointer', sectionPointer);
    }
}