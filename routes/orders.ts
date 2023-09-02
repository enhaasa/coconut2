import Database from '../database';
import MessageHandler from '../messages';
import { Socket, Server } from 'socket.io';
import { Time } from '../dbTools_server';
import { 
    Customer, isValidCustomer,
    Seating, isValidSeating,
    Order, isValidOrder,
    Service, isValidService,
} from '../shared/types';

module.exports = function registerHandlers(io) {
    io.on('connection', (socket => {
        socket.on('getOrders', () => Orders.get(socket));
        socket.on('addOrder', (data) => Orders.add(io, socket, data));
        socket.on('deliverOrder', (data => Orders.deliver(io, socket, data)));
        socket.on('deliverAllByCustomer', (data => Orders.deliverAllByCustomer(io, socket, data)));
        socket.on('removeOrder', (order) => Orders.remove(io, socket, order));
        socket.on('payOrdersInSeating', (data) => Orders.payOrdersInSeating(io, socket, data))
    }));
}

type OrderToAdd = {
    order: {
        is_delivered: boolean;
        name: string;
        price: number;
        section_id: number;
        customer_id: number;
        seating_id: number;
        item: string;
    }
    requestID?: string;
}

type OrdersInSeating = {
    orders: Order[];
    seating: Seating;
    requestID?: string;
}

type OrderToDeliver = {
    order: Order;
    requestID?: string;
}

type OrdersToDeliverByCustomer = {
    customer: Customer;
    requestID?: string;
}

function isValidOrderToAdd(data: any): data is OrderToAdd {
    const { order } = data;

    return typeof order.is_delivered === 'boolean' &&
           typeof order.name === 'string' &&
           typeof order.price === 'number' &&
           typeof order.section_id === 'number' &&
           typeof order.customer_id === 'number' &&
           typeof order.seating_id === 'number' &&
           typeof order.item === 'string';
}

function isValidOrderToDeliver(data: any): data is OrderToDeliver {
    return isValidOrder(data.order);
}

function isValidOrdersToDeliverByCustomer(data: any): data is OrdersToDeliverByCustomer {
    return isValidCustomer(data.customer);
}

function isValidOrdersInSeating(data: any): data is OrdersInSeating {
    return Array.isArray(data.orders) && data.orders.every(isValidOrder) &&
           isValidSeating(data.seating);
}

