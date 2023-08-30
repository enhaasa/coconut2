import Database from "../database";
import MessageHandler from "../messages";
import { Time } from "../dbTools_server";
import { Server, Socket } from "socket.io";
import {
    Customer, 
    isValidCustomer,
} from '../shared/types';

module.exports = function registerHandlers(io) {
    io.on('connection', (socket => {
        socket.on('getServices', () => Services.get(socket));
        socket.on('addService', (data) => Services.add(io, socket, data));
    }));
}

type ServiceToAdd = {
    service: {
        name: string;
        price: number;
        is_completed: boolean;
        minute_interval: number;
        immediateStart: boolean;
        start_datetime: string;
        end_datetime: string;
        customer_id: number;
    }
    requestID?: string;
}

function isValidServiceToAdd(data: any) {
    const { service } = data;

    return typeof service.name === 'string' &&
           typeof service.price === 'number' &&
           typeof service.is_completed === 'boolean' &&
           typeof service.minute_interval === 'number' &&
           typeof service.immediateStart === 'boolean' &&
           typeof service.section_id === 'number' &&
           typeof service.customer_id === 'number' &&
           typeof service.seating_id === 'number'
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

            let start_datetime = service.start_datetime;
            if (service.immediateStart) {
                start_datetime = Time.getCurrentDateTime();
            }

            const serviceToAdd = {
                name: service.name,
                price: service.price,
                total: null,
                minute_interval: service.minute_interval,
                start_datetime,
                end_datetime: null,
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
                    id,
                });
            }

        } catch(err) {
            console.error('Failed to add service:', err);
            MessageHandler.sendError(socket, 'Failed to add service.');
        }
    }
}