import Database from "../database";
import MessageHandler from "../messages";
import { Time } from "../dbTools_server";
import { Server, Socket } from "socket.io";
import {
    isValidService,
} from '../shared/types';
import { calculatePPMTotal } from "../dbTools_server";

module.exports = function registerHandlers(io: Server) {
    io.on('connection', (socket => {
        socket.on('getServices', () => Services.get(socket));
        socket.on('addService', (data) => Services.add(io, socket, data));
        socket.on('removeService', (data) => Services.remove(io, socket, data));
        socket.on('startService', (service) => Services.start(io, socket, service));
        socket.on('stopService', (service) => Services.stop(io, socket, service));
        socket.on('restartService', (service) => Services.restart(io, socket, service));
        socket.on('completeService', (service) => Services.complete(io, socket, service));
    }));
}

type ServiceToAdd = {
    service: {
        name: string;
        price: number;
        is_completed: boolean;
        minute_interval: number;
        is_scheduled: boolean;
        pref_start_datetime: string;
        start_datetime: string;
        end_datetime: string;
        customer_id: number;
    }
    requestID?: string;
}

function isValidServiceToAdd(data: any): data is ServiceToAdd {
    const { service } = data;

    return typeof service.name === 'string' &&
           typeof service.price === 'number' &&
           typeof service.minute_interval === 'number' &&
           typeof service.is_scheduled === 'boolean' &&
           typeof service.section_id === 'number' &&
           typeof service.customer_id === 'number' &&
           typeof service.seating_id === 'number'
}

type ServiceToRemove = {
    service: {
        id: number;
    }
    requestID: string;
}

function isValidServiceToRemove(data: any): data is ServiceToRemove {
    return typeof data.service.id === 'number';
}

export class Services {
    private static table = 'services';

    public static async get(socket: Socket) {
        try {
            const query = `
                SELECT t.*, sect.realm_id, cust.seating_id, seat.section_id
                FROM ${this.table} t 
                JOIN customers cust ON t.customer_id = cust.id 
                JOIN seatings seat ON cust.seating_id = seat.id
                JOIN sections sect ON seat.section_id = sect.id
                WHERE sect.realm_id = 1;
            `;
            const result = await Database.query(query);
            socket.emit('getServices', result);
        } catch (err) {
            console.log('Failed to fetch services.', err);
            MessageHandler.sendError(socket, 'Failed to fetch services');
        }
    }

    public static async add(io: Server, socket: Socket, data: any) {
        try {
            delete data.service.id;
            if (!isValidServiceToAdd(data)) {
                console.log('Invalid format: ServiceToAdd', data);
                MessageHandler.sendError(socket, 'invalid format: ServiceToAdd');
                return;
            }
        } catch(err) {
            console.log(err);
        }

        try {
            const { service, requestID } = data;

            let pref_start_datetime = service.pref_start_datetime;
            if (service.pref_start_datetime === 'null null') {

                if (service.is_scheduled) {
                    pref_start_datetime = Time.getCurrentDateTime();
                } else {
                    pref_start_datetime = null;
                }
            }

            if (service.start_datetime === 'null null') service.start_datetime = null;
            if (service.end_datetime === 'null null') service.end_datetime = null;

            const serviceToAdd = {
                name: service.name,
                price: service.price,
                total: null,
                minute_interval: service.minute_interval,
                pref_start_datetime: pref_start_datetime,
                start_datetime: service.start_datetime,
                end_datetime: service.end_datetime,
                is_completed: false,
                customer_id: service.customer_id,
            }

            const result = await Database.add(this.table, serviceToAdd, 'id');
            const id = result[0].id;

            if (id) {
                socket.emit('getRequestConfirmation', requestID);
                io.emit('addService', {
                    ...serviceToAdd,
                    section_id: service.section_id,
                    seating_id: service.seating_id,
                    realm_id: service.realm_id,
                    id,
                });
            }
        } catch(err) {
            console.error('Failed to add service:', err);
            MessageHandler.sendError(socket, 'Failed to add service.');
        }
    }

    public static async remove(io: Server, socket: Socket, data: any) {    
        try {
            console.log(data)

            if (!isValidServiceToRemove(data)) {
                console.log('Invalid format: Service', data.service);
                MessageHandler.sendError(socket, 'Invalid format: Service.');
                return;
            }

            const { service, requestID } = data;

            const result = await Database.remove(this.table, 'id', service.id);

            if (result) {
                io.emit('removeService', service);
                socket.emit('getRequestConfirmation', requestID);
            } else {
                MessageHandler.sendError(socket, 'Failed to remove service.');
            }
        } catch (err) {
            console.error('Failed to remove service:', err);
            MessageHandler.sendError(socket, 'Failed to remove service.');
        }
    }