export class Orders {
    private static table = 'orders';

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
            socket.emit('getOrders', result);
        } catch (err) {
            console.log('Failed to fetch orders.', err);
            MessageHandler.sendError(socket, 'Failed to fetch orders.');
        }
    }

    public static async add(io: Server, socket: Socket, data: any) {
        try {
            delete data.order.id;
            if (!isValidOrderToAdd(data)) {
                console.log('Invalid format: OrderToAdd', data);
                MessageHandler.sendError(socket, 'Invalid format: OrderToAdd.');
                return;
            }
        } catch(err) {
            console.log(err);
        }
        
        try {
            const { order, requestID } = data;

            const orderToAdd = {
                is_delivered: order.is_delivered,
                name: order.name,
                price: order.price,
                customer_id: order.customer_id,
                item: order.item,
                time: Time.getCurrentTime(),
                datetime: Time.getCurrentDateTime(),
            }
    
            const result = await Database.add(this.table, orderToAdd, 'id');
            const id = result[0].id;

            if (id) {
                socket.emit('getRequestConfirmation', requestID);
                io.emit('addOrder', {
                    ...orderToAdd, 
                    seating_id: order.seating_id,
                    section_id: order.section_id,
                    realm_id: 1,
                    id: id
                });
            } else {
                MessageHandler.sendError(socket, 'Failed to add order.');
            }
        } catch (err) {
            console.error('Failed to add order:', err);
            MessageHandler.sendError(socket, 'Failed to add order.');
        }
    }

    public static async deliver(io: Server, socket: Socket, data: any) {
        if (!isValidOrderToDeliver(data)) {
            console.log('Invalid format: OrderToDeliver', data);
            MessageHandler.sendError(socket, 'Invalid format: OrderToDeliver.');
            return;
        }
 
        const { order, requestID } = data;

        try {
            const result = await Database.update(this.table, 'is_delivered', true, 'id', order.id);

            if (result) {
                io.emit('deliverOrder', order);
                socket.emit('getRequestConfirmation', requestID);
            } else {
                console.error('Failed to deliver order.');
                MessageHandler.sendError(socket, 'Failed to deliver order.');
            }
            io.emit('deliverOrder', order);
        } catch (err) {
            console.error('Failed to deliver order:', err);
            MessageHandler.sendError(socket, 'Failed to deliver order.');
        }
    }

    public static async deliverAllByCustomer(io: Server, socket: Socket, data: any) {
        if (!isValidOrdersToDeliverByCustomer(data)) {
            console.log('Invalid format: Customer', data);
            MessageHandler.sendError(socket, 'Invalid format: Customer.');
            return;
        }

        const { customer, requestID } = data;
    
        try {
            const result = await Database.update(this.table, 'is_delivered', true, 'customer_id', customer.id);
    
            if (result) {
                io.emit('deliverAllOrdersByCustomer', customer);
                socket.emit('getRequestConfirmation', requestID);
            } else {
                console.error('Failed to deliver all orders for customer.');
                MessageHandler.sendError(socket, 'Failed to deliver all orders for customer.');
            }
        } catch (err) {
            console.error('Failed to deliver all orders for customer:', err);
            MessageHandler.sendError(socket, 'Failed to deliver all orders for customer.');
        }
    }

    public static async payOrdersInSeating(io: Server, socket: Socket, data: any) {
        if (!isValidOrdersInSeating(data)) {
            console.log('Invalid format: OrdersInSeating');
            MessageHandler.sendError(socket, 'Invalid format: OrdersInSeating. Your request was refused.');
            return;
        }
        
        const { orders, seating, requestID } = data;
        const { waiter, customers, section_name, number } = seating;
        const price = orders.reduce((total: number, order) => (total + order.price), 0);
    
        const channel = {
            name: number,
            section_name,
        }
    
        const archived_session = {
            waiter,
            channel: JSON.stringify(channel),
            customers: JSON.stringify(customers.map(customer => customer.name)),
            orders: JSON.stringify(orders),
            price,
            datetime: Time.getCurrentDateTime(),
            amount_paid: price,
            realm_id: 1,
        }
    
        try {
            const result = await Database.add('archived_sessions', archived_session, 'id');
            const id = result[0].id;
    
            if (id) {
                const delete_delivered_orders_query = `
                    DELETE FROM "orders" 
                    WHERE "is_delivered" = true
                    AND "seating_id" = ${seating.id}
                `;
                
                try {
                    await Database.query(delete_delivered_orders_query);
                    io.emit('removeAllDeliveredOrdersFromSeating', seating);
                    io.emit('addArchivedSession', {...archived_session, id: id});
                    socket.emit('getRequestConfirmation', requestID);
                } catch (err) {
                    console.log('Failed to delete delivered orders from the database:', err);
                    MessageHandler.sendError(socket, 'Failed to delete delivered orders from the database. Please try again.');
                }
            } else {
                console.log("Failed to get new session ID from database.")
                MessageHandler.sendError(socket, 'Failed to archive the session. Please try again.');
            }
        } catch (err) {
            console.log('Failed to add archived session to the database:', err);
            MessageHandler.sendError(socket, 'Failed to archive the session. Please try again.');
        }
    }

    public static async remove(io: Server, socket: Socket, order: any) {
        delete order.amount;
        delete order.total;
        if (!isValidOrder(order)) {
            console.log('Invalid format: Order', order);
            MessageHandler.sendError(socket, 'Invalid format: Order.');
            return;
        }
    
        try {
            const result = await Database.remove(this.table, 'id', order.id);

            if (result) {
                io.emit('removeOrder', order);
            } else {
                MessageHandler.sendError(socket, 'Failed to remove order.');
            }
        } catch (err) {
            console.error('Failed to remove order:', err);
            MessageHandler.sendError(socket, 'Failed to remove order.');
        }
    }
}