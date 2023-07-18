import Database from './../database';
import { Time } from '../dbTools_server';
import { Socket, Server } from 'socket.io';

module.exports = function registerHandlers(io) {
    io.on('connection', (socket => {
        socket.on('getTips', () => Tips.get(socket));
        socket.on('addTip', tip => Tips.add(io, tip));
        socket.on('removeTip', tip => Tips.remove(io, tip));
        socket.on('editTip', data => Tips.edit(io, data));
    }));
}

class Tips {
    private static table = 'tips';

    public static async get(socket: Socket) {
        const query = `SELECT * from ${this.table}`;
        const result = await Database.query(query);

        socket.emit('getTips', result);
    }

    public static async add(io: Server, tip) {

        const datetime = Time.getCurrentDateTime();

        const parsedTip = {
            ...tip,
            realm_id: 1,
            datetime: datetime,
        }

        const id = await Database.add(this.table, parsedTip);
        io.emit('addTip', {...parsedTip, id: id});
    }

    public static async remove(io: Server, tip) {

        Database.remove(this.table, 'id', tip.id);
        io.emit('removeTip', tip);
    }

    public static async edit(io: Server, data) {

        try {
            const { tip, newName, newAmount } = data;
            const columnsToChange = [];
            
            if (tip.name !== newName) columnsToChange.push({key: 'name', value: newName});
            if (tip.amount !== newAmount) columnsToChange.push({key: 'amount', value: newAmount});

            console.log(tip);
            console.log(newAmount)

            if (columnsToChange.length > 0) {
                let query = `UPDATE ${this.table} 
                SET ${columnsToChange.map(column => `${column.key} = ${column.value},`)}
                WHERE "id" = ${tip.id}
                `;

                console.log(query)
                Database.query(query);
            }

        } catch (error) {
            console.log('Garbage data provided. Aborting.');
            console.log(error);
        }
    
    }

}