    public static async start(io: Server, socket: Socket, data: any) {
        try {
            if (!isValidService(data.service)) {
                console.log('Invalid format: Service', data.service);
                MessageHandler.sendError(socket, 'Invalid format: Service.');
                return;
            }

            const { service, requestID } = data;

            const end_datetime_exists_query = `
                SELECT end_datetime 
                FROM ${this.table}
                WHERE id = ${service.id}
            `;

            const end_datetime_exists = await Database.query(end_datetime_exists_query);
            if (end_datetime_exists && end_datetime_exists[0].end_datetime) {
                const query = `
                    UPDATE ${this.table}
                    SET end_datetime = null
                    WHERE id = ${service.id}
                `;
                const result = await Database.query(query);

                if (result) {
                    io.emit('setServiceAttributes', {service, attributes: [['end_datetime', null]]});
                    socket.emit('getRequestConfirmation', requestID);
                } else {
                    console.error('Failed to start service.');
                    MessageHandler.sendError(socket, 'Failed to start service.');
                }
                return;
            }

            const currentDatetime = Time.getCurrentDateTime();
            const query = `
                UPDATE ${this.table}
                SET start_datetime = '${currentDatetime}'
                WHERE id = ${service.id}
            `;

            const result = await Database.query(query);

            if (result) {
                io.emit('setServiceAttributes', {service, attributes: [['start_datetime', currentDatetime]]});
                socket.emit('getRequestConfirmation', requestID);
            } else {
                console.error('Failed to start service.');
                MessageHandler.sendError(socket, 'Failed to start service.');
            }
        } catch(err) {
            console.error('Failed to start service.', err);
            MessageHandler.sendError(socket, 'Failed to start service.');
        }
    }

    public static async stop(io: Server, socket: Socket, data: any) {
        try {
            if (!isValidService(data.service)) {
                console.log('Invalid format: Service', data.service);
                MessageHandler.sendError(socket, 'Invalid format: Service.');
                return;
            }

            const { service, requestID } = data;
            const currentDatetime = Time.getCurrentDateTime();

            const query = `
                UPDATE ${this.table}
                SET end_datetime = '${currentDatetime}'
                WHERE id = ${service.id}
            `;

            const result = await Database.query(query);

            if (result) {
                io.emit('setServiceAttributes', {service, attributes: [['end_datetime', currentDatetime]]});
                socket.emit('getRequestConfirmation', requestID);
            } else {
                console.error('Failed to stop service.');
                MessageHandler.sendError(socket, 'Failed to stop service.');
            }
        } catch(err) {
            console.error('Failed to stop service.', err);
            MessageHandler.sendError(socket, 'Failed to stop service.');
        }
    }

    public static async restart(io: Server, socket: Socket, data: any) {
        try {
            if (!isValidService(data.service)) {
                console.log('Invalid format: Service', data.service);
                MessageHandler.sendError(socket, 'Invalid format: Service.');
                return;
            }

            const { service, requestID } = data;

            const query = `
                UPDATE ${this.table}
                SET start_datetime = null, end_datetime = null
                WHERE id = ${service.id}
            `;

            console.log(query)
            const result = await Database.query(query);

            if (result) {
                io.emit('setServiceAttributes', {service, attributes: [['start_datetime', null], ['end_datetime', null]]});
                socket.emit('getRequestConfirmation', requestID);
            } else {
                console.error('Failed to restart service.');
                MessageHandler.sendError(socket, 'Failed to restart service.');
            }
        } catch(err) {
            console.error('Failed to restart service.', err);
            MessageHandler.sendError(socket, 'Failed to restart service.');
        }
    }

    public static async complete(io: Server, socket: Socket, data: any) {
        try {
            if (!isValidService(data.service)) {
                console.log('Invalid format: Service', data.service);
                MessageHandler.sendError(socket, 'Invalid format: Service.');
                return;
            }

            const { service, requestID } = data;
            const total = calculatePPMTotal(
                service.start_datetime,
                service.end_datetime,
                service.minute_interval,
                service.price
            );

            const query = `
                UPDATE ${this.table}
                SET is_completed = true, total = ${total}
                WHERE id = ${service.id}
            `;

            const result = await Database.query(query);

            if (result) {
                io.emit('setServiceAttributes', {service, attributes: [['is_completed', true], ['total', total]]});
                socket.emit('getRequestConfirmation', requestID);
            } else {
                console.error('Failed to complete service.');
                MessageHandler.sendError(socket, 'Failed to complete service.');
            }
        } catch(err) {
            console.error('Failed to complete service.', err);
            MessageHandler.sendError(socket, 'Failed to complete service.');
        }
    }
}