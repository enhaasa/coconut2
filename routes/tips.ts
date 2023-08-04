import Database from '../database';
import MessageHandler from '../messages';
import { Time } from '../dbTools_server';
import { Socket, Server } from 'socket.io';

module.exports = function registerHandlers(io) {
    io.on('connection', (socket => {
        socket.on('getTips', () => Tips.get(socket));
        socket.on('addTip', tip => Tips.add(io, socket, tip));
        socket.on('removeTip', tip => Tips.remove(io, socket, tip));
        socket.on('editTip', data => Tips.edit(io, socket, data));
    }));
}

export type Tip = {
    name: string;
    amount: number;
    realm_id: number;
    datetime: string;
    id: number;
}

export type TipToAdd = {
    name: string;
    amount: number;
}

export type TipToEdit = {
    tip: Tip,
    newName: string;
    newAmount: number;
}

function isValidTip(tip: any): tip is Tip {
    return typeof tip.name === 'string' &&
           typeof tip.amount === 'number' &&
           typeof tip.realm_id === 'number' &&
           typeof tip.datetime === 'string' &&
           typeof tip.id === 'number';
}

function isValidTipToAdd(tip: any): tip is TipToAdd {
    return typeof tip.name === 'string' &&
           typeof tip.amount === 'number' &&
           tip.name.trim() !== '';
}

function isValidTipToEdit(tip: any): tip is TipToEdit {
    return typeof tip.tip.id === 'number' &&
           typeof tip.newName === 'string' &&
           typeof tip.newAmount === 'number';
}

class Tips {
    private static table = 'tips';

    public static async get(socket: Socket) {
        try {
            const query = `SELECT * from ${this.table}`;
            const result = await Database.query(query);
            socket.emit('getTips', result);
        } catch(err) {
            MessageHandler.sendError(socket, 'Failed to retrieve tips: ' + err);
        }
    }

    public static async add(io: Server, socket: Socket, tip: any) {
        if (!isValidTipToAdd(tip)) {
            console.log('Invalid format: TipToAdd');
            MessageHandler.sendError(socket, 'Invalid format: TipToAdd. Your request was refused.');
            return;
        }

        const datetime = Time.getCurrentDateTime();
        const parsedTip = {
            ...tip,
            realm_id: 1,
            datetime: datetime,
        }

        try {
            const res = await Database.add(this.table, parsedTip, 'id');
            const id = res[0].id;
            io.emit('addTip', {...parsedTip, id: id});
        } catch(err) {
            console.log('Failed to add tip to the database:', err);
            MessageHandler.sendError(socket, 'Failed to add tip to the database. Request aborted.');
        }
    }

    public static async remove(io: Server, socket: Socket, tip: any) {
        if (!isValidTip(tip)) {
            console.log('Invalid format: Tip');
            MessageHandler.sendError(socket, 'Invalid format: Tip. Your request was refused.');
            return;
        }

        try {
            const result = await Database.remove(this.table, 'id', tip.id);

            if (result) {
                io.emit('removeTip', tip);
            } else {
                MessageHandler.sendError(socket, 'Request failed.');
            }
        } catch(err) {
            console.log(err);
            MessageHandler.sendError(socket, 'Request failed.');
        }
    }

    public static async edit(io: Server, socket: Socket, data: any) {
        if (!isValidTipToEdit(data)) {
            console.log('Invalid format: TipToEdit');
            MessageHandler.sendError(socket, 'Invalid format: TipToEdit. Your request was refused.');
            return;
        }
    
        try {
            const { tip, newName, newAmount } = data;
    
            // Update name if it's provided
            if (newName && newName.trim() !== "") {
                const resultName = await Database.update(Tips.table, 'name', newName, 'id', tip.id);
                if (resultName) {
                    io.emit('editTip', tip, 'name', newName);
                } else {
                    MessageHandler.sendError(socket, 'Failed to update the name.');
                    return;  // exit if one of the updates fail to keep data consistent
                }
            }
    
            // Update amount if it's provided
            if (typeof newAmount === 'number' && newAmount >= 0) {
                const resultAmount = await Database.update(Tips.table, 'amount', newAmount, 'id', tip.id);
                if (resultAmount) {
                    io.emit('editTip', tip, 'amount', newAmount);
                } else {
                    MessageHandler.sendError(socket, 'Failed to update the amount.');
                }
            }
    
        } catch (error) {
            MessageHandler.sendError(socket, 'Failed to edit the tip: ' + error);
            console.log('Error occurred while editing the tip:', error);
        }
    }
